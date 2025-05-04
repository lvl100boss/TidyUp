<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookingController;

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
