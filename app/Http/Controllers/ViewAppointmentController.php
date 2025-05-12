<?php

namespace App\Http\Controllers;

use App\Models\Appointments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ViewAppointmentController extends Controller
{
    public function index($id)
    {
        $appointment = Appointments::findOrFail($id);

        if ($appointment->user_id !== Auth::id()) {
            return redirect()->back();
        }

        $appointment->load(['shop.shopGallery', 'staff.staff', 'appointmentServices.shopService', 'review']);

        // Format the review image path if it exists
        if ($appointment->review && $appointment->review->image_path) {
            // Ensure we're using the correct path format for the image
            // Check if the path already has storage/ prefix
            if (strpos($appointment->review->image_path, 'storage/') === 0) {
                $appointment->review->image_url = '/' . $appointment->review->image_path;
            } else {
                // When using the 'public' disk, properly format the URL
                $appointment->review->image_url = '/storage/' . $appointment->review->image_path;
            }

            // Log for debugging
            \Log::info('Review image path processed', [
                'original_path' => $appointment->review->image_path,
                'image_url' => $appointment->review->image_url
            ]);
        }

        return Inertia::render(
            'Users/ViewAppointment',
            [
                'appointmentId' => $appointment->id,
                'appointment' => $appointment,
                'shop' => $appointment->shop,
                'shopGallery' => $appointment->shop->shopGallery,
                'staff' => $appointment->staff,
                'appointmentServices' => $appointment->appointmentServices,
                'review' => $appointment->review,
                'status' => $appointment->status,
            ]
        );
    }
}
