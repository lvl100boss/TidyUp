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

class ShopController extends Controller
{
    /**
     * Display a listing of shops.
     */
    public function index()
    {
        // Get all categories
        $categories = Categories::all();

        // Add direct query to check what's in the database - using correct table name
        $rawShopCategories = DB::table('shop_category') // Changed from 'shop_categories' to 'shop_category'
            ->join('categories', 'shop_category.category_id', '=', 'categories.id')
            ->select('shop_category.shop_id', 'categories.name as category_name')
            ->get();

        // Get shops with eager loaded relationships
        $shops = Shop::with([
            'user:id,first_name,last_name,email',
            'shopCategories.categories'
        ])->latest()->get();

        // Transform data for frontend to ensure categories are properly formatted
        $formattedShops = $shops->map(function ($shop) use ($rawShopCategories) {
            // If shop has no categories in the relationship, add them from raw query
            if ($shop->shopCategories->isEmpty()) {
                $shopCategoriesFromRaw = $rawShopCategories->where('shop_id', $shop->id);
                // Convert raw data to match expected format
                if ($shopCategoriesFromRaw->isNotEmpty()) {
                    $shop->shopCategoriesRaw = $shopCategoriesFromRaw->map(function ($item) {
                        return [
                            'category_name' => $item->category_name
                        ];
                    })->values()->toArray();
                }
            }
            return $shop;
        });

        return Inertia::render('Admin/Shops', [
            'shops' => $formattedShops,
            'categories' => $categories,
            'rawCategoriesData' => $rawShopCategories
        ]);
    }

    /**
     * Display the specified shop.
     */
    public function show(Shop $shop)
    {
        // Remove status check since admin should see all shops

        // Get direct category data for this shop
        $shopCategories = DB::table('shop_category')
            ->join('categories', 'shop_category.category_id', '=', 'categories.id')
            ->select('categories.id', 'categories.name')
            ->where('shop_category.shop_id', $shop->id)
            ->get();

        // Load shop with relationships including legal documents
        $shop->load([
            'user',
            'shopCategories.categories',
            'shopGallery',
            'shopServiceCategories.serviceCategories',
        ]);

        // Get document information directly from DB using the correct table name
        $shopDocuments = DB::table('shop_legal_document')
            ->where('shop_id', $shop->id)
            ->first();

        if ($shopDocuments) {
            // Update URLs if needed and make sure they're formatted correctly for browser access
            $shop->business_permit = $this->ensurePublicUrl($shopDocuments->business_permit_url);
            $shop->dti_registration = $this->ensurePublicUrl($shopDocuments->dti_registration_url);
            $shop->valid_id = $this->ensurePublicUrl($shopDocuments->valid_id_url);

            Log::info('Document URLs for shop view:', [
                'business_permit' => $shop->business_permit,
                'dti_registration' => $shop->dti_registration,
                'valid_id' => $shop->valid_id
            ]);
        }

        // Fix gallery image URLs if needed
        if ($shop->shopGallery) {
            foreach ($shop->shopGallery as $image) {
                $image->url = $this->ensurePublicUrl($image->url);

                // Log each gallery image URL for debugging
                Log::info('Gallery image URL:', [
                    'original' => $image->getOriginal('url'),
                    'formatted' => $image->url
                ]);
            }
        }

        // Also ensure shop profile photo is properly formatted
        if ($shop->shop_photo) {
            $originalPath = $shop->shop_photo;
            $shop->shop_photo = $this->ensurePublicUrl($shop->shop_photo);

            // Log shop photo URL for debugging
            Log::info('Shop photo URL:', [
                'original' => $originalPath,
                'formatted' => $shop->shop_photo
            ]);
        }

        // Add raw categories data to ensure we have it
        $shop->rawCategories = $shopCategories;

        return Inertia::render('Admin/ShopDetail', [
            'shop' => $shop,
            'categories' => Categories::all(),
            'rawCategoriesData' => $shopCategories
        ]);
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
            $oldStatus = $shop->status;
            $newStatus = $request->status;
            
            Log::info("Updating shop status via updateStatus method", [
                'shop_id' => $shop->id,
                'old_status' => $oldStatus,
                'new_status' => $newStatus,
                'request_data' => $request->all()
            ]);
            
            $updateData = [
                'status' => $newStatus
            ];

            if ($newStatus === 'rejected') {
                if ($request->has('reason')) {
                    $updateData['rejection_reason'] = $request->reason;
                }
            } else {
                $updateData['rejection_reason'] = null;
            }
            
            // Ensure shop model has status in fillable array
            DB::table('shops')
                ->where('id', $shop->id)
                ->update($updateData);
            
            // Get fresh data from DB
            $shop = Shop::find($shop->id);
            
            Log::info("Shop status updated via direct DB update", [
                'shop_id' => $shop->id,
                'new_status' => $shop->status
            ]);
            
            return response()->json([
                'success' => true, 
                'message' => 'Shop status has been updated to ' . $newStatus,
                'new_status' => $newStatus,
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
