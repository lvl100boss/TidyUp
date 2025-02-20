<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookingController;

Route::middleware(['auth'])->group(function () {
    Route::get('/{shop}/booking/1', [BookingController::class, 'stepOne'])->name('booking.step.one');
});
