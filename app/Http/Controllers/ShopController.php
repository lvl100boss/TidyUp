<?php

namespace App\Http\Controllers;

use App\Models\ServiceCategories;
use Illuminate\Http\Request;
use App\Models\Shop;
use App\Models\ShopBranch;
use Inertia\Inertia;

class ShopController extends Controller
{
    //
    public function show($shop_id, $branch_id)
    {
        $shop = Shop::find($shop_id)->with('branches')->where('id', $shop_id)->first();
        $branch = ShopBranch::with(['gallery', 'services.serviceCategory', 'operationHours'])->where('id', $branch_id)->first();

        $randomShops = Shop::with('branches.gallery')->with('branches.branchCategories')->inRandomOrder()->limit(10)->get();

        $branchServices = $branch->services;
        return Inertia::render('Users/Shop', [
            'shop' => $shop,
            'branch' => $branch,
            'branchServices' => $branchServices,
            'randomShops' => $randomShops
        ]);
    }
}
