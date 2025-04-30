<?php

namespace App\Http\Controllers;

use App\Models\Appointments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ViewAppointmentController extends Controller
{
    //
    public function index($id)
    {

        $appointment = Appointments::findOrFail($id);

        if ($appointment->user_id !== Auth::id()) {
            return redirect()->back();
        }

        $appointment->load(['shop.shopGallery', 'staff.staff', 'appointmentServices.shopService', 'review']);
        return Inertia::render(
            'Users/ViewAppointment',
            [
                'appointmentId' => $appointment->id,
                'appointment' => $appointment,
                'shop' => $appointment->shop,
                'shopGallery' => $appointment->shop->shopGallery,
                // 'userAppointments' => $appointment->userAppointments,
                'staff' => $appointment->staff,
                'appointmentServices' => $appointment->appointmentServices,
                'review' => $appointment->review,
                'status' => $appointment->status,
            ]
        );
    }
}
