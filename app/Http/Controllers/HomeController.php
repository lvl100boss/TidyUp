<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Models\Shop;

class HomeController extends Controller
{
    //
    public function index()
    {
        $randomShops = Shop::with(['shopGallery', 'shopCategories.categories'])->inRandomOrder()->limit(10)->get();
        // $randomShops = Shop::with(['shopGallery', 'shopCategories.categories'])->where('is_verified', 1)->inRandomOrder()->limit(10)->get();
        return Inertia::render('Users/Home', [
            'randomShops' => $randomShops,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}
