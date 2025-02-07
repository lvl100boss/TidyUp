<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookingController;

Route::get('/booking/{shop_id}/{branch_id}', [BookingController::class, 'show'])
    ->name('booking.show')
    ->where(['shop_id' => '[0-9]+', 'branch_id' => '[0-9]+']);

Route::post('/booking/submit', [BookingController::class, 'store'])
    ->name('booking.store');
