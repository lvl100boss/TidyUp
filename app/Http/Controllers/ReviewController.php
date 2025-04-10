<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Appointments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

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
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:500',
        ], [
            'appointment_id.unique' => 'You have already reviewed this appointment.'
        ]);

        // Add the authenticated user's ID
        $validated['user_id'] = Auth::id();

        // Create the review
        $review = Review::create($validated);

        // Update the appointment to mark it as reviewed
        $appointment = Appointments::find($validated['appointment_id']);
        $appointment->has_review = true;
        $appointment->save();

        return redirect()->back()->with('message', 'Thank you for your feedback!')->with('success', true);
    }
}
