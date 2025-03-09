<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopAppointmentsController;

Route::get('/shop/appointments', [ShopAppointmentsController::class, 'index'])->name('shop.appointments');
Route::patch('/shop/appointments/approve/{appointment}', [ShopAppointmentsController::class, 'approve'])->name('shop.appointments.approve');
Route::patch('/shop/appointments/reject/{appointment}', [ShopAppointmentsController::class, 'reject'])->name('shop.appointments.reject');
Route::patch('/shop/appointments/cancel/{appointment}', [ShopAppointmentsController::class, 'cancel'])->name('shop.appointments.cancel');
Route::patch('/shop/appointments/reschedule/{appointment}', [ShopAppointmentsController::class, 'reschedule'])->name('shop.appointments.reschedule');
Route::patch('/shop/appointments/complete/{appointment}', [ShopAppointmentsController::class, 'complete'])->name('shop.appointments.complete');
Route::patch('/shop/appointments/no-show/{appointment}', [ShopAppointmentsController::class, 'noShow'])->name('shop.appointments.no-show');
Route::patch('/shop/appointments/started/{appointment}', [ShopAppointmentsController::class, 'started'])->name('shop.appointments.started');
Route::patch('/shop/appointments/undo/{appointment}', [ShopAppointmentsController::class, 'undo'])->name('shop.appointments.undo');
