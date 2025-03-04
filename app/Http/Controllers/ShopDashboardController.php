<?php

namespace App\Http\Controllers;

use App\Services\ShopDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopDashboardController extends Controller
{
    protected $shopDashboardService;

    public function __construct(ShopDashboardService $shopDashboardService)
    {
        $this->shopDashboardService = $shopDashboardService;
    }

    public function index()
    {
        $data = $this->shopDashboardService->getShopData(auth()->id());
        return Inertia::render('Shops/Dashboard', $data);
    }
}
