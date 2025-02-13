<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DiscoverController;
use App\Http\Controllers\ShopController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Middleware\EnsureVerifiedIfAuthenticated;

Route::middleware(EnsureVerifiedIfAuthenticated::class)->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');

    Route::get('/discover', [DiscoverController::class, 'index'])->name('Discover');
    Route::get('/popular', function () {
        return Inertia::render('Users/Popular');
    })->name('Popular');
    Route::get('barbershops', function () {
        return Inertia::render('Users/Barbershops');
    })->name('Barbershops');
    Route::get('hair-salons', function () {
        return Inertia::render('Users/HairSalons');
    })->name('HairSalons');
    Route::get('/FAQs', function () {
        return Inertia::render('Users/Faqs');
    })->name('FAQs');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/appointments', [AppointmentController::class, 'index'])->name('appointments');

    Route::get('/send-feedback', function () {
        return Inertia::render('Users/SendFeedback');
    })->name('SendFeedback');
    Route::get('/report-issue', function () {
        return Inertia::render('Users/ReportAnIssue');
    })->name('ReportAnIssue');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/booking.php';
require __DIR__ . '/shop.php';
require __DIR__ . '/admin.php';
