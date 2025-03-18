<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRestrictionController;
use App\Http\Controllers\Admin\RestrictionController;
use App\Http\Controllers\Admin\SubscriptionController;

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');
    Route::redirect('/admin', '/admin/dashboard');

    // Static pages
    Route::get('/admin/shops', function () {
        return Inertia::render('Admin/Shops');
    })->name('admin.shops');

    Route::get('/admin/analytics', function () {
        return Inertia::render('Admin/Analytics');
    })->name('admin.analytics');

    Route::get('/admin/feedback', function () {
        return Inertia::render('Admin/UserFeedback');
    })->name('admin.feedback');

    Route::get('/admin/customer-service', function () {
        return Inertia::render('Admin/CustomerService');
    })->name('admin.customer-service');

    Route::get('/admin/platform/staff', function () {
        return Inertia::render('Admin/PlatformStaff');
    })->name('admin.platform.staff');

    Route::get('/admin/subscription', [SubscriptionController::class, 'index'])
    ->name('admin.subscriptions.index');

Route::post('/admin/subscriptions', [SubscriptionController::class, 'store'])
    ->name('admin.subscriptions.store');

Route::put('/admin/subscriptions/{subscription}', [SubscriptionController::class, 'update'])
    ->name('admin.subscriptions.update');

Route::delete('/admin/subscriptions/{subscription}', [SubscriptionController::class, 'destroy'])
    ->name('admin.subscriptions.destroy');

    // User management
    Route::get('/admin/users', [UserController::class, 'index'])
        ->name('admin.users');

    // User restrictions
    Route::get('/admin/restriction', [UserRestrictionController::class, 'index'])
        ->name('admin.restriction');

    Route::post('/admin/users/restrict', [UserRestrictionController::class, 'store'])
        ->name('admin.users.restrict');

    Route::post('/admin/restrictions/lift', [UserRestrictionController::class, 'lift'])
        ->name('admin.restrictions.lift');
    //  Platform Staff Routes
    // Route::get('/admin/staff', [PlatformStaffController::class, 'index'])->name('staff.index');
    // Route::post('/admin/staff', [PlatformStaffController::class, 'store'])->name('staff.store');
    // Route::put('/admin/staff/{staff}', [PlatformStaffController::class, 'update'])->name('staff.update');
    // Route::post('/admin/staff/{staff}/avatar', [PlatformStaffController::class, 'updateAvatar'])->name('staff.avatar');
    // Route::delete('/admin/staff/{staff}', [PlatformStaffController::class, 'destroy'])->name('staff.destroy');

});
