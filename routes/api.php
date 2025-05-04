<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\DocumentVerificationController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BookingController;

Route::post('/feedback', [FeedbackController::class, 'store']); // Submit feedback
Route::get('/feedback', [FeedbackController::class, 'index']);   // Fetch all feedback
Route::patch('/feedback/{id}', [FeedbackController::class, 'update']); // Update feedback status

Route::post('/verify/business-permit', [DocumentVerificationController::class, 'verifyBusinessPermit']);
Route::post('/verify/dti-registration', [DocumentVerificationController::class, 'verifyDtiRegistration']);
Route::post('/verify/valid-id', [DocumentVerificationController::class, 'verifyValidId']);

// Appointment status updates
Route::middleware(['auth'])->group(function () {
    Route::get('/appointments/status', [AppointmentController::class, 'getStatusUpdates']);
    Route::get('/available-time-slots', [BookingController::class, 'getAvailableTimes']);
    Route::post('/check-time-slot', [BookingController::class, 'checkTimeSlotAvailability']);
});

// Route for getting updated appointment statuses
Route::middleware('auth:sanctum')->get('/appointments/status', function (Request $request) {
    $user = $request->user();

    $pendingAppointments = $user->appointments()->with(['shop', 'staff', 'appointmentServices.shopService', 'review'])
        ->where('status', 'pending')
        ->latest()
        ->get();

    $upcomingAppointments = $user->appointments()->with(['shop', 'staff', 'appointmentServices.shopService', 'review'])
        ->where('status', 'upcoming')
        ->latest()
        ->get();

    $completedAppointments = $user->appointments()->with(['shop', 'staff', 'appointmentServices.shopService', 'review'])
        ->where('status', 'completed')
        ->latest()
        ->get();

    $startedAppointments = $user->appointments()->with(['shop', 'staff', 'appointmentServices.shopService', 'review'])
        ->where('status', 'started')
        ->latest()
        ->get();

    $cancelledAppointments = $user->appointments()->with(['shop', 'staff', 'appointmentServices.shopService', 'review'])
        ->where('status', 'cancelled')
        ->latest()
        ->get();

    $noShowAppointments = $user->appointments()->with(['shop', 'staff', 'appointmentServices.shopService', 'review'])
        ->where('status', 'no-show')
        ->latest()
        ->get();

    $declinedAppointments = $user->appointments()->with(['shop', 'staff', 'appointmentServices.shopService', 'review'])
        ->where('status', 'declined')
        ->latest()
        ->get();

    return response()->json([
        'pending' => $pendingAppointments,
        'upcoming' => $upcomingAppointments,
        'completed' => $completedAppointments,
        'started' => $startedAppointments,
        'cancelled' => $cancelledAppointments,
        'no-show' => $noShowAppointments,
        'declined' => $declinedAppointments,
    ]);
});

// Keep user info behind authentication if you have it set up later
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
