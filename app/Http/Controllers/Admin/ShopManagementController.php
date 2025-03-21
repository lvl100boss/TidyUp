<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\ShopCategory;
use App\Models\Categories;
use App\Models\ShopLegalDocument;
use App\Notifications\ShopVerifiedNotification;
use App\Notifications\ShopRejectedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ShopManagementController extends Controller
{
    public function index()
    {
        // Get all shops with relationships
        $shops = Shop::with(['user', 'shopCategories.categories'])->get();

        // Get categories for filtering
        $categories = Categories::all();

        // Get raw categories data to help with debugging
        $rawCategoriesData = ShopCategory::with('categories')->get()->map(function ($item) {
            return [
                'shop_id' => $item->shop_id,
                'category_id' => $item->category_id,
                'category_name' => $item->categories ? $item->categories->name : 'Unknown'
            ];
        });

        return Inertia::render('Admin/Shops', [
            'shops' => $shops,
            'categories' => $categories,
            'rawCategoriesData' => $rawCategoriesData
        ]);
    }

    public function show($id)
    {
        // Fetch the shop with all necessary relationships
        $shop = Shop::with([
            'user',
            'shopCategories.categories',
            'shopGallery',
            'shopOperationHours',
            'shopServiceCategories.serviceCategories',
            'shopStaffs.staff',
            'legalDocuments'
        ])->findOrFail($id);

        // Get categories for reference
        $categories = Categories::all();

        // Fetch legal documents
        $legalDocs = ShopLegalDocument::where('shop_id', $id)->first();

        // Create a more structured format for shop setup data to display in the admin panel
        $setupData = [
            'basicInfo' => [
                'shop_name' => $shop->shop_name,
                'bio' => $shop->bio,
                'email' => $shop->email,
                'contact_number' => $shop->contact_number,
            ],
            'location' => [
                'region' => $shop->region,
                'province' => $shop->province,
                'city' => $shop->city,
                'barangay' => $shop->barangay,
                'detailed_address' => $shop->detailed_address,
            ],
            'categories' => $shop->shopCategories->map(function ($category) {
                return [
                    'id' => $category->category_id,
                    'name' => $category->categories ? $category->categories->name : 'Unknown Category'
                ];
            }),
            'documents' => $legalDocs ? [
                'business_permit' => $legalDocs->business_permit_url,
                'dti_registration' => $legalDocs->dti_registration_url,
                'valid_id' => $legalDocs->valid_id_url,
            ] : null,
            'operationHoursFormatted' => $this->formatOperationHours($shop->shopOperationHours),
        ];

        // Log the full shop data for debugging
        Log::debug('Shop details for admin', [
            'shop_id' => $id,
            'setup_data' => $setupData
        ]);

        return Inertia::render('Admin/ShopDetails', [
            'shop' => $shop,
            'categories' => $categories,
            'setupData' => $setupData,
        ]);
    }

    /**
     * Format operation hours to be more readable
     */
    private function formatOperationHours($hours)
    {
        $formatted = [];

        if (!$hours || !is_iterable($hours)) {
            Log::warning('Invalid operation hours data structure', ['hours' => $hours]);
            return $formatted;
        }

        // Days of week for consistent display
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        // First initialize all days as closed
        foreach ($days as $day) {
            $formatted[$day] = [
                'isOpen' => false,
                'openTime' => '09:00',
                'closeTime' => '17:00',
            ];
        }

        // Then update with actual values from the database
        foreach ($hours as $hour) {
            if (!isset($hour->day)) {
                continue;
            }

            // Convert day to proper case for consistent keys
            $day = ucfirst(strtolower($hour->day));

            if (!in_array($day, $days)) {
                continue;
            }

            $formatted[$day] = [
                'isOpen' => (bool)$hour->is_open,
                'openTime' => $hour->open_time ? substr($hour->open_time, 0, 5) : null,
                'closeTime' => $hour->close_time ? substr($hour->close_time, 0, 5) : null,
            ];
        }

        return $formatted;
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:processing,verified,rejected',
            'rejection_reason' => 'required_if:status,rejected',
        ]);

        DB::beginTransaction();

        try {
            $shop = Shop::with('user')->findOrFail($id);
            $oldStatus = $shop->status;

            // Update shop status fields
            $shop = Shop::findOrFail($id);
            $shop->update($validated);
            // Update verification related fields based on status
            if ($validated['status'] === 'verified') {
                $shop->update([
                    'is_verified' => 1,
                    'verification_status' => 'approved',
                    'verified_at' => now(),
                    'rejection_reason' => null
                ]);
            } elseif ($validated['status'] === 'rejected') {
                $shop->update([
                    'is_verified' => 0,
                    'verification_status' => 'rejected',
                    'rejection_reason' => $validated['rejection_reason']
                ]);
            } else {
                $shop->update([
                    'is_verified' => 0,
                    'verification_status' => 'pending',
                    'rejection_reason' => null
                ]);
            }
            DB::commit();

            return back()->with('message', 'Shop status updated successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error updating shop status', [
                'shop_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);

            return back()->with('message', 'An error occurred while updating the shop status: ' . $e->getMessage())->with('success', false);
        }
    }

    public function downloadDocument($id, $type)
    {
        try {
            $document = ShopLegalDocument::where('shop_id', $id)->firstOrFail();

            $url = null;
            switch ($type) {
                case 'business-permit':
                    $url = $document->business_permit_url;
                    break;
                case 'dti-registration':
                    $url = $document->dti_registration_url;
                    break;
                case 'valid-id':
                    $url = $document->valid_id_url;
                    break;
                default:
                    return response()->json(['error' => 'Invalid document type'], 400);
            }

            if (!$url) {
                return response()->json(['error' => 'Document not found'], 404);
            }

            // Log the public URL for debugging
            Log::info("{$type} public URL:", ['url' => url($url)]);

            // Remove 'storage/' from the start if present
            $path = str_replace('storage/', '', $url);
            $fullPath = public_path('storage/' . $path);

            // Check if file exists
            if (!file_exists($fullPath)) {
                Log::error('File not found on server', [
                    'path' => $fullPath,
                    'url' => $url
                ]);
                return response()->json(['error' => 'File not found on server'], 404);
            }

            Log::info('Admin downloaded shop document', [
                'shop_id' => $id,
                'document_type' => $type,
                'admin_id' => auth()->id(),
                'path' => $fullPath
            ]);

            // Get filename from path
            $filename = pathinfo($fullPath, PATHINFO_BASENAME);
            $fileExtension = pathinfo($fullPath, PATHINFO_EXTENSION);

            // Make a more readable filename
            $downloadName = "shop_{$id}_{$type}.{$fileExtension}";

            // Return file download
            return response()->download($fullPath, $downloadName);
        } catch (\Exception $e) {
            Log::error('Error downloading shop document', [
                'shop_id' => $id,
                'document_type' => $type,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['error' => 'An error occurred while downloading the document: ' . $e->getMessage()], 500);
        }
    }
}
