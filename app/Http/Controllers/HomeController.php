<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Models\Shop;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    //
    public function index()
    {
        // Add debug logging
        Log::info('Fetching verified shops for home page');

        // Explicitly query for 'verified' shops
        $latestShops = Shop::where('status', '=', 'verified')
            ->with(['shopGallery', 'shopCategories.categories'])
            ->latest()
            ->take(8)
            ->get();

        Log::info('Latest shops query result:', [
            'count' => $latestShops->count(),
            'shop_ids' => $latestShops->pluck('id')->toArray()
        ]);

        // If no verified shops, check if we have any shops at all and their statuses
        if ($latestShops->isEmpty()) {
            $allShopsCount = Shop::count();
            $shopsByStatus = Shop::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get();

            Log::info('No verified shops found. All shops info:', [
                'total_count' => $allShopsCount,
                'by_status' => $shopsByStatus
            ]);
        }

        $barbershops = Shop::whereHas('shopCategories', function ($query) {
            $query->where('category_id', 1); // Barbershop category ID
        })
            ->where('status', '=', 'verified') // Properly quoted string
            ->with(['shopGallery'])
            ->inRandomOrder()
            ->take(8)
            ->get();

        $hairSalons = Shop::whereHas('shopCategories', function ($query) {
            $query->where('category_id', 2); // Hair salon category ID
        })
            ->where('status', '=', 'verified') // Properly quoted string
            ->with(['shopGallery'])
            ->inRandomOrder()
            ->take(8)
            ->get();

        return Inertia::render('Users/Home', [
            'latestShops' => $latestShops,
            'barbershops' => $barbershops,
            'hairSalons' => $hairSalons,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}
