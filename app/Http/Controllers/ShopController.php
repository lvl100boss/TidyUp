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
        $shop = Shop::find($shop_id);


        $branch = ShopBranch::with(['gallery', 'services.serviceCategory'])->where('id', $branch_id)->first();

        $branchServices = $branch->services;
        return Inertia::render('Users/Shop', [
            'shop' => $shop,
            'branch' => $branch,
            'branchServices' => $branchServices
        ]);
    }
}
