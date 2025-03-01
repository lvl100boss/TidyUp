<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopDashboardController;
use App\Http\Controllers\ShopProfileController;
use App\Http\Controllers\ShopController;
use App\Http\Middleware\EnsureShopOwner;
use App\Http\Controllers\ManageStaffController;
use App\Http\Controllers\ShopGalleryController;
use App\Http\Controllers\ShopCatalogController;
use Inertia\Inertia;

//Shop Owner and Shop Staff
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/shop/dashboard', [ShopDashboardController::class, 'index'])->name('shop.dashboard');
    Route::redirect('/shop', '/shop/dashboard');
    Route::get('/shop/profile', [ShopProfileController::class, 'index'])->name('shop.profile');
    Route::get('/shop/appointments', function () {
        return Inertia::render('Shops/Appointments');
    })->name('shop.appointments');

    Route::get('/shop/catalog', [ShopCatalogController::class, 'index'])->name('shop.catalog');
    Route::post('/shop/catalog', [ShopCatalogController::class, 'store'])->name('shop.catalog.store');
    Route::patch('/shop/catalog/{id}', [ShopCatalogController::class, 'update'])->name('shop.catalog.update');
    Route::delete('/shop/catalog/{id}', [ShopCatalogController::class, 'destroy'])->name('shop.catalog.destroy');
});

//Shop Owner and Manager
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/shop/manage/staff', [ManageStaffController::class, 'index'])->name('shop.manage.staff');
    Route::controller(ManageStaffController::class)
        ->prefix('/shop/manage/staff')
        ->group(function () {
            Route::get('/create', 'create')->name('shop.manage.staff.create');
            Route::post('/', 'store')->name('shop.manage.staff.store');
            Route::get('/{id}/edit', 'edit')->name('shop.manage.staff.edit');
            Route::patch('/{id}', 'update')->name('shop.manage.staff.update');
            Route::delete('/{id}/delete', 'destroy')->name('shop.manage.staff.destroy');
        });

    Route::post('upload', [ShopGalleryController::class, 'upload'])->name('shop.gallery.upload');
    Route::delete('delete', [ShopGalleryController::class, 'delete'])->name('shop.gallery.delete');
    Route::post('reorder', [ShopGalleryController::class, 'reorder'])->name('reorder');
});
