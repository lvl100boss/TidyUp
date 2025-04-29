<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookingController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/{shop}/booking/1', [BookingController::class, 'stepOne'])->name('booking.step.one');
    Route::post('/{shop}/booking/1', [BookingController::class, 'stepOneStore'])->name('booking.step.one.store');

    Route::get('/{shop}/booking/2', [BookingController::class, 'stepTwo'])->name('booking.step.two');
    Route::post('/{shop}/booking/2', [BookingController::class, 'stepTwoStore'])->name('booking.step.two.store');

    Route::get('/{shop}/booking/3', [BookingController::class, 'stepThree'])->name('booking.step.three');
    Route::post('/{shop}/booking/3', [BookingController::class, 'stepThreeStore'])->name('booking.step.three.store');
});
