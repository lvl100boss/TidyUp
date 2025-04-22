<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Models\Shop;
use App\Models\ShopStaffs;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    //
    public function index()
    {
        // Get random shops with their related data
        // $randomShops = Shop::with(['shopGallery', 'shopCategories.categories'])
        //     ->where('status', '=', 'verified')
        //     ->inRandomOrder()
        //     ->limit(10)
        //     ->get();

        $randomShops = Shop::with(['shopGallery', 'shopCategories.categories'])
            ->where('status', '=', 'verified')
            ->inRandomOrder()
            ->limit(10)
            ->get();
        return Inertia::render('Users/Home', [
            'randomShops' => $randomShops,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}
