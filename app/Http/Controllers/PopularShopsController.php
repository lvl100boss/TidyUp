<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Shop;

class PopularShopsController extends Controller
{
    //
    public function index()
    {
        $shops = Shop::with(['shopGallery', 'shopCategories.categories'])
            ->where('status', 'verified') // Only show verified shops
            ->inRandomOrder()
            ->paginate(12);
        return Inertia::render('Users/Popular', [
            'shops' => $shops,
        ]);
    }
}
