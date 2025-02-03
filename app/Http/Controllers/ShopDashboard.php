<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;
use App\Models\User;
use Inertia\Inertia;

class ShopDashboard extends Controller
{
    //
    public function index()
    {
        $shop = Shop::with('shopAccount.user')->where('id', auth()->user()->shopAccount->shop_id)->first();
        return Inertia::render('Shops/Dashboard', [
            'shop' => $shop
        ]);
    }
}
