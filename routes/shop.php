<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopDashboardController;
use App\Http\Controllers\ShopProfileController;
use App\Http\Controllers\ShopController;
use App\Http\Middleware\EnsureShopOwner;
use App\Http\Controllers\ManageStaffController;
use App\Http\Controllers\ShopAppointmentsController;
use App\Http\Controllers\ShopGalleryController;
use App\Http\Controllers\ShopCatalogController;
use App\Http\Controllers\ShopSocialMediaController;
use App\Http\Controllers\ShopSubscriptionController;
use App\Http\Controllers\ShopResubmissionController;
use Inertia\Inertia;

//Shop Owner and Shop Staff
Route::middleware(['auth', 'verified'])->group(function () {
    // Make sure the dashboard route is defined BEFORE any wildcard routes
    Route::get('/shop/dashboard', [ShopDashboardController::class, 'index'])->name('shop.dashboard');
    Route::redirect('/shop', '/shop/dashboard');
    Route::get('/shop/profile', [ShopProfileController::class, 'index'])->name('shop.profile');
    Route::post('/shop/profile/update-hours', [ShopProfileController::class, 'updateOperationHours'])->name('shop.profile.update-hours');
    Route::post('/shop/update-contact-info', [ShopProfileController::class, 'updateContactInfo'])->name('shop.update-contact-info');
    Route::post('/shop/update-shop-profile', [ShopProfileController::class, 'updateShopProfile'])->name('shop.update-shop-profile');

    // Social Media Routes
    Route::post('/shop/social-media', [ShopSocialMediaController::class, 'store'])->name('shop.social-media.store');
    Route::patch('/shop/social-media/{id}', [ShopSocialMediaController::class, 'update'])->name('shop.social-media.update');
    Route::delete('/shop/social-media/{id}', [ShopSocialMediaController::class, 'destroy'])->name('shop.social-media.destroy');


    Route::get('/shop/catalog', [ShopCatalogController::class, 'index'])->name('shop.catalog');
    Route::post('/shop/catalog', [ShopCatalogController::class, 'store'])->name('shop.catalog.store');
    Route::patch('/shop/catalog/{id}', [ShopCatalogController::class, 'update'])->name('shop.catalog.update');
    Route::delete('/shop/catalog/{id}', [ShopCatalogController::class, 'destroy'])->name('shop.catalog.destroy');
});

//Shop Owner and Manager
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/shop/resubmission', [ShopResubmissionController::class, 'edit'])->name('shop.resubmission');
    Route::patch('/shop/resubmit/basicDetails', [ShopResubmissionController::class, 'updateBasicDetails'])->name('shop.resubmission.basicDetails');
    Route::patch('/shop/resubmit/locationDetails', [ShopResubmissionController::class, 'updateLocationDetails'])->name('shop.resubmission.locationDetails');
    Route::patch('/shops/resubmission/business-hours', [ShopResubmissionController::class, 'updateBusinessHours'])
        ->name('shop.resubmission.businessHours');
    Route::patch('/shop/resubmission/shop-services', [ShopResubmissionController::class, 'updateShopServices'])
        ->name('shop.resubmission.shopServices');

    // Routes for managing services during resubmission
    Route::post('/shop/{shop}/resubmission/services', [ShopResubmissionController::class, 'storeService'])
        ->name('shop.resubmission.services.store');
    Route::patch('/shop/{shop}/resubmission/services/{service}', [ShopResubmissionController::class, 'updateService'])
        ->name('shop.resubmission.services.update');
    Route::delete('/shop/{shop}/resubmission/services/{service}', [ShopResubmissionController::class, 'destroyService'])
        ->name('shop.resubmission.services.destroy');

    // Route for updating legal documents during resubmission
    Route::post('/shop/resubmission/legal-documents/{documentType}', [ShopResubmissionController::class, 'updateLegalDocument'])
        ->name('shop.resubmission.legalDocument.update');

    // Routes for managing gallery photos during resubmission
    Route::post('/shop/resubmission/gallery/{type}', [ShopResubmissionController::class, 'updateGalleryPhoto'])
        ->name('shop.resubmission.gallery.update');
    Route::delete('/shop/resubmission/gallery/{photoId}', [ShopResubmissionController::class, 'deleteGalleryPhoto'])
        ->name('shop.resubmission.gallery.delete');

    Route::post('/shop/resubmission/submit', [ShopResubmissionController::class, 'resubmitShop'])
        ->name('shop.resubmission.submit');

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
    // Shop subscription route
    Route::get('/shop/subscriptions', [ShopSubscriptionController::class, 'index'])->name('shop.subscriptions');
    Route::post('/shop/subscriptions/subscribe', [ShopSubscriptionController::class, 'subscribe'])->name('shop.subscriptions.subscribe');
    Route::post('/shop/subscriptions/cancel', [ShopSubscriptionController::class, 'cancel'])->name('shop.subscriptions.cancel');
});
