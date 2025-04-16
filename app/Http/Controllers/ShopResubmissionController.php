<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Shop;
use App\Models\OperationHours; // Import the OperationHours model
use App\Models\ServiceCategories; // Import ServiceCategories model
use App\Models\ShopServiceCategories; // Import ShopServiceCategories model
use Illuminate\Support\Facades\Validator; // Import Validator facade
use Illuminate\Validation\Rule; // Import Rule for validation
use Illuminate\Support\Facades\DB; // Import DB facade for transaction
use Illuminate\Support\Facades\Log; // Import Log facade for debugging
use Illuminate\Support\Facades\Auth; // Import Auth facade
use App\Models\ShopLegalDocument; // Import ShopLegalDocument model
use Illuminate\Support\Facades\Storage; // Import Storage facade
use App\Models\ShopGallery; // Import ShopGallery model

class ShopResubmissionController extends Controller
{
    //
    public function edit()
    {
        // get user id
        $userId = Auth::id();
        // Fetch the shop details using the ID
        $shop = Shop::where('user_id', $userId)
            ->with([
                'shopCategories.categories',
                'businessHours', // Eager load business hours (OperationHours)
                'services.serviceCategories', // Eager load services and their categories
                'legalDocuments',
                'shopGallery' // Add shop gallery relationship
            ])
            ->firstOrFail(); // Use firstOrFail to handle not found case
        if ($shop->status == 'processing') {
            return redirect()->back()->with('message', 'Shop is still under review.')->with('success', false);
        }
        if ($shop->status == 'verified') {
            return redirect()->back()->with('message', 'Shop is already approved.')->with('success', false);
        }
        if ($shop->resubmit_count >= 3) {
            return redirect()->back()->with('message', 'You have reached the maximum number of resubmissions.')->with('success', false);
        }

        // Fetch all available service categories
        $serviceCategories = ServiceCategories::all();

        return Inertia::render('Shops/ResubmitShopInfo', [
            'shop' => $shop,
            'serviceCategories' => $serviceCategories, // Pass service categories to the view
        ]);
    }

    public function updateBasicDetails(Request $request)
    {
        // get user id

        // Fetch the shop details using the ID
        $shop = Shop::where('id', $request->shop_id)->first();
        // Check if the shop exists 
        if (!$shop) {
            return redirect()->back()->with('error', 'Shop not found.');
        }
        $validatedDate = $request->validate([
            'shop_name' => 'required|string|max:255',
            'bio' => 'required|string|max:1000',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'shop_categories' => 'required|array',
            'shop_categories.*' => 'exists:categories,id',
        ]);

        $shop->update([
            'shop_name' => $validatedDate['shop_name'],
            'bio' => $validatedDate['bio'],
            'contact_number' => $validatedDate['contact_number'],
            'email' => $validatedDate['email'],
        ]);

        $shopCategoriesToBeDeleted = $shop->shopCategories()->pluck('id')->toArray();
        // delete categories that are to be deleted 
        foreach ($shopCategoriesToBeDeleted as $category) {
            if (!in_array($category, $validatedDate['shop_categories'])) {
                $shop->shopCategories()->where('id', $category)->delete();
            }
        }
        // Add new categories
        foreach ($validatedDate['shop_categories'] as $category) {
            if (!in_array($category, $shopCategoriesToBeDeleted)) {
                $shop->shopCategories()->create([
                    'shop_id' => $shop->id,
                    'category_id' => $category,
                ]);
            }
        }
        // Redirect back with a success message
        return redirect()->back()->with('message', 'Basic Information updated successfully.')->with('success', true);
    }

    public function updateLocationDetails(Request $request)
    {
        $validatedData = $request->validate([
            'region' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'detailed_address' => 'required|string|max:255',
        ]);

        // Fetch the shop details using the ID
        $shop = Shop::where('id', $request->shop_id)->first();
        // Check if the shop exists 
        if (!$shop) {
            return redirect()->back()->with('error', 'Shop not found.');
        }

        $shop->update($validatedData);

        // Redirect back with a success message
        return redirect()->back()->with('message', 'Location Information updated successfully.')->with('success', true);
    }

