<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
})->middleware(['auth', 'verified'])->name('admin.dashboard');
Route::redirect('/admin', '/badmin/dashboard')->middleware(['auth', 'verified']);

Route::get('/admin/shops', function () {
    return Inertia::render('Admin/Shops');
})->middleware(['auth', 'verified'])->name('admin.shops');
Route::get('/admin/users', function () {
    return Inertia::render('Admin/Users');
})->middleware(['auth', 'verified'])->name('admin.users');

Route::get('/admin/analytics', function () {
    return Inertia::render('Admin/Analytics');
})->middleware(['auth', 'verified'])->name('admin.analytics');

Route::get('/admin/feedback', function () {
    return Inertia::render('Admin/UserFeedback');
})->middleware(['auth', 'verified'])->name('admin.feedback');

Route::get('/admin/customer-service', function () {
    return Inertia::render('Admin/CustomerService');
})->middleware(['auth', 'verified'])->name('admin.customer-service');

Route::get('/admin/restriction', function () {
    return Inertia::render('Admin/Restriction');
})->middleware(['auth', 'verified'])->name('admin.restriction');

Route::get('/admin/platform/staff', function () {
    return Inertia::render('Admin/PlatformStaff');
})->middleware(['auth', 'verified'])->name('admin.platform.staff');
