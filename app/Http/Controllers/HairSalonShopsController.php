<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Shop;

class HairSalonShopsController extends Controller
{
    //
    public function index()
    {
        $shops = Shop::with(['shopGallery', 'shopCategories' => function ($query) {
            $query->whereHas('categories', function ($query) {
                $query->where('name', 'Hair Salon');
            });
        }, 'shopCategories.categories'])->whereHas('shopCategories.categories', function ($query) {
            $query->where('name', 'Hair Salon');
        })->inRandomOrder()->limit(20)->get();

        return Inertia::render(
            'Users/HairSalons',
            [
                'shops' => $shops,
            ]
        );
    }
}
