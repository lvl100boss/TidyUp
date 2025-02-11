<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Shop;
use App\Models\ShopBranch;

class BookingController extends Controller
{
    //
    public function show($shop_id, $branch_id)
    {
        $shop = Shop::find($shop_id)->with('branches')->where('id', $shop_id)->first();
        $branch = ShopBranch::with(['gallery', 'services.serviceCategory', 'operationHours'])->where('id', $branch_id)->first();
        return Inertia::render('Users/Booking', [
            'shop_id' => $shop_id,
            'branch_id' => $branch_id,
            'shop' => $shop,
            'branch' => $branch
        ]);
    }
}
