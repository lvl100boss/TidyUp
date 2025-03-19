<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BarbershopShopsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DiscoverController;
use App\Http\Controllers\HairSalonShopsController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\PopularShopsController;
use Illuminate\Foundation\Application;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Middleware\EnsureVerifiedIfAuthenticated;

Route::middleware(EnsureVerifiedIfAuthenticated::class)->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::redirect('/dashboard', '/');
    Route::get('/discover', [DiscoverController::class, 'index'])->name('Discover');
    Route::get('/popular', [PopularShopsController::class, 'index'])->name('Popular');
    Route::get('barbershops', [BarbershopShopsController::class, 'index'])->name('Barbershops');
    Route::get('hair-salons', [HairSalonShopsController::class, 'index'])->name('HairSalons');
    Route::get('/FAQs', function () {
        return Inertia::render('Users/Faqs');
    })->name('FAQs');
    Route::get('/aboutus', function () {
        return Inertia::render('AboutUs');
    })->name('AboutUs');
});

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

    // Add a route for SetupShop with middleware
    Route::get('/shop/setup', [ShopController::class, 'setup'])->name('shop.setup');
    Route::post('/shop/setup', [ShopController::class, 'store'])->name('shop.store');
});

// Fix the shop detail route pattern to match the links being generated
Route::get('/shop/{id}', [ShopController::class, 'show'])->where('id', '[0-9]+')->name('shop.show');
// Add a compatibility route for links that might be using the /{id}/shop pattern
Route::get('/{id}/shop', [ShopController::class, 'show'])->where('id', '[0-9]+');

// Debug route - kept for future potential issues
Route::get('/debug/check-documents/{shopId}', function ($shopId) {
    if (!Auth::check() || !Auth::user()->isAdmin()) {
        return redirect('/');
    }

    \App\Models\ShopLegalDocument::checkDocumentsExist($shopId);

    return response()->json([
        'message' => 'Document check completed - see logs',
        'shop_id' => $shopId
    ]);
});

Route::get('/not-found', function () {
    return Inertia::render('NotFound');
})->name('not-found');

require __DIR__ . '/auth.php';
require __DIR__ . '/booking.php';
require __DIR__ . '/shop.php';
require __DIR__ . '/shopappointments.php';
require __DIR__ . '/admin.php';
