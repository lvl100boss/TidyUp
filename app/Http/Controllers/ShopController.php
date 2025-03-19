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

        // Get raw data without decoding
        $categories = $request->input('categories');
        $operationHours = $request->input('operation_hours');
        $catalogItems = $request->input('catalog_items');

        // Decode JSON strings if they're strings
        $categories = is_string($categories) ? json_decode($categories, true) : $categories;
        $operationHours = is_string($operationHours) ? json_decode($operationHours, true) : $operationHours;
        $catalogItems = is_string($catalogItems) ? json_decode($catalogItems, true) : $catalogItems;

        // Validate the request data
        $validatedData = $request->validate([
            'shop_name' => 'required|unique:shops,shop_name',
            'shop_bio' => 'required',
            'email' => 'required|email',
            'phone' => 'required|numeric',
            'region' => 'required',
            'province' => 'required',
            'city' => 'required',
            'barangay' => 'required',
            'detailed_address' => 'required',
            'shop_photo' => 'required|image',
            'shop_gallery.*' => 'required|image',
            'business_permit' => 'required|image',
            'dti_registration' => 'required|image',
            'valid_id' => 'required|image',
        ]);

        DB::beginTransaction();

        try {
            // Create shop with basic info
            $shop = Shop::create([
                'shop_name' => $request->shop_name,
                'user_id' => $userID,
                'email' => $request->email,
                'contact_number' => $request->phone,
                'shop_photo' => $request->file('shop_photo') ?
                    'storage/' . $request->file('shop_photo')->store('shop_photos', 'public') : null,
                'region' => $request->region,
                'province' => $request->province,
                'city' => $request->city,
                'barangay' => $request->barangay,
                'detailed_address' => $request->detailed_address,
                'bio' => $request->shop_bio,
                'status' => 'processing',
                'created_at' => now(), // Explicitly set creation date
                'updated_at' => now()
            ]);

            // Immediately load relationships for admin view
            $shop->load(['user', 'shopCategories.categories']);

            // Save categories
            if (!empty($categories)) {
                foreach ($categories as $categoryId) {
                    ShopCategory::create([
                        'shop_id' => $shop->id,
                        'category_id' => $categoryId,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }

            foreach ($catalogItems as $item) {
                $shopServiceCategories = ShopServiceCategories::create([
                    'service_name' => $item['service_name'],
                    'cost' => $item['cost'],
                    'duration_hour' => $item['duration_hour'],
                    'duration_minute' => $item['duration_minute'],
                    'service_category_id' => $item['category_id'],
                    'shop_id' => $shop->id
                ]);
            }
            foreach ($validatedData['shop_gallery'] as $gallery) {
                $shopGallery = ShopGallery::create([
                    'url' => 'storage/' . $gallery->store('shop_gallery', 'public'),
                    'shop_id' => $shop->id
                ]);
            }
            foreach ($operationHours as $key => $value) {
                $openTime = $value['openTime'] ? Carbon::createFromFormat('g:i A', $value['openTime'])->format('H:i:s') : null;
                $closeTime = $value['closeTime'] ? Carbon::createFromFormat('g:i A', $value['closeTime'])->format('H:i:s') : null;
                $shopOperationHours = OperationHours::create([
                    'shop_id' => $shop->id,
                    'day' => $key,
                    'is_open' => $value['isOpen'],
                    'open_time' => $openTime,
                    'close_time' => $closeTime
                ]);
            }

            // Store legal documents in public storage for direct accessibility
            $shopLegalDocument = ShopLegalDocument::create([
                'shop_id' => $shop->id,
                'business_permit_url' => 'storage/' . $validatedData['business_permit']->store('legal_documents', 'public'),
                'dti_registration_url'  => 'storage/' . $validatedData['dti_registration']->store('legal_documents', 'public'),
                'valid_id_url' => 'storage/' . $validatedData['valid_id']->store('legal_documents', 'public'),
            ]);

            $authenticatedUser = User::find(Auth::id());
            $authenticatedUser->userRole()->update([
                'role_id' => 3
            ]);

            ShopStaffs::create([
                'shop_id' => $shop->id,
                'staff_id' => $userID,
                'role' => 'Shop Owner',
                'position' => 'owner',
                'is_active' => true,
            ]);

            // Find admin users and send notifications immediately
            $admins = User::whereHas('userRole', function ($query) {
                $query->where('role_id', 1); // Assuming 1 is admin role_id
            })->get();

            foreach ($admins as $admin) {
                $admin->notify(new NewShopRegistrationNotification($shop));
            }

            DB::commit();

            Log::info('Shop created successfully', [
                'shop_id' => $shop->id,
                'shop_name' => $shop->shop_name,
                'categories' => $categories
            ]);

            // Replace JSON response with a redirect response for Inertia
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'shop' => $shop,
                    'message' => 'Shop registration submitted successfully and is awaiting verification'
                ]);
            }

            // For Inertia requests
            return redirect()
                ->route('home')
                ->with('success', 'Shop registration submitted successfully and is awaiting verification');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Failed to create shop', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to create shop: ' . $e->getMessage()])->withInput();
        }
    }

    public function show($id)
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

        return Inertia::render('Users/Shop', [
            'shop' => $shop,
            'randomShops' => $randomShops
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
