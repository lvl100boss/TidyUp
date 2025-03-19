<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRestrictionController;
use App\Http\Controllers\Admin\RestrictionController;


use App\Http\Controllers\Admin\ShopController;
use App\Http\Controllers\Admin\ShopManagementController;
use App\Http\Controllers\Admin\SubscriptionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\Admin\ShopController as AdminShopController;

// Testing route outside middleware (accessible to everyone)
Route::get('/admin/test', function () {
    return Inertia::render('Admin/Dashboard');
})->name('admin.test');

// Use the middleware class name, not a string
Route::middleware(['auth', \App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {


    // Shop management routes with verification
    Route::get('/shops', [AdminShopController::class, 'index'])->name('shops');
    Route::get('/shops/{shop}', [ShopController::class, 'show'])->name('shops.show');
    Route::post('/shops/{shop}/verify', [ShopController::class, 'verify'])->name('shops.verify');
    Route::post('/shops/{shop}/reject', [ShopController::class, 'reject'])->name('shops.reject');
    Route::post('/shops/{shop}/update-status', [ShopController::class, 'updateStatus'])->name('shops.update-status');
    Route::get('/shops/{shop}/documents/{type}', [ShopManagementController::class, 'downloadDocument'])->name('shops.download-document');


   
    // Dashboard
    Route::redirect('/', '/admin/dashboard');




    // Static pages
    Route::get('/analytics', function () {

        return Inertia::render('Admin/Analytics');
    })->name('analytics');

    Route::get('/feedback', function () {
        return Inertia::render('Admin/UserFeedback');
    })->name('feedback');

    Route::get('/customer-service', function () {
        return Inertia::render('Admin/CustomerService');
    })->name('customer-service');

    Route::get('/platform/staff', function () {
        return Inertia::render('Admin/PlatformStaff');
    })->name('platform.staff');

    
    // User management
    Route::get('/users', [UserController::class, 'index'])
        ->name('users');

    // User restrictions
    Route::get('/restriction', [UserRestrictionController::class, 'index'])
        ->name('restriction');

    Route::post('/users/restrict', [UserRestrictionController::class, 'store'])
        ->name('users.restrict');

    Route::post('/restrictions/lift', [UserRestrictionController::class, 'lift'])
        ->name('restrictions.lift');

        

// Subscription routes
Route::get('/subscription', [SubscriptionController::class, 'index'])
->name('subscriptions.index');

Route::post('/subscriptions', [SubscriptionController::class, 'store'])
->name('subscriptions.store');

Route::put('/subscriptions/{subscription}', [SubscriptionController::class, 'update'])
->name('subscriptions.update');

Route::delete('/subscriptions/{subscription}', [SubscriptionController::class, 'destroy'])
->name('subscriptions.destroy');


     //  Platform Staff Routes
    // Route::get('/staff', [PlatformStaffController::class, 'index'])->name('staff.index');
    // Route::post('/staff', [PlatformStaffController::class, 'store'])->name('staff.store');
    // Route::put('/staff/{staff}', [PlatformStaffController::class, 'update'])->name('staff.update');
    // Route::post('/staff/{staff}/avatar', [PlatformStaffController::class, 'updateAvatar'])->name('staff.avatar');
    
    // Route::delete('/staff/{staff}', [PlatformStaffController::class, 'destroy'])->name('staff.destroy');



});