    public function updateBusinessHours(Request $request)
    {
        $validatedData = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'business_hours' => 'required|array|size:7',
            'business_hours.*.day' => ['required', 'string', Rule::in(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])],
            'business_hours.*.is_open' => 'required|boolean',
            'business_hours.*.open_time' => 'required_if:business_hours.*.is_open,true|date_format:H:i:s',
            'business_hours.*.close_time' => 'required_if:business_hours.*.is_open,true|date_format:H:i:s|after:business_hours.*.open_time',
        ]);

        $shop = Shop::findOrFail($validatedData['shop_id']);

        DB::transaction(function () use ($shop, $validatedData) {
            foreach ($validatedData['business_hours'] as $hourData) {
                OperationHours::updateOrCreate(
                    [
                        'shop_id' => $shop->id,
                        'day' => $hourData['day']
                    ],
                    [
                        'is_open' => $hourData['is_open'],
                        'open_time' => $hourData['is_open'] ? $hourData['open_time'] : null,
                        'close_time' => $hourData['is_open'] ? $hourData['close_time'] : null,
                    ]
                );
            }
        });

        return redirect()->back()->with('message', 'Business hours updated successfully.')->with('success', true);
    }

    // Add new service
    public function storeService(Request $request, Shop $shop)
    {
        $validatedData = $request->validate([
            'service_name' => 'required|string|max:255',
            'service_category_id' => 'required|exists:service_categories,id',
            'cost' => 'required|numeric|min:0',
            'duration_hour' => 'required|integer|min:0|max:23',
            'duration_minute' => 'required|integer|min:0|max:59',
        ]);

        // Ensure duration is not zero
        if ($validatedData['duration_hour'] == 0 && $validatedData['duration_minute'] == 0) {
            return redirect()->back()->withErrors(['duration' => 'Service duration cannot be zero.'])->withInput();
        }

        $shop->services()->create($validatedData);

        return redirect()->back()->with('message', 'Service added successfully.')->with('success', true);
    }

    // Update existing service
    public function updateService(Request $request, Shop $shop, ShopServiceCategories $service)
    {
        // Ensure the service belongs to the shop
        if ($service->shop_id !== $shop->id) {
            abort(403, 'Unauthorized action.');
        }

        $validatedData = $request->validate([
            'service_name' => 'required|string|max:255',
            'service_category_id' => 'required|exists:service_categories,id',
            'cost' => 'required|numeric|min:0',
            'duration_hour' => 'required|integer|min:0|max:23',
            'duration_minute' => 'required|integer|min:0|max:59',
        ]);

        // Ensure duration is not zero
        if ($validatedData['duration_hour'] == 0 && $validatedData['duration_minute'] == 0) {
            return redirect()->back()->withErrors(['duration' => 'Service duration cannot be zero.'])->withInput();
        }

        $service->update($validatedData);

        return redirect()->back()->with('message', 'Service updated successfully.')->with('success', true);
    }

    // Delete service
    public function destroyService(Shop $shop, ShopServiceCategories $service)
    {
        // Ensure the service belongs to the shop
        if ($service->shop_id !== $shop->id) {
            abort(403, 'Unauthorized action.');
        }

        $service->delete();

        return redirect()->back()->with('message', 'Service deleted successfully.')->with('success', true);
    }

    // Update legal document
    public function updateLegalDocument(Request $request, $documentType)
    {
        // Validate the request
        $validatedData = $request->validate([
            'shop_id' => 'required|integer|exists:shops,id',
            'document' => 'required|file|image|max:24576' // Max 2MB, ensure it's an image
        ]);

        // Map document type to database column
        $columnMap = [
            'business_permit' => 'business_permit_url',
            'dti_registration' => 'dti_registration_url',
            'valid_id' => 'valid_id_url',
        ];

        if (!array_key_exists($documentType, $columnMap)) {
            return redirect()->back()->withErrors(['documentType' => 'Invalid document type.'])->withInput();
        }

        $shopId = $validatedData['shop_id'];
        $column = $columnMap[$documentType];
        $file = $validatedData['document'];

        // Find the shop and its legal documents
        $shop = Shop::findOrFail($shopId);
        $legalDocument = ShopLegalDocument::firstOrCreate(['shop_id' => $shopId]);

        // Check user authorization
        if ($shop->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        try {
            DB::transaction(function () use ($legalDocument, $column, $file, $shopId, $documentType) {
                // 1. Delete the old file if it exists
                if ($legalDocument->$column) {
                    $oldPath = 'public/' . $legalDocument->$column;
                    if (Storage::exists($oldPath)) {
                        Storage::delete($oldPath);
                        Log::info('Deleted old legal document', ['path' => $oldPath]);
                    }
                }

                // 2. Store the new file
                // Generate a unique filename
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs("legal_documents", $filename, 'public');

                if (!$path) {
                    throw new \Exception('Failed to store legal document.');
                }

                // 3. Update the database with just the path
                $legalDocument->$column = $path;
                $legalDocument->save();

                Log::info('Updated legal document', ['shop_id' => $shopId, 'type' => $documentType, 'path' => $path]);
            });

            return redirect()->back()->with('message', ucwords(str_replace('_', ' ', $documentType)) . ' updated successfully.')->with('success', true);
        } catch (\Exception $e) {
            Log::error('Error updating legal document', [
                'shop_id' => $shopId,
                'document_type' => $documentType,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Failed to update legal document. Please try again.')->with('success', false);
        }
    }

    // Update gallery photo
    public function updateGalleryPhoto(Request $request, $type)
    {
        // Validate the request
        $validatedData = $request->validate([
            'shop_id' => 'required|integer|exists:shops,id',
            'photos' => 'required|array',
            'photos.*' => 'required|file|image|max:24576' // Max 24MB, ensure it's an image
        ]);

        $shopId = $validatedData['shop_id'];
        $files = $validatedData['photos'];

        // Find the shop
        $shop = Shop::findOrFail($shopId);

        // Check user authorization
        if ($shop->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        try {
            if ($type === 'main') {
                // Handle main photo update (only first file)
                DB::transaction(function () use ($shop, $files) {
                    // Delete old main photo if exists
                    if ($shop->shop_photo) {
                        $oldPath = str_replace('storage/', 'public/', $shop->shop_photo);
                        if (Storage::exists($oldPath)) {
                            Storage::delete($oldPath);
                        }
                    }

                    // Store new main photo
                    $file = $files[0];
                    $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs("shop_photos", $filename, 'public');

                    if (!$path) {
                        throw new \Exception('Failed to store main photo.');
                    }

                    // Update the database with the correct path format
                    $shop->shop_photo = 'storage/' . $path;
                    $shop->save();

                    Log::info('Updated main photo', ['shop_id' => $shop->id, 'path' => $shop->shop_photo]);
                });
            } else {
                // Handle gallery photo addition
                DB::transaction(function () use ($shop, $files) {
                    // Check if adding these files would exceed the limit
                    $currentCount = $shop->shopGallery()->count();
                    $newCount = $currentCount + count($files);
                    if ($newCount > 6) {
                        throw new \Exception('Maximum gallery photos limit reached (6 photos).');
                    }

                    // Store new gallery photos
                    foreach ($files as $file) {
                        $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                        $path = $file->storeAs("shop_gallery", $filename, 'public');

                        if (!$path) {
                            throw new \Exception('Failed to store gallery photo.');
                        }

                        // Add to gallery with the correct path format
                        $shop->shopGallery()->create([
                            'url' => 'storage/' . $path,
                        ]);

                        Log::info('Added gallery photo', ['shop_id' => $shop->id, 'path' => 'storage/' . $path]);
                    }
                });
            }

            return redirect()->back()->with('message', ucfirst($type) . ' photo(s) updated successfully.')->with('success', true);
        } catch (\Exception $e) {
            Log::error('Error updating gallery photo', [
                'shop_id' => $shopId,
                'type' => $type,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', $e->getMessage())->with('success', false);
        }
    }

    // Delete gallery photo
    public function deleteGalleryPhoto($photoId)
    {
        try {
            $photo = ShopGallery::findOrFail($photoId);
            $shop = $photo->shop;

            // Check user authorization
            if ($shop->user_id !== Auth::id()) {
                abort(403, 'Unauthorized action.');
            }

            DB::transaction(function () use ($photo) {
                // Delete the file
                $path = 'public/' . $photo->url;
                if (Storage::exists($path)) {
                    Storage::delete($path);
                }

                // Delete the record
                $photo->delete();

                Log::info('Deleted gallery photo', ['photo_id' => $photo->id]);
            });

            return redirect()->back()->with('message', 'Gallery photo deleted successfully.')->with('success', true);
        } catch (\Exception $e) {
            Log::error('Error deleting gallery photo', [
                'photo_id' => $photoId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Failed to delete gallery photo.')->with('success', false);
        }
    }

    public function resubmitShop(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'shop_id' => 'required|exists:shops,id'
            ]);

            $shop = Shop::findOrFail($validatedData['shop_id']);

            // Check if user is authorized to resubmit this shop
            if ($shop->user_id !== Auth::id()) {
                return back()->with('error', 'Unauthorized action.');
            }

            // Check if resubmit count has reached the limit
            if ($shop->resubmit_count >= 3) {
                return back()->with('error', 'You have reached the maximum number of resubmissions.');
            }

            // Update shop status and clear rejection reason
            $shop->update([
                'resubmit_count' => $shop->resubmit_count + 1,
                'is_verified' => false,
                'status' => 'processing',
                'rejection_reason' => null
            ]);

            return redirect()->route('shop.dashboard')->with('success', 'Shop resubmission request submitted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'An error occurred while processing your request.');
        }
    }
}
