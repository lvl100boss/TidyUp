<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Appointments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'appointment_id' => [
                'required',
                'exists:appointments,id',
                Rule::unique('reviews', 'appointment_id')->where(function ($query) {
                    return $query->where('user_id', Auth::id());
                })
            ],
            'user_id' => 'required|exists:users,id',
            'shop_id' => 'required|exists:shops,id',
            'service_rating' => 'required|integer|between:1,5',
            'staff_rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:500',
            'confirm_completion' => 'boolean',
        ], [
            'appointment_id.unique' => 'You have already reviewed this appointment.',
            'service_rating.required' => 'Please rate the service quality.',
            'staff_rating.required' => 'Please rate the staff performance.'
        ]);

        DB::beginTransaction();
        try {
            // Create the review
            $review = Review::create([
                'appointment_id' => $validated['appointment_id'],
                'user_id' => $validated['user_id'],
                'shop_id' => $validated['shop_id'],
                'service_rating' => $validated['service_rating'],
                'staff_rating' => $validated['staff_rating'],
                'comment' => $validated['comment'] ?? null,
            ]);

            // Update the appointment to mark it as reviewed
            $appointment = Appointments::find($validated['appointment_id']);
            $appointment->has_review = true;

            // If user chose to confirm completion at the same time
            if (isset($validated['confirm_completion']) && $validated['confirm_completion']) {
                $appointment->status = 'completed';
                $appointment->is_successful = true;
            }

            $appointment->save();
            DB::commit();

            $message = 'Thank you for your feedback!';
            if (isset($validated['confirm_completion']) && $validated['confirm_completion']) {
                $message .= ' Your appointment has been marked as completed.';
            } else {
                $message .= ' Please confirm that your appointment was completed successfully.';
            }

            return redirect()->back()->with('message', $message)->with('success', true);
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('message', 'Error submitting review: ' . $e->getMessage())->with('success', false);
        }
    }

    /**
     * Get a review for a specific appointment.
     */
    public function showForAppointment($appointmentId)
    {
        $review = Review::where('appointment_id', $appointmentId)
            ->where('user_id', Auth::id())
            ->first();

        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        return response()->json($review);
    }
}
