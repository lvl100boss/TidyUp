<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        // Add additional debug logging to help troubleshoot route issues
        Log::info('Feedback submission endpoint reached', [
            'route' => $request->path(),
            'method' => $request->method()
        ]);

        // Log the full request data for debugging
        Log::info('Feedback submission request', [
            'data' => $request->all(),
            'has_files' => $request->hasFile('attachments'),
            'content_type' => $request->header('Content-Type'),
            'user_id' => auth()->id()
        ]);

        // Validate the request
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|in:feature,bug,improvement,other',
            'priority' => 'required|in:High,Medium,Low',
            'rating' => 'required|integer|min:1|max:5',
            'message' => 'required|string|min:5',
            'attachments' => 'nullable|array',
            'attachments.*' => 'nullable|file|mimes:jpg,jpeg,png,gif|max:5120', // Only allow image files
        ]);

        try {
            // Handle file uploads if present
            $attachments = [];
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('feedback', 'public');
                    $attachments[] = $path;
                }
            }

            // Create the feedback record with user_id
            $feedback = Feedback::create([
                'subject' => $validated['subject'],
                'category' => $validated['category'],
                'priority' => $validated['priority'],
                'rating' => $validated['rating'] ?? 0,
                'message' => $validated['message'],
                'status' => 'pending',
                'attachments' => !empty($attachments) ? json_encode($attachments) : null,
                'user_id' => auth()->id() // Add the user ID from the authenticated user
            ]);

            // Check if this is an Inertia request
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Feedback submitted successfully!',
                    'feedback' => $feedback,
                ], 200);
            }

            // For Inertia, return a redirect with a flash message
            return redirect()->back()
                ->with('success', 'Feedback submitted successfully!');
        } catch (\Exception $e) {
            Log::error('Feedback submission error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to submit feedback',
                    'error' => $e->getMessage()
                ], 500);
            }

            return redirect()->back()
                ->withErrors(['message' => 'Failed to submit feedback: ' . $e->getMessage()]);
        }
    }

    // Fetch all feedback
    public function index()
    {
        $feedback = Feedback::all();
        return response()->json($feedback);
    }

    // Update feedback status
    public function update(Request $request, $id)
    {
        $feedback = Feedback::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,in-progress,resolved,closed',
        ]);

        $feedback->update($validated);

        return response()->json(['message' => 'Feedback updated successfully!', 'feedback' => $feedback]);
    }
}
