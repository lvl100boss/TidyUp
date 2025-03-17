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
        $validatedData = $request->validate([
            'shop_name' => 'required|unique:shops,shop_name', //
            'shop_bio' => 'required', //
            'email' => 'required|email', //
            'phone' => 'required|numeric', //
            'region' => 'required', //
            'province' => 'required', //
            'city' => 'required',  //
            'barangay' => 'required', //
            'detailed_address' => 'required', //
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:categories,id',
            'operation_hours' => 'required', //
            'catalog_items' => 'required', //
            'shop_photo' => 'required|image', //
            'shop_gallery.*' => 'required|image', //
            'business_permit' => 'required|image', //
            'dti_registration' => 'required|image', //
            'valid_id' => 'required|image', //
        ]);

        DB::beginTransaction();

        try {
            $shop = Shop::create([
                'shop_name' => $validatedData['shop_name'],
                'user_id' => $userID,
                'email' => $validatedData['email'],
                'contact_number' => $validatedData['phone'],
                'shop_photo' => 'storage/' . $validatedData['shop_photo']->store('shop_photos', 'public'),
                'region' => $validatedData['region'],
                'province' => $validatedData['province'],
                'city' => $validatedData['city'],
                'barangay' => $validatedData['barangay'],
                'detailed_address' => $validatedData['detailed_address'],
                'bio' => $validatedData['shop_bio'],
                'status' => 'processing',
            ]);

            if (!empty($validatedData['categories'])) {
                foreach ($validatedData['categories'] as $categoryId) {
                    ShopCategory::create([
                        'shop_id' => $shop->id,
                        'category_id' => $categoryId
                    ]);
                }
            }

            foreach ($validatedData['catalog_items'] as $item) {
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
            foreach ($validatedData['operation_hours'] as $key => $value) {
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

            DB::commit();

            Log::info('Shop created with categories', [
                'shop_id' => $shop->id,
                'categories' => $validatedData['categories']
            ]);

            return redirect()->route('shop.success')->with('success', 'Shop created successfully!');
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
}
