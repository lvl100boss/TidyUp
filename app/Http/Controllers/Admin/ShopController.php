<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\Categories;
use App\Models\ShopCategory;
use App\Models\ShopLegalDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Notifications\ShopVerificationNotification;
use App\Notifications\ShopRejectionNotification;

class ShopController extends Controller
{
    /**
     * Display a listing of shops.
     */
    public function index(Request $request)
    {
        $query = Shop::with([
            'user',
            'shopCategories.categories',
            'legalDocuments',
            'shopOperationHours'
        ])
            ->orderByRaw("FIELD(status, 'processing', 'rejected', 'verified')")
            ->orderBy('created_at', 'desc');

        // Add search filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('shop_name', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                    });
            });
        }

        // Add status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Add debug logging
        Log::info('Fetching shops for admin', [
            'filters' => $request->only(['search', 'status']),
            'count' => $query->count()
        ]);

        $shops = $query->get()->map(function ($shop) {
            // Safely format the date
            $shop->formatted_date = optional($shop->created_at)->format('n/j/Y');
            return $shop;
        });

        return Inertia::render('Admin/Shops', [
            'shops' => $shops,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Display the specified shop.
     */
    public function show(Shop $shop)
    {
        // Load shop with relationships
        $shop->load([
            'user',
            'shopCategories.categories',
            'shopGallery',
            'shopServiceCategories.serviceCategories',
            'legalDocuments',
            'shopOperationHours'
        ]);

        // Log the raw legal documents data
        Log::info('Raw Legal Documents:', [
            'shop_id' => $shop->id,
            'documents' => $shop->legalDocuments
        ]);

        // Transform legal documents
        if ($shop->legalDocuments) {
            $shop->legalDocuments = [
                'business_permit_url' => $shop->legalDocuments->business_permit_url,
                'dti_registration_url' => $shop->legalDocuments->dti_registration_url,
                'valid_id_url' => $shop->legalDocuments->valid_id_url,
            ];
        }

        // Fetch setup data (replace with your actual logic)
        $setupData = [
            'basicInfo' => [
                'shop_name' => $shop->shop_name,
                'email' => $shop->email,
                'contact_number' => $shop->contact_number,
                'bio' => $shop->bio,
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
                    'id' => $category->categories->id,
                    'name' => $category->categories->name,
                ];
            }),
            'operationHoursFormatted' => $this->formatOperationHours($shop), // Add formatted operation hours
        ];

        return Inertia::render('Admin/ShopDetails', [
            'shop' => $shop,
            'categories' => Categories::all(),
            'setupData' => $setupData,
        ]);
    }

    /**
     * Format operation hours for display.
     *
     * @param  \App\Models\Shop  $shop
     * @return array
     */
    protected function formatOperationHours(Shop $shop)
    {
        $formattedHours = [];
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        foreach ($days as $day) {
            // Use where method to find the operation hours for the current day
            $hours = $shop->shopOperationHours()->where('day', $day)->first();

            $formattedHours[$day] = [
                'isOpen' => $hours ? $hours->is_open : false,
                'openTime' => $hours ? date('h:i A', strtotime($hours->opening_time)) : null,
                'closeTime' => $hours ? date('h:i A', strtotime($hours->closing_time)) : null,
            ];
        }

        return $formattedHours;
    }

    /**
     * Ensure URL is properly formatted for public access
     */
    private function ensurePublicUrl($path)
    {
        if (empty($path)) {
            return null;
        }

        // If URL already starts with http/https, return as is
        if (preg_match('/^https?:\/\//', $path)) {
            return $path;
        }

        // Remove any leading slash
        $path = ltrim($path, '/');

        // Check if the file exists in public directly
        if (file_exists(public_path($path))) {
            return url($path);
        }

        // Extract filename
        $filename = basename($path);

        // Check if file exists in storage/legal_documents
        if (Storage::disk('public')->exists("legal_documents/$filename")) {
            return url("storage/legal_documents/$filename");
        }

        // For shop photos and gallery images in storage/shop_photos or storage/shop_gallery
        if (strpos($path, 'shop_photos') !== false || strpos($path, 'shop_gallery') !== false) {
            if (file_exists(public_path($path))) {
                return url($path);
            }

            // Extract the folder and filename
            $parts = explode('/', $path);
            $folder = isset($parts[count($parts) - 2]) ? $parts[count($parts) - 2] : '';
            $filename = basename($path);

            // Try to find the file in the appropriate storage folder
            if (Storage::disk('public')->exists("$folder/$filename")) {
                return url("storage/$folder/$filename");
            }
        }

        // Return original path as fallback
        return $path;
    }

    /**
     * Verify a shop (approve it).
     */
    public function verify(Shop $shop)
    {
        // Add debugging
        Log::info("Verifying shop", [
            'shop_id' => $shop->id,
            'current_status' => $shop->status
        ]);

        $shop->update(['status' => 'verified']);

        // Force a refresh from the database to ensure status is updated
        $shop->refresh();

        Log::info("Shop verified", [
            'shop_id' => $shop->id,
            'new_status' => $shop->status
        ]);

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Shop has been verified successfully.',
                'new_status' => $shop->status
            ]);
        }

        return back()->with('success', 'Shop has been verified successfully.');
    }

    /**
     * Reject a shop.
     */
    public function reject(Shop $shop, Request $request)
    {
        $request->validate([
            'reason' => 'required|string|max:255'
        ]);

        $shop->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason
        ]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Shop has been rejected.']);
        }

        return back()->with('success', 'Shop has been rejected.');
    }

    /**
     * Update status of a shop.
     */
    public function updateStatus(Shop $shop, Request $request)
    {
        $request->validate([
            'status' => 'required|string|in:processing,verified,rejected'
        ]);

        try {
            DB::transaction(function () use ($shop, $request) {
                $updateData = [
                    'status' => $request->status,
                    'rejection_reason' => $request->status === 'rejected' ? $request->reason : null,
                    'verified_at' => $request->status === 'verified' ? now() : null
                ];

                $shop->update($updateData);

                // Send notification based on status
                if ($request->status === 'verified') {
                    $shop->user->notify(new ShopVerificationNotification($shop));
                } elseif ($request->status === 'rejected') {
                    $shop->user->notify(new ShopRejectionNotification($shop, $request->reason));
                }
            });

            return response()->json([
                'success' => true,
                'message' => 'Shop status has been updated to ' . $request->status,
                'new_status' => $request->status,
                'debug_shop_data' => $shop->toArray()
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to update shop status via updateStatus", [
                'shop_id' => $shop->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update shop status: ' . $e->getMessage()
            ], 500);
        }
    }
}
