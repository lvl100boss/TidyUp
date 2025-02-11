<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
})->middleware(['auth', 'verified'])->name('admin.dashboard');
Route::redirect('/admin', '/admin/dashboard')->middleware(['auth', 'verified']);

Route::get('/admin/users', function () {
    return Inertia::render('Admin/Users');
})->middleware(['auth', 'verified'])->name('admin.users');

Route::get('/admin/restriction', function () {
    return Inertia::render('Admin/Restriction');
})->middleware(['auth', 'verified'])->name('admin.restriction');

Route::get('/admin/platform/staff', function () {
    return Inertia::render('Admin/PlatformStaff');
})->middleware(['auth', 'verified'])->name('admin.platform.staff');
