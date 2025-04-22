<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\DocumentVerificationController;
use App\Http\Controllers\FeedbackController;

Route::post('/feedback', [FeedbackController::class, 'store']); // Submit feedback
Route::get('/feedback', [FeedbackController::class, 'index']);   // Fetch all feedback
Route::patch('/feedback/{id}', [FeedbackController::class, 'update']); // Update feedback status



Route::post('/verify/business-permit', [DocumentVerificationController::class, 'verifyBusinessPermit']);
Route::post('/verify/dti-registration', [DocumentVerificationController::class, 'verifyDtiRegistration']);
Route::post('/verify/valid-id', [DocumentVerificationController::class, 'verifyValidId']);



// Keep user info behind authentication if you have it set up later
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
