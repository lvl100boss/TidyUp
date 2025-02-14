<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopDashboardController;
use App\Http\Controllers\ManageBranchController;
use App\Http\Controllers\ShopController;
use App\Http\Middleware\EnsureShopOwner;
use Inertia\Inertia;

Route::get('/shop/dashboard', [ShopDashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('shop.dashboard');
Route::redirect('/shop', '/shop/dashboard')->middleware(['auth', 'verified']);

Route::get('/shop/appointments', function () {
    return Inertia::render('Shops/Appointments');
})->middleware(['auth', 'verified'])->name('shop.appointments');

Route::get('/shop/catalog', function () {
    return Inertia::render('Shops/ShopCatalog');
})->middleware(['auth', 'verified'])->name('shop.catalog');

Route::get('/shop/profile', function () {
    return Inertia::render('Shops/ShopProfile');
})->middleware(['auth', 'verified'])->name('shop.profile');

Route::get('/shop/branches', function () {
    return Inertia::render('Shops/ManageBranch');
})->middleware(['auth', 'verified'])->name('shop.branches');

// Shop SETUP
Route::get('/shop/setup', [ShopController::class, 'create'])->middleware(['auth', 'verified'])->name('shop.setup');
Route::post('/shop/setup', [ShopController::class, 'store'])->middleware(['auth', 'verified'])->name('shop.setup.store');
