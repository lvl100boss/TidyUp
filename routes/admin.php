<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRestrictionController;
use App\Http\Controllers\Admin\RestrictionController;
<<<<<<< HEAD
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
=======
>>>>>>> parent of d6b13c5 (Merge pull request #111 from lvl100boss/main)

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
<<<<<<< HEAD
<<<<<<< Updated upstream
    // Route::get('/staff', [PlatformStaffController::class, 'index'])->name('staff.index');
    // Route::post('/staff', [PlatformStaffController::class, 'store'])->name('staff.store');
    // Route::put('/staff/{staff}', [PlatformStaffController::class, 'update'])->name('staff.update');
    // Route::post('/staff/{staff}/avatar', [PlatformStaffController::class, 'updateAvatar'])->name('staff.avatar');
    // Route::delete('/staff/{staff}', [PlatformStaffController::class, 'destroy'])->name('staff.destroy');
=======
=======
>>>>>>> parent of d6b13c5 (Merge pull request #111 from lvl100boss/main)
    // Route::get('/admin/staff', [PlatformStaffController::class, 'index'])->name('staff.index');
    // Route::post('/admin/staff', [PlatformStaffController::class, 'store'])->name('staff.store');
    // Route::put('/admin/staff/{staff}', [PlatformStaffController::class, 'update'])->name('staff.update');
    // Route::post('/admin/staff/{staff}/avatar', [PlatformStaffController::class, 'updateAvatar'])->name('staff.avatar');
    // Route::delete('/admin/staff/{staff}', [PlatformStaffController::class, 'destroy'])->name('staff.destroy');
<<<<<<< HEAD

>>>>>>> Stashed changes
=======
>>>>>>> parent of d6b13c5 (Merge pull request #111 from lvl100boss/main)
});
