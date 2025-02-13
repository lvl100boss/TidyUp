<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopDashboardController;
use App\Http\Controllers\ShopController;
use App\Http\Middleware\EnsureShopOwner;
use Inertia\Inertia;
// Shop Dashboard
Route::get('/shop/dashboard', [ShopDashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('shop.dashboard');

Route::redirect('/shop', '/shop/dashboard')
    ->middleware(['auth', 'verified']);

// Shop Pages
Route::middleware(['auth', 'verified', EnsureShopOwner::class])->group(function () {
    $shopPages = [
        'appointments' => 'Shops/Appointments',
        'catalog' => 'Shops/ShopCatalog',
        'profile' => 'Shops/ShopProfile',
        'branches' => 'Shops/ManageBranch',
    ];
    foreach ($shopPages as $route => $component) {
        Route::get("/shop/{$route}", function () use ($component) {
            return Inertia::render($component);
        })->name("shop.{$route}");
    }
});
Route::get('/{shop_id}/shop', [ShopController::class, 'show'])->name('shop.show');

// Shop Setup
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/shop/setup', [ShopController::class, 'create'])->name('shop.setup');
    Route::post('/shop/setup', [ShopController::class, 'store'])->name('shop.store');
});
