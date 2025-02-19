<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AppointmentController extends Controller
{
    //
    public function index()
    {
        $user = Auth::user();
        $userAppointments = User::with('appointments.shop.shopGallery')->find($user->id);

        // Convert collections to arrays
        $pendingAppointments = $userAppointments->appointments->where('status', 'pending')->where('is_successful', true)->values()->all();
        $upcomingAppointments = $userAppointments->appointments->where('status', 'upcoming')->where('is_successful', true)->values()->all();
        $completedAppointments = $userAppointments->appointments->where('status', 'completed')->where('is_successful', true)->values()->all();
        $cancelledAppointments = $userAppointments->appointments->where('status', 'cancelled')->where('is_successful', true)->values()->all();
        $noShowAppointments = $userAppointments->appointments->where('status', 'no-show')->where('is_successful', true)->values()->all();
        $declinedAppointments = $userAppointments->appointments->where('status', 'declined')->where('is_successful', true)->values()->all();
        $startedAppointments = $userAppointments->appointments->where('status', 'started')->where('is_successful', true)->values()->all();

        return inertia('Users/Appointments', [
            'pendingAppointments' => $pendingAppointments,
            'upcomingAppointments' => $upcomingAppointments,
            'completedAppointments' => $completedAppointments,
            'cancelledAppointments' => $cancelledAppointments,
            'noShowAppointments' => $noShowAppointments,
            'declinedAppointments' => $declinedAppointments,
            'startedAppointments' => $startedAppointments,
        ]);
    }
}
