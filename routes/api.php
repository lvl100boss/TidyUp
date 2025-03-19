<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\DocumentVerificationController;
Route::post('/verify/business-permit', [DocumentVerificationController::class, 'verifyBusinessPermit']);
Route::post('/verify/dti-registration', [DocumentVerificationController::class, 'verifyDtiRegistration']);
Route::post('/verify/valid-id', [DocumentVerificationController::class, 'verifyValidId']);

// Keep user info behind authentication if you have it set up later
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
