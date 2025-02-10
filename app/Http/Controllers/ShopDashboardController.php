<?php

namespace App\Http\Controllers;

use App\Models\Appointments;
use Illuminate\Http\Request;
use App\Models\Shop;
use App\Models\User;
use Inertia\Inertia;

class ShopDashboardController extends Controller
{
    //
    public function index()
    {
        $shop = Shop::with('shopAccount.user')->where('id', auth()->user()->shopAccount->shop_id)->first();
        $pendingAppointments = Appointments::with('shop.branches')->where('shop_id', $shop->shop_id)->where('status', 'pending')->get();
        // dd($pendingAppointments);
        return Inertia::render('Shops/Dashboard', [
            'pendingAppointments' => $pendingAppointments,
            'shop' => $shop
        ]);
    }
}
