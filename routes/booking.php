<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookingController;

Route::middleware(['auth'])->group(function () {
    Route::get('/{shop}/booking', [BookingController::class, 'index'])->name('booking.index');
    Route::get('/{shop}/booking/time-slots', [BookingController::class, 'getAvailableTimeSlots'])->name('booking.time-slots');
    Route::get('/{shop}/booking/services', [BookingController::class, 'getServices'])->name('booking.services');
    Route::post('/{shop}/booking', [BookingController::class, 'createBooking'])->name('booking.store');
});
