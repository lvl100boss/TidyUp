<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRestrictionController;
use App\Http\Controllers\Admin\RestrictionController;
<<<<<<< Updated upstream
use App\Http\Controllers\Admin\ShopController;
use App\Http\Controllers\Admin\ShopManagementController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Middleware\AdminMiddleware;

// Testing route outside middleware (accessible to everyone)
Route::get('/admin/test', function () {
    return Inertia::render('Admin/Dashboard');
})->name('admin.test');

// Use the middleware class name, not a string
Route::middleware(['auth', \App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Shop management routes
    Route::get('/shops', [ShopController::class, 'index'])->name('shops');
    Route::get('/shops/{shop}', [ShopController::class, 'show'])->name('shops.show');
    Route::post('/shops/{shop}/update-status', [ShopManagementController::class, 'updateStatus'])->name('shops.update-status');
    Route::get('/shops/{shop}/documents/{type}', [ShopManagementController::class, 'downloadDocument'])->name('shops.download-document');
=======
use App\Http\Controllers\Admin\SubscriptionController;
>>>>>>> Stashed changes

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

    Route::get('/admin/subscription', [SubscriptionController::class, 'index'])
    ->name('admin.subscriptions.index');

Route::post('/admin/subscriptions', [SubscriptionController::class, 'store'])
    ->name('admin.subscriptions.store');

Route::put('/admin/subscriptions/{subscription}', [SubscriptionController::class, 'update'])
    ->name('admin.subscriptions.update');

Route::delete('/admin/subscriptions/{subscription}', [SubscriptionController::class, 'destroy'])
    ->name('admin.subscriptions.destroy');

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

    //  Platform Staff Routes
<<<<<<< Updated upstream
    // Route::get('/staff', [PlatformStaffController::class, 'index'])->name('staff.index');
    // Route::post('/staff', [PlatformStaffController::class, 'store'])->name('staff.store');
    // Route::put('/staff/{staff}', [PlatformStaffController::class, 'update'])->name('staff.update');
    // Route::post('/staff/{staff}/avatar', [PlatformStaffController::class, 'updateAvatar'])->name('staff.avatar');
    // Route::delete('/staff/{staff}', [PlatformStaffController::class, 'destroy'])->name('staff.destroy');
=======
    // Route::get('/admin/staff', [PlatformStaffController::class, 'index'])->name('staff.index');
    // Route::post('/admin/staff', [PlatformStaffController::class, 'store'])->name('staff.store');
    // Route::put('/admin/staff/{staff}', [PlatformStaffController::class, 'update'])->name('staff.update');
    // Route::post('/admin/staff/{staff}/avatar', [PlatformStaffController::class, 'updateAvatar'])->name('staff.avatar');
    // Route::delete('/admin/staff/{staff}', [PlatformStaffController::class, 'destroy'])->name('staff.destroy');

>>>>>>> Stashed changes
});
