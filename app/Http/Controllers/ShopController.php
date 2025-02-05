<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;
use App\Models\ShopBranch;
use Inertia\Inertia;

class ShopController extends Controller
{
    //
    public function show($shop_id, $branch_id)
    {
        // $shop = Shop::find($shop_id);
        // $branch = ShopBranch::find($branch_id);
        return Inertia::render('Users/Shop', [
            // 'shop' => $shop,
            // 'branch' => $branch,
            'shop_id' => $shop_id,
            'branch_id' => $branch_id
        ]);
    }
}
