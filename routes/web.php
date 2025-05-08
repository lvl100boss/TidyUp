<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BarbershopShopsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DiscoverController;
use App\Http\Controllers\HairSalonShopsController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ShopResubmissionController;
use App\Http\Controllers\PopularShopsController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\NewsletterSubscriptionController;
use App\Http\Controllers\ShopAnalyticsController; // Make sure this is imported
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\SetupShopController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ViewAppointmentController;
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
    Route::post('/newsletter', [NewsletterSubscriptionController::class, 'store'])->name('newsletter.subscribe');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profile/password', [ProfileController::class, 'passwordEdit'])->name('profile.password.edit');
    Route::get('/theme', function () {
        return Inertia::render('Theme/Theme');
    })->name('theme');

    Route::get('/appointments', [AppointmentController::class, 'index'])->name('appointments');
    Route::patch('/appointments/decline', [AppointmentController::class, 'declineAppointment'])->name('appointments.decline');
    Route::patch('/appointments/accept', [AppointmentController::class, 'acceptAppointment'])->name('appointments.accept');
    Route::patch('/appointments/cancel', [AppointmentController::class, 'cancelAppointment'])->name('appointments.cancel');

    Route::get('/appointments/{id}', [ViewAppointmentController::class, 'index'])->name('appointment.view');

    Route::get('/send-feedback', function () {
        return Inertia::render('Users/SendFeedback');
    })->name('SendFeedback');
    Route::post('/user/feedback', [FeedbackController::class, 'store'])->name('user.feedback.store');
    Route::get('/report-issue', function () {
        return Inertia::render('Users/ReportAnIssue');
    })->name('ReportAnIssue');

    // Add a route for SetupShop with middleware
    Route::middleware(['auth', 'verified', 'shop.creation'])->group(function () {
        Route::get('/shop/setup', [ShopController::class, 'create'])->name('shop.setup');
        Route::post('/shop/setup', [ShopController::class, 'store'])->name('shop.store');
    });

    // Add the thank you page route
    Route::get('/{shop}/booking/thank-you/{appointment}', [BookingController::class, 'thankYou'])->name('booking.thank-you');

    // Review and appointment confirmation routes
    Route::post('/appointments/review', [ReviewController::class, 'store'])->name('appointments.review');
    Route::get('/appointments/{appointmentId}/review', [ReviewController::class, 'showForAppointment'])->name('appointments.show-review');
    Route::post('/appointments/confirm-completion', [AppointmentController::class, 'confirmCompletion'])->name('appointments.confirm-completion');
});

// Fix the shop detail route pattern to match the links being generated
Route::get('/shop/{id}', [ShopController::class, 'show'])->where('id', '[0-9]+')->name('shop.show');
// Add a compatibility route for links that might be using the /{id}/shop pattern
Route::get('/{id}/shop', [ShopController::class, 'show'])->where('id', '[0-9]+');

// Remove duplicate route
// Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');

// User appointment routes
Route::post('/appointments/confirm-completion', [AppointmentController::class, 'confirmCompletion'])->name('appointments.confirm-completion');
Route::get('/shop/setup', [ShopController::class, 'create'])->name('shop.setup');
Route::post('/shop/setup', [ShopController::class, 'store'])->name('shop.store');

// Admin routes
Route::prefix('admin')->name('admin.')->middleware(['auth', 'web'])->group(function () {
    // Admin dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // Feedback management routes
    Route::get('/user-feedback', [App\Http\Controllers\Admin\FeedbackController::class, 'show'])->name('user-feedback');
    Route::get('/feedbacks', [App\Http\Controllers\Admin\FeedbackController::class, 'index'])->name('feedbacks.index');
    Route::put('/feedbacks/{id}', [App\Http\Controllers\Admin\FeedbackController::class, 'update'])
        ->withoutMiddleware(['csrf'])->name('feedbacks.update');
    Route::post('/feedbacks/{id}/respond', [App\Http\Controllers\Admin\FeedbackController::class, 'respond'])
        ->withoutMiddleware(['csrf'])->name('feedbacks.respond');

    // Other admin routes...
});

// // Add a diagnostic route to check authentication
// Route::get('/check-auth', function () {
//     return response()->json([
//         'authenticated' => auth()->check(),
//         'user' => auth()->check() ? auth()->user() : null,
//         'session_id' => session()->getId(),
//         'csrf_token' => csrf_token()
//     ]);
// })->middleware(['web']);

require __DIR__ . '/auth.php';
require __DIR__ . '/booking.php';
require __DIR__ . '/shop.php';
require __DIR__ . '/shopappointments.php';
require __DIR__ . '/admin.php';
