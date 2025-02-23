<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopDashboardController;
use App\Http\Controllers\ShopProfileController;
use App\Http\Controllers\ShopController;
use App\Http\Middleware\EnsureShopOwner;
use App\Http\Controllers\ManageStaffController;
use App\Http\Controllers\ShopGalleryController;
use Inertia\Inertia;

//Shop Owner and Shop Staff
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/shop/dashboard', [ShopDashboardController::class, 'index'])->name('shop.dashboard');
    Route::redirect('/shop', '/shop/dashboard');
    Route::get('/shop/profile', [ShopProfileController::class, 'index'])->name('shop.profile');
    Route::get('/shop/appointments', function () {
        return Inertia::render('Shops/Appointments');
    })->name('shop.appointments');
    Route::get('/shop/catalog', function () {
        return Inertia::render('Shops/ShopCatalog');
    })->name('shop.catalog');
});

//Shop Owner and Manager
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/shop/manage/staff', [ManageStaffController::class, 'index'])->name('shop.manage.staff');
    Route::get('/shop/manage/staff/create', [ManageStaffController::class, 'create'])->name('shop.manage.staff.create');
    Route::post('/shop/manage/staff', [ManageStaffController::class, 'store'])->name('shop.manage.staff.store');
    Route::get('/shop/manage/staff/{id}/edit', [ManageStaffController::class, 'edit'])->name('shop.manage.staff.edit');
    Route::patch('/shop/manage/staff/{id}', [ManageStaffController::class, 'update'])->name('shop.manage.staff.update');
    Route::delete('/shop/manage/staff/{id}/delete', [ManageStaffController::class, 'destroy'])->name('shop.manage.staff.destroy');

    Route::post('upload', [ShopGalleryController::class, 'upload'])->name('shop.gallery.upload');
    Route::delete('delete', [ShopGalleryController::class, 'delete'])->name('shop.gallery.delete');
    Route::post('reorder', [ShopGalleryController::class, 'reorder'])->name('reorder');
});
