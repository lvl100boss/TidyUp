<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRestrictionController;
use App\Http\Controllers\Admin\RestrictionController;

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
});