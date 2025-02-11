<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shop;
use Inertia\Inertia;

class ManageBranchController extends Controller
{
    //
    public function index()
    {

        $shop = Shop::with(['shopAccount.user', 'branches'])->where('id', auth()->user()->shopAccount->shop_id)->first();
        return Inertia::render('Shops/ManageBranch', [
            'shop' => $shop
        ]);
    }
}
