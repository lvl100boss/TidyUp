<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;
use App\Models\Shop;
use App\Models\ShopCategory;
use Inertia\Inertia;

class DiscoverController extends Controller
{
    //
    public function index()
    {
        $shops = Shop::with('shopGallery', 'shopCategories.categories')->inRandomOrder()->limit(10)->get();
        $barberShops = Shop::with(['shopGallery', 'shopCategories.categories'])
            ->whereHas('shopCategories', function ($query) {
                $query->where('category_id', 1);
            })->inRandomOrder()->limit(10)->get();
        $salons = Shop::with(['shopGallery', 'shopCategories.categories'])
            ->whereHas('shopCategories', function ($query) {
                $query->where('category_id', 2);
            })->inRandomOrder()->limit(10)->get();
        return Inertia::render(
            'Users/Discover',
            ['shops' => $shops, 'barberShops' => $barberShops, 'salons' => $salons]
        );
    }
}
