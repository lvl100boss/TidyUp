<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Shop;
use App\Models\ShopCategory;
use App\Models\OperationHours;
use App\Models\ShopServiceCategories;
use App\Models\ShopGallery;
use App\Models\ShopLegalDocument;
use App\Models\ShopStaffs;
use App\Models\User;

class SetupShopController extends Controller
{
    /**
     * Store a newly created shop
     * 
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $userID = Auth::user()->id;
        // Log the incoming request for debugging
        Log::info('Shop setup request received', [
            'user_id' => $userID,
            'request_data' => $request->except(['legal_documents', 'shop_gallery'])
        ]);

        try {
            // Validate basic fields first
            $validatedData = $request->validate([
                'shop_name' => 'required|unique:shops,shop_name',
                'bio' => 'nullable|string|max:1000',
                'email' => 'required|email|max:255',
                'contact_number' => 'required|string|max:20',
                'shop_categories' => 'required|array|min:1',
                'shop_categories.*' => 'exists:categories,id',
                'region' => 'required|string|max:255',
                'province' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'barangay' => 'required|string|max:255',
                'detailed_address' => 'required|string|max:500',
                'business_hours' => 'required|array',
                'shop_services' => 'required|array|min:1',
                'legal_documents.business_permit.file' => 'required|file|image|max:25048',
                'legal_documents.dti_registration.file' => 'required|file|image|max:25048',
                'legal_documents.valid_id.file' => 'required|file|image|max:25048',
                'shop_gallery.main_photo.file' => 'required|file|image|max:25048',
                'shop_gallery.gallery_photos' => 'required|array|min:1',
                'shop_gallery.gallery_photos.*.file' => 'required|file|image|max:25048',
            ]);

            // Validate business hours structure
            foreach ($request->business_hours as $index => $hours) {
                $request->validate([
                    "business_hours.{$index}.day" => 'required|string',
                    "business_hours.{$index}.is_open" => 'boolean',
                    "business_hours.{$index}.open_time" => 'required_if:business_hours.' . $index . '.is_open,1|nullable|string',
                    "business_hours.{$index}.close_time" => 'required_if:business_hours.' . $index . '.is_open,1|nullable|string',
                ]);
            }

            // Validate shop services structure
            foreach ($request->shop_services as $index => $service) {
                $request->validate([
                    "shop_services.{$index}.service_name" => 'required|string|max:255',
                    "shop_services.{$index}.cost" => 'required|numeric|min:0',
                    "shop_services.{$index}.duration_hour" => 'required|integer|min:0',
                    "shop_services.{$index}.duration_minute" => 'required|integer|min:0|max:59',
                    "shop_services.{$index}.service_category_id" => 'required|exists:service_categories,id',
                ]);
            }

            // Start transaction
            DB::beginTransaction();

            // Store shop photo
            $shopPhotoFile = $request->file('shop_gallery.main_photo.file');
            $shopPhotoPath = $shopPhotoFile->store('shop_photos', 'public');

            // Create shop record
            $shop = Shop::create([
                'shop_name' => $validatedData['shop_name'],
                'user_id' => $userID,
                'email' => $validatedData['email'],
                'contact_number' => $validatedData['contact_number'],
                'shop_photo' => 'storage/' . $shopPhotoPath,
                'region' => $validatedData['region'],
                'province' => $validatedData['province'],
                'city' => $validatedData['city'],
                'barangay' => $validatedData['barangay'],
                'detailed_address' => $validatedData['detailed_address'],
                'bio' => $validatedData['bio'] ?? null,
                'status' => 'processing',
                'created_at' => now(),
                'updated_at' => now()
            ]);

            Log::info('Shop record created', ['shop_id' => $shop->id]);

            // Process shop categories
            foreach ($validatedData['shop_categories'] as $categoryId) {
                ShopCategory::create([
                    'shop_id' => $shop->id,
                    'category_id' => $categoryId,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
            Log::info('Shop categories processed', ['categories' => $validatedData['shop_categories']]);

            // Process business hours
            foreach ($request->business_hours as $hours) {
                $openTime = !empty($hours['open_time']) ? Carbon::createFromFormat('H:i:s', $hours['open_time'])->format('H:i:s') : null;
                $closeTime = !empty($hours['close_time']) ? Carbon::createFromFormat('H:i:s', $hours['close_time'])->format('H:i:s') : null;

                OperationHours::create([
                    'shop_id' => $shop->id,
                    'day' => $hours['day'],
                    'is_open' => $hours['is_open'] ? 1 : 0,
                    'open_time' => $openTime,
                    'close_time' => $closeTime
                ]);
            }
            Log::info('Shop operation hours created');

            // Process shop services
            foreach ($request->shop_services as $service) {
                ShopServiceCategories::create([
                    'shop_id' => $shop->id,
                    'service_name' => $service['service_name'],
                    'cost' => $service['cost'],
                    'duration_hour' => $service['duration_hour'],
                    'duration_minute' => $service['duration_minute'],
                    'service_category_id' => $service['service_category_id'],
                ]);
            }
            Log::info('Shop services created');

            // Process legal documents
            $businessPermitFile = $request->file('legal_documents.business_permit.file');
            $dtiRegistrationFile = $request->file('legal_documents.dti_registration.file');
            $validIdFile = $request->file('legal_documents.valid_id.file');

            $businessPermitPath = $businessPermitFile->store('legal_documents', 'public');
            $dtiRegistrationPath = $dtiRegistrationFile->store('legal_documents', 'public');
            $validIdPath = $validIdFile->store('legal_documents', 'public');

            ShopLegalDocument::create([
                'shop_id' => $shop->id,
                'business_permit_url' => 'storage/' . $businessPermitPath,
                'dti_registration_url' => 'storage/' . $dtiRegistrationPath,
                'valid_id_url' => 'storage/' . $validIdPath,
            ]);
            Log::info('Legal documents processed');

            // Process shop gallery
            // First, store the main photo
            ShopGallery::create([
                'shop_id' => $shop->id,
                'url' => 'storage/' . $shopPhotoPath,
                'is_main' => true
            ]);

            // Then store all gallery photos
            foreach ($request->file('shop_gallery.gallery_photos') as $gallery) {
                $galleryPath = $gallery['file']->store('shop_gallery', 'public');
                ShopGallery::create([
                    'shop_id' => $shop->id,
                    'url' => 'storage/' . $galleryPath,
                    'is_main' => false
                ]);
            }
            Log::info('Shop gallery processed');

            // Update user role
            $user = User::find($userID);
            $user->userRole()->update([
                'role_id' => 3 // Shop owner role ID
            ]);
            Log::info('User role updated to shop owner');

            // Create shop staff record for owner
            ShopStaffs::create([
                'shop_id' => $shop->id,
                'staff_id' => $userID,
                'role' => 'Shop Owner',
                'position' => 'owner',
                'is_active' => true,
            ]);
            Log::info('Shop owner staff record created');

            // All operations successful, commit the transaction
            DB::commit();

            return redirect()->route('shop.dashboard')->with([
                'success' => true,
                'message' => 'Shop setup completed successfully! Your shop is pending verification.'
            ]);
        } catch (\Exception $e) {
            // Something went wrong, rollback the transaction
            DB::rollBack();

            Log::error('Failed to setup shop', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);

            return back()->withErrors([
                'error' => 'Failed to setup shop: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
