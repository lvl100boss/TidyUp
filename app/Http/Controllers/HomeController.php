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
        // Get random shops with their related data
        $randomShops = Shop::with(['shopGallery', 'shopCategories.categories'])
                      ->where('status', '=', 'verified')
                      ->inRandomOrder()
                      ->limit(10)
                      ->get();
        
        // Get latest shops for the homepage showcase
        $latestShops = Shop::where('status', '=', 'verified')
                     ->with(['shopGallery', 'shopCategories.categories'])
                     ->latest()
                     ->take(8)
                     ->get();
        
        // Get barbershops specifically (category_id = 1)
        $barbershops = Shop::whereHas('shopCategories', function ($query) {
                        $query->where('category_id', 1); // Barbershop category ID
                      })
                      ->where('status', '=', 'verified')
                      ->with(['shopGallery'])
                      ->inRandomOrder()
                      ->take(8)
                      ->get();
        
        // Get hair salons specifically (category_id = 2)
        $hairSalons = Shop::whereHas('shopCategories', function ($query) {
                      $query->where('category_id', 2); // Hair salon category ID
                    })
                    ->where('status', '=', 'verified')
                    ->with(['shopGallery'])
                    ->inRandomOrder()
                    ->take(8)
                    ->get();

        return Inertia::render('Users/Home', [
            'randomShops' => $randomShops,
            'latestShops' => $latestShops,
            'barbershops' => $barbershops,
            'hairSalons' => $hairSalons,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}