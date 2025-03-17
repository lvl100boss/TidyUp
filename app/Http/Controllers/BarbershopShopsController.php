<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Shop;

class BarbershopShopsController extends Controller
{
    //
    public function index()
    {
        $shops = Shop::with(['shopGallery', 'shopCategories' => function ($query) {
            $query->whereHas('categories', function ($query) {
                $query->where('name', 'Barbershop');
            });
        }, 'shopCategories.categories'])->whereHas('shopCategories.categories', function ($query) {
            $query->where('name', 'Barbershop');
        })->inRandomOrder()->limit(20)->get();
        return Inertia::render(
            'Users/Barbershops',
            [
                'shops' => $shops,
            ]
        );
    }
}
