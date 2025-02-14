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
        $shops = Shop::all();
        $categoriess = Categories::all();

        return Inertia::render(
            'Users/Discover',
            ['shopss' => $shops, 'categoriess' => $categoriess]
        );
    }
}
