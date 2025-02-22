<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopProfileController extends Controller
{
    public function index()
    {
        $user_id = auth()->user()->id;
        $shop = Shop::with(['shopGallery', 'shopOperationHours', 'shopServiceCategories.serviceCategories', 'staffs.staff'])->where('user_id', $user_id)->first();

        return Inertia::render('Shops/ShopProfile', [
            'shop' => $shop,
        ]);
    }
}
