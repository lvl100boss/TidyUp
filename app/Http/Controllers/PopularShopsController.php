<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\Categories;
use App\Models\ServiceCategories;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PopularShopsController extends Controller
{
    public function index(Request $request)
    {
        // Get the current page from the request or default to 1
        $page = $request->input('page', 1);
        
        // Number of shops per page
        $perPage = 5;
        
        // Build query for shops - only get verified shops
        $query = Shop::with(['shopGallery', 'shopCategories.categories'])
            ->where('is_verified', true);
        
        // Apply category filter if provided
        if ($request->has('category_id') && $request->category_id) {
            $query->whereHas('shopCategories', function($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }
        
        // Apply province filter
        if ($request->has('province') && $request->province) {
            $query->where('province', $request->province);
        }
        
        // Apply city filter
        if ($request->has('city') && $request->city) {
            $query->where('city', $request->city);
        }
        
        // Apply barangay filter
        if ($request->has('barangay') && $request->barangay) {
            $query->where('barangay', $request->barangay);
        }
        
        // Apply services filter if provided
        if ($request->has('services') && $request->services) {
            $serviceIds = explode(',', $request->services);
            $query->whereHas('shopServiceCategories', function($q) use ($serviceIds) {
                $q->whereIn('service_category_id', $serviceIds);
            });
        }
        
        // Execute the query with pagination
        $shops = $query->orderBy('id', 'asc')
            ->paginate($perPage);
            
        // Get all shops for search functionality with shop_photo field - only verified shops
        $searchShops = Shop::select('id', 'shop_name', 'shop_photo')
            ->where('is_verified', true)
            ->orderBy('shop_name', 'asc')
            ->get();
            
        // Get all categories for filtering
        $categories = Categories::all();
        
        // Get all service categories for filtering
        $services = ServiceCategories::all();
            
        // Get unique provinces for filtering - only from verified shops
        $provinces = Shop::select('province')
            ->where('is_verified', true)
            ->distinct()
            ->whereNotNull('province')
            ->pluck('province')
            ->toArray();
            
        // Get unique cities for filtering - only from verified shops
        $cities = Shop::select('city')
            ->where('is_verified', true)
            ->distinct()
            ->whereNotNull('city')
            ->pluck('city')
            ->toArray();
            
        // Get unique barangays from shops for filtering - only from verified shops
        $barangays = Shop::select('barangay')
            ->where('is_verified', true)
            ->distinct()
            ->whereNotNull('barangay')
            ->pluck('barangay')
            ->toArray();
            
        // Log pagination information for debugging
        Log::info('Popular shops pagination: Total=' . $shops->total() . 
                  ', Current page=' . $shops->currentPage() . 
                  ', Last page=' . $shops->lastPage());
            
        return Inertia::render('Users/Popular', [
            'shops' => $shops->items(),
            'searchShops' => $searchShops,
            'categories' => $categories,
            'provinces' => $provinces,
            'cities' => $cities,
            'barangays' => $barangays,
            'services' => $services,
            'pagination' => [
                'total' => $shops->total(),
                'perPage' => $shops->perPage(),
                'currentPage' => $shops->currentPage(),
                'lastPage' => $shops->lastPage(),
            ]
        ]);
    }
}