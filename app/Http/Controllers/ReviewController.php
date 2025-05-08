<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Appointments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;

class ReviewController extends Controller
{
    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'appointment_id' => [
                    'required',
                    'exists:appointments,id',
                    Rule::unique('reviews', 'appointment_id')->where(function ($query) use ($request) {
                        return $query->where('appointment_id', $request->appointment_id);
                    })
                ],
                'user_id' => 'required|exists:users,id',
                'shop_id' => 'required|exists:shops,id',
                'service_rating' => 'required|integer|between:1,5',
                'staff_rating' => 'required|integer|between:1,5',
                'comment' => 'nullable|string|max:500',
                'image' => 'nullable|image|max:2048',
                'confirm_completion' => 'boolean',
            ]);

            // Check if review already exists
            $existingReview = Review::where('appointment_id', $validated['appointment_id'])->first();
            if ($existingReview) {
                if ($request->wantsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You have already submitted a review for this appointment.'
                    ], 422);
                }

                return redirect()->back()->with('message', 'You have already submitted a review for this appointment.')->with('success', false);
            }

            DB::beginTransaction();

            // Handle image upload if present
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                // Store in the public disk with the review-images folder
                $imagePath = $image->store('review-images', 'public');

                // Let's log the path for debugging
                \Log::info('Image uploaded for review', [
                    'original_path' => $imagePath,
                    'public_url' => Storage::disk('public')->url($imagePath)
                ]);
            }

            // Calculate the average rating from service and staff ratings
            $averageRating = round(($validated['service_rating'] + $validated['staff_rating']) / 2);

            // Create the review
            $review = new Review();
            $review->appointment_id = $validated['appointment_id'];
            $review->user_id = $validated['user_id'];

            // Handle shop_id field if it exists in database
            $hasShopIdColumn = Schema::hasColumn('reviews', 'shop_id');
            if ($hasShopIdColumn) {
                $review->shop_id = $validated['shop_id'];
            }

            // Use standard rating field that exists in database
            $review->rating = $averageRating;

            // Add service_rating and staff_rating if they exist in database
            if (Schema::hasColumn('reviews', 'service_rating')) {
                $review->service_rating = $validated['service_rating'];
            }
            if (Schema::hasColumn('reviews', 'staff_rating')) {
                $review->staff_rating = $validated['staff_rating'];
            }

            $review->comment = $validated['comment'] ?? null;

            // Ensure we store the relative path (without 'public/')
            $review->image_path = $imagePath;
            $review->save();

            // Update the appointment to mark it as reviewed
            $appointment = Appointments::find($validated['appointment_id']);
            $appointment->has_review = true;

            // If user chose to confirm completion at the same time
            if (isset($validated['confirm_completion']) && $validated['confirm_completion']) {
                $appointment->status = 'completed';
                $appointment->is_successful = true;
                $appointment->is_user_confirmed = true;
            }

            $appointment->save();

            DB::commit();

            $message = 'Thank you for your feedback!';

            // For XHR/Inertia requests
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $message
                ]);
            }

            // For regular form submissions through Inertia
            return redirect()->back()->with('message', $message)->with('success', true);
        } catch (\Exception $e) {
            DB::rollback();

            // If there was an error and we uploaded an image, clean it up
            if (isset($imagePath) && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error submitting review: ' . $e->getMessage()
                ], 500);
            }

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
            return redirect()->back()->with('message', 'Review not found')->with('success', false);
        }

        return redirect()->back()->with('review', $review);
    }
}
