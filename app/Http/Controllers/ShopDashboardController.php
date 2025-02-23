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
        $user = User::find(auth()->user()->id);

        $shop = Shop::where('user_id', $user->id)->first();


        return Inertia::render('Shops/Dashboard', [
            'shop' => $shop,
            'user' => $user
        ]);
    }
}
