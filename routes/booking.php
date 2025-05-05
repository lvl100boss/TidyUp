<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookingController;

// Guest preview routes (no authentication required)
Route::get('/{shop}/preview/booking/1', [BookingController::class, 'previewStepOne'])->name('booking.preview.step.one');
Route::post('/{shop}/preview/booking/1', [BookingController::class, 'previewStepOneStore'])->name('booking.preview.step.one.store');

Route::get('/{shop}/preview/booking/2', [BookingController::class, 'previewStepTwo'])->name('booking.preview.step.two');
Route::post('/{shop}/preview/booking/2', [BookingController::class, 'previewStepTwoStore'])->name('booking.preview.step.two.store');

Route::get('/{shop}/preview/booking/3', [BookingController::class, 'previewStepThree'])->name('booking.preview.step.three');

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    Route::get('/{shop}/booking/1', [BookingController::class, 'stepOne'])->name('booking.step.one');
    Route::post('/{shop}/booking/1', [BookingController::class, 'stepOneStore'])->name('booking.step.one.store');

    Route::get('/{shop}/booking/2', [BookingController::class, 'stepTwo'])->name('booking.step.two');
    Route::post('/{shop}/booking/2', [BookingController::class, 'stepTwoStore'])->name('booking.step.two.store');

    // Add Attendees (now step 3)
    Route::get('/{shop}/booking/3', [BookingController::class, 'stepThree'])->name('booking.step.three');
    Route::post('/{shop}/booking/3', [BookingController::class, 'stepThreeStore'])->name('booking.step.three.store');


    // Assign Services to Attendees (new step 4)
    Route::get('/{shop}/booking/4', [BookingController::class, 'stepFour'])->name('booking.step.four');
    Route::post('/{shop}/booking/4', [BookingController::class, 'stepFourStore'])->name('booking.step.four.store');

    // Confirmation (now step 5)
    Route::get('/{shop}/booking/5', [BookingController::class, 'stepFive'])->name('booking.step.five');
    Route::post('/{shop}/booking/5', [BookingController::class, 'stepFiveStore'])->name('booking.step.five.store');
});

