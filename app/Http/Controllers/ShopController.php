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
        $validated = $request->validate([
            'shop_name' => 'required|unique:shops,shop_name', //
            'shop_bio' => 'required', //
            'email' => 'required|email', //
            'phone' => 'required|numeric', //
            'region' => 'required', //
            'province' => 'required', //
            'city' => 'required',  //
            'barangay' => 'required', //
            'detailed_address' => 'required', //
            'categories' => 'required', //
            'operation_hours' => 'required', //
            'catalog_items' => 'required', //
            'shop_photo' => 'required|image', //
            'shop_gallery.*' => 'required|image', //
            'business_permit' => 'required|image', //
            'dti_registration' => 'required|image', //
            'valid_id' => 'required|image', //
        ]);

        $shop = Shop::create([
            'shop_name' => $validated['shop_name'],
            'user_id' => $userID,
            'email' => $validated['email'],
            'contact_number' => $validated['phone'],
            'shop_photo' => 'storage/' . $validated['shop_photo']->store('shop_photos', 'public'),
            'region' => $validated['region'],
            'province' => $validated['province'],
            'city' => $validated['city'],
            'barangay' => $validated['barangay'],
            'detailed_address' => $validated['detailed_address'],
            'bio' => $validated['shop_bio'],
        ]);
        foreach ($validated['categories'] as $category) {
            $shopCategory = ShopCategory::create([
                'category_id' => $category,
                'shop_id' => $shop->id
            ]);
        }
        foreach ($validated['catalog_items'] as $item) {
            $shopServiceCategories = ShopServiceCategories::create([
                'service_name' => $item['service_name'],
                'cost' => $item['cost'],
                'duration_hour' => $item['duration_hour'],
                'duration_minute' => $item['duration_minute'],
                'service_category_id' => $item['category_id'],
                'shop_id' => $shop->id
            ]);
        }
        foreach ($validated['shop_gallery'] as $gallery) {
            $shopGallery = ShopGallery::create([
                'url' => 'storage/' . $gallery->store('shop_gallery', 'public'),
                'shop_id' => $shop->id
            ]);
        }
        foreach ($validated['operation_hours'] as $key => $value) {
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
        $shopLegalDocument = ShopLegalDocument::create([
            'shop_id' => $shop->id,
            'business_permit_url' => 'storage/' . $validated['business_permit']->store('legal_documents', 'private'),
            'dti_registration_url'  => 'storage/' . $validated['dti_registration']->store('legal_documents', 'private'),
            'valid_id_url' => 'storage/' . $validated['valid_id']->store('legal_documents', 'private'),
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

        return redirect()->route('home');
    }

    public function show($id)
    {
        $shop = Shop::with(['shopGallery', 'shopServiceCategories.serviceCategories', 'shopOperationHours'])->find($id);
        $randomShops = Shop::with(['shopGallery', 'shopCategories.categories'])->inRandomOrder()->limit(10)->get();
        return Inertia::render('Users/Shop', [
            'shop' => $shop,
            'randomShops' => $randomShops
        ]);
    }
}

// this is the output of dd($validated);
// array:18 [▼ // app\Http\Controllers\ShopController.php:29
//   "shop_name" => "Gupit ni John"
//   "bio" => null
//   "email" => "test@gmail.com"
//   "phone" => "09877899876"
//   "region" => "Region II (Cagayan Valley)"
//   "province" => "Batanes"
//   "city" => "Ivana"
//   "barangay" => "Salagao"
//   "detailed_address" => "WMSU, Baliwasan, Z.C."
//   "categories" => array:2 [▼
//     0 => "1"
//     1 => "2"
//   ]
// "operation_hours" => array:7 [▼
// "Monday" => array:3 [▼
//   "isOpen" => "1"
//   "openTime" => "9:00 AM"
//   "closeTime" => "5:00 PM"
// ]
// "Tuesday" => array:3 [▼
//   "isOpen" => "1"
//   "openTime" => "9:00 AM"
//   "closeTime" => "5:00 PM"
// ]
// "Wednesday" => array:3 [▼
//   "isOpen" => "1"
//   "openTime" => "9:00 AM"
//   "closeTime" => "5:00 PM"
// ]
// "Thursday" => array:3 [▼
//   "isOpen" => "0"
//   "openTime" => "9:00 AM"
//   "closeTime" => "5:00 PM"
// ]
// "Friday" => array:3 [▼
//   "isOpen" => "0"
//   "openTime" => "9:00 AM"
//   "closeTime" => "5:00 PM"
// ]
// "Saturday" => array:3 [▼
//   "isOpen" => "0"
//   "openTime" => "9:00 AM"
//   "closeTime" => "5:00 PM"
// ]
// "Sunday" => array:3 [▼
//   "isOpen" => "0"
//   "openTime" => "9:00 AM"
//   "closeTime" => "5:00 PM"
// ]
// ]
//   "catalog_items" => array:1 [▼
//     0 => array:6 [▼
//       "service_name" => "12345"
//       "cost" => "2000"
//       "duration_hour" => "0"
//       "duration_minute" => "30"
//       "category_id" => "2"
//       "category_name" => "Hair Styling"
//     ]
//   ]
//   "shop_bio" => "12345"
//   "shop_photo" => 
// Illuminate\Http\UploadedFile {#1342 ▶}
//   "shop_gallery" => array:5 [▼
//     0 => Illuminate\Http\UploadedFile {#1340 ▶}
//     1 => Illuminate\Http\UploadedFile {#1343 ▶}
//     2 => Illuminate\Http\UploadedFile {#1347 ▶}
//     3 => Illuminate\Http\UploadedFile {#1345 ▶}
//     4 => Illuminate\Http\UploadedFile {#1348 ▶}
//   ]
//   "business_permit" => Illuminate\Http\UploadedFile {#1074 ▶}
//   "dti_registration" => Illuminate\Http\UploadedFile {#1349 ▶}
//   "valid_id" => Illuminate\Http\UploadedFile {#1350 ▶}
// ]