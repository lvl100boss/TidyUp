<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Shop;
use App\Models\Categories;
use App\Models\OperationHours;
use App\Models\ServiceCategories;
use App\Models\ShopCategory;
use App\Models\ShopGallery;
use App\Models\ShopLegalDocument;
use App\Models\ShopServiceCategories;
use App\Models\ShopStaffs;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Notifications\NewShopRegistrationNotification;
use App\Models\Review;

class ShopController extends Controller
{
    //
    public function create()
    {
        $categories = Categories::all();
        $serviceCategories = ServiceCategories::all();
        return Inertia::render(
            'Shops/SetupShop',
            [
                'categories' => $categories,
                'serviceCategories' => $serviceCategories
            ]
        );
    }

    public function store(Request $request)
    {
        $userID = Auth::user()->id;
        // Log the incoming request for debugging
        Log::info('Shop registration request received', [
            'user_id' => $userID,
            'request_data' => $request->except(['shop_photo', 'shop_gallery', 'business_permit', 'dti_registration', 'valid_id'])
        ]);


        // Validate basic fields first

        $validatedData = $request->validate([
            'shop_name' => 'required|unique:shops,shop_name',
            'shop_bio' => 'nullable|string',
            'email' => 'required|email',
            'phone' => 'required|numeric',
            'region' => 'required',
            'province' => 'required',
            'city' => 'required',
            'barangay' => 'required',
            'detailed_address' => 'required',
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:categories,id',
            'operation_hours' => 'required|array',
            'catalog_items' => 'required|array',
            'shop_photo' => 'required|image',
            'shop_gallery' => 'required|array',
            'shop_gallery.*' => 'image',

            'business_permit' => 'required|image',
            'dti_registration' => 'required|image',
            'valid_id' => 'required|image',
        ]);
        // Validate structure of catalog items
        foreach ($request->catalog_items as $index => $item) {
            $request->validate([
                "catalog_items.{$index}.service_name" => 'required|string',
                "catalog_items.{$index}.cost" => 'required|numeric',
                "catalog_items.{$index}.duration_hour" => 'required|integer|min:0',
                "catalog_items.{$index}.duration_minute" => 'required|integer|min:0|max:59',
                "catalog_items.{$index}.category_id" => 'required|exists:service_categories,id',
            ]);
        }

        DB::beginTransaction();

        try {
            // Store shop photo
            $shopPhotoPath = $request->file('shop_photo')->store('shop_photos', 'public');

            // Create shop record

            $shop = Shop::create([
                'shop_name' => $request->shop_name,
                'user_id' => $userID,
                'email' => $validatedData['email'],
                'contact_number' => $validatedData['phone'],
                'shop_photo' => 'storage/' . $shopPhotoPath,
                'region' => $validatedData['region'],
                'province' => $validatedData['province'],
                'city' => $validatedData['city'],
                'barangay' => $validatedData['barangay'],
                'detailed_address' => $validatedData['detailed_address'],
                'bio' => $validatedData['shop_bio'],

                'status' => 'processing',
                'created_at' => now(), // Explicitly set creation date
                'updated_at' => now()
            ]);

            Log::info('Shop record created', ['shop_id' => $shop->id]);

            // Associate shop categories
            if (!empty($validatedData['categories'])) {
                foreach ($validatedData['categories'] as $categoryId) {
                    $shopCategory = ShopCategory::create([

                        'shop_id' => $shop->id,
                        'category_id' => $categoryId,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
                Log::info('Shop categories associated', ['categories' => $validatedData['categories']]);
            }


            // Create service categories
            foreach ($request->catalog_items as $item) {
                $shopService = ShopServiceCategories::create([

                    'service_name' => $item['service_name'],
                    'cost' => $item['cost'],
                    'duration_hour' => $item['duration_hour'],
                    'duration_minute' => $item['duration_minute'],
                    'service_category_id' => $item['category_id'],
                    'shop_id' => $shop->id
                ]);
            }
            Log::info('Shop service categories created');

            // Store gallery images
            if ($request->hasFile('shop_gallery')) {
                foreach ($request->file('shop_gallery') as $gallery) {
                    $galleryPath = $gallery->store('shop_gallery', 'public');
                    $gallery = ShopGallery::create([
                        'url' => 'storage/' . $galleryPath,
                        'shop_id' => $shop->id
                    ]);
                }
                Log::info('Shop gallery images uploaded');
            }

            // Create operation hours
            foreach ($request->operation_hours as $key => $value) {
                $openTime = !empty($value['openTime']) ? Carbon::createFromFormat('g:i A', $value['openTime'])->format('H:i:s') : null;
                $closeTime = !empty($value['closeTime']) ? Carbon::createFromFormat('g:i A', $value['closeTime'])->format('H:i:s') : null;

                $businessHour = OperationHours::create([

                    'shop_id' => $shop->id,
                    'day' => $key,
                    'is_open' => $value['isOpen'],
                    'open_time' => $openTime,
                    'close_time' => $closeTime
                ]);
            }


            Log::info('Shop operation hours created');

            // Store legal documents
            $businessPermitPath = $request->file('business_permit')->store('legal_documents', 'public');
            $dtiRegistrationPath = $request->file('dti_registration')->store('legal_documents', 'public');
            $validIdPath = $request->file('valid_id')->store('legal_documents', 'public');




            $shopLegalDoc = ShopLegalDocument::create([
                'shop_id' => $shop->id,
                'business_permit_url' => 'storage/' . $businessPermitPath,
                'dti_registration_url'  => 'storage/' . $dtiRegistrationPath,
                'valid_id_url' => 'storage/' . $validIdPath,
            ]);
            Log::info('Legal documents uploaded');
            // Update user role
            $authenticatedUser = User::find(Auth::id());
            $authenticatedUser->userRole()->update([
                'role_id' => 3
            ]);
            Log::info('User role updated to shop owner');

            // Create shop staff record for owner
            $shopStaff = ShopStaffs::create([
                'shop_id' => $shop->id,
                'staff_id' => $userID,
                'role' => 'Shop Owner',
                'position' => 'owner',
                'is_active' => true,
            ]);
            Log::info('Shop owner staff record created');

            DB::commit();

            return redirect()->route('shop.dashboard')->with([
                'success' => true,
                'message' => 'Shop registration submitted successfully and is awaiting verification'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to create shop', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);

            return back()->withErrors([
                'error' => 'Failed to register shop: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function show(Request $request, $id)
    {
        // Make sure $id is numeric before processing
        if (!is_numeric($id)) {
            Log::warning('Invalid shop ID format', ['shop_id' => $id]);
            return redirect()->route('not-found');
        }

        // Add debug logging
        Log::info('Shop detail page requested', ['shop_id' => $id]);

        // Find the shop with all necessary relationships
        $shop = Shop::with(['shopGallery', 'shopServiceCategories.serviceCategories', 'shopOperationHours', 'socialMedia'])
            ->where('status', 'verified') // Only get verified shops
            ->find($id);
        // If shop doesn't exist or is not verified, return 404
        if (!$shop) {
            Log::warning('Shop not found or not verified', ['shop_id' => $id]);
            return redirect()->route('not-found');
        }

        // Log success
        Log::info('Shop found and being displayed', ['shop' => $shop->shop_name, 'id' => $shop->id]);

        // Get random verified shops for customer's choices section
        $randomShops = Shop::with(['shopGallery', 'shopCategories.categories'])
            ->where('status', 'verified')
            ->where('id', '!=', $id)
            ->inRandomOrder()
            ->limit(10)
            ->get();

        // Get reviews for this shop with all necessary relationships
        $reviews = Review::with([
            'user',
            'appointment.services.shop_service'
        ])
            ->whereHas('appointment', function ($query) use ($id) {
                $query->where('shop_id', $id)
                    ->where('status', 'completed');
            })
            ->latest()
            ->get();

        return Inertia::render('Users/Shop', [
            'shop' => $shop,
            'randomShops' => $randomShops,
            'reviews' => $reviews
        ]);
    }

    public function setup()
    {
        $categories = Categories::all();
        $serviceCategories = ServiceCategories::all();

        return Inertia::render('Shops/SetupShop', [
            'categories' => $categories,
            'serviceCategories' => $serviceCategories
        ]);
    }
}
