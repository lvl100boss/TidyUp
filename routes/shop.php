<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopDashboardController;
use App\Http\Controllers\ShopController;
use Inertia\Inertia;
// Shop Dashboard
Route::get('/shop/dashboard', [ShopDashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('shop.dashboard');

Route::redirect('/shop', '/shop/dashboard')
    ->middleware(['auth', 'verified']);

// Shop Pages
$shopPages = [
    'appointments' => 'Shops/Appointments',
    'catalog' => 'Shops/ShopCatalog',
    'profile' => 'Shops/ShopProfile',
    'branches' => 'Shops/ManageBranch',
];

foreach ($shopPages as $route => $component) {
    Route::get("/shop/{$route}", function () use ($component) {
        return Inertia::render($component);
    })->middleware(['auth', 'verified'])->name("shop.{$route}");
}

// Shop Setup
Route::get('/shop/setup', [ShopController::class, 'create'])
    ->middleware(['auth', 'verified'])
    ->name('shop.setup');

Route::post('/shop/setup', [ShopController::class, 'store'])
    ->middleware(['auth', 'verified'])
    ->name('shop.setup.store');
