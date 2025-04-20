<?php

namespace App\Http\Controllers;

use App\Models\Shop;
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
        $perPage = 2;
        
        // Get paginated shops for display
        $shops = Shop::with(['shopGallery', 'shopCategories.categories'])
            ->orderBy('id', 'asc')
            ->paginate($perPage);
            
        // Get all shops for search functionality with shop_photo field
        $searchShops = Shop::select('id', 'shop_name', 'shop_photo')
            ->orderBy('shop_name', 'asc')
            ->get();
            
        // Log pagination information for debugging
        Log::info('Popular shops pagination: Total=' . $shops->total() . 
                  ', Current page=' . $shops->currentPage() . 
                  ', Last page=' . $shops->lastPage());
            
        return Inertia::render('Users/Popular', [
            'shops' => $shops->items(),
            'searchShops' => $searchShops, // All shops with shop_photo field for search
            'pagination' => [
                'total' => $shops->total(),
                'perPage' => $shops->perPage(),
                'currentPage' => $shops->currentPage(),
                'lastPage' => $shops->lastPage(),
            ]
        ]);
    }
}