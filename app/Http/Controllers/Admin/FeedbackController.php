<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    public function index()
    {
        // Get all feedback with user information
        $feedbacks = Feedback::with(['user' => function ($query) {
            $query->select('id', 'first_name', 'last_name', 'email', 'profile_photo_path');
        }])
            ->select('id', 'user_id', 'subject', 'category', 'message', 'status', 'priority', 'rating', 'created_at', 'responded_at', 'responded_by', 'attachments')
            ->orderBy('created_at', 'desc')
            ->get();

        // Add a formatted timestamp for easier display
        $feedbacks->each(function ($feedback) {
            $feedback->formatted_response_time = $feedback->responded_at ?
                $feedback->responded_at->format('Y-m-d H:i:s') : null;
        });

        Log::info('Admin fetching feedback', [
            'count' => $feedbacks->count(),
            'user_id' => Auth::id()
        ]);

        return response()->json($feedbacks);
    }

    public function update(Request $request, $id)
    {
        $feedback = Feedback::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,in-progress,resolved,closed',
        ]);

        Log::info('Updating feedback status', [
            'feedback_id' => $id,
            'old_status' => $feedback->status,
            'new_status' => $validated['status'],
            'user_id' => Auth::id()
        ]);

        // Use direct property assignment and save
        $feedback->status = $validated['status'];
        $feedback->save();

        return response()->json([
            'success' => true,
            'message' => 'Feedback status updated successfully',
            'feedback' => $feedback
        ]);
    }

    public function respond(Request $request, $id)
    {
        $request->headers->set('X-Requested-With', 'XMLHttpRequest');

        // Ensure user is authenticated
        if (!Auth::check()) {
            Log::error('User not authenticated when attempting to respond to feedback', [
                'feedback_id' => $id
            ]);
            return response()->json([
                'success' => false,
                'message' => 'You must be logged in to respond to feedback'
            ], 401);
        }

        $feedback = Feedback::findOrFail($id);

        // Get response data safely
        $responseText = '';
        $statusValue = '';

        // Check if request has fields in form data
        if ($request->has('response')) {
            $responseText = $request->input('response');
            if ($request->has('status')) {
                $statusValue = $request->input('status');
            }
        } else {
            // Check if request has fields in JSON body
            $jsonData = json_decode($request->getContent(), true);
            if (json_last_error() === JSON_ERROR_NONE) {
                if (isset($jsonData['response'])) {
                    $responseText = $jsonData['response'];
                }
                if (isset($jsonData['status'])) {
                    $statusValue = $jsonData['status'];
                }
            }
        }

        if (empty($responseText)) {
            return response()->json([
                'success' => false,
                'message' => 'Response text is required'
            ], 422);
        }

        // Update status if provided
        if (!empty($statusValue)) {
            $feedback->status = $statusValue;
        }

        // Store the response
        $feedback->response = $responseText;
        $feedback->responded_at = now();
        $feedback->responded_by = Auth::id();
        $feedback->save();

        // Get the responding admin's information for the notification
        $admin = Auth::user();
        $adminName = $admin->first_name . ' ' . $admin->last_name;

        // Create a record in the admin_notifications table
        $this->logAdminAction($admin->id, 'feedback_response', $feedback->id, [
            'feedback_id' => $feedback->id,
            'subject' => $feedback->subject,
            'user_id' => $feedback->user_id,
            'response_text' => substr($responseText, 0, 100) . (strlen($responseText) > 100 ? '...' : '')
        ]);

        // Send email to user if we have their information
        if ($feedback->user_id) {
            $user = User::find($feedback->user_id);
            if ($user && $user->email) {
                try {
                    // Send the email using the template approach
                    $this->sendSimpleEmail($user->email, $feedback);
                } catch (\Exception $e) {
                    Log::error('Failed to send feedback response email', [
                        'error' => $e->getMessage(),
                        'user_id' => $user->id,
                        'feedback_id' => $feedback->id
                    ]);

                    return response()->json([
                        'success' => true,
                        'warning' => 'Response saved but email failed: ' . $e->getMessage(),
                        'feedback' => $feedback,
                        'admin_info' => [
                            'name' => $adminName,
                            'timestamp' => now()->format('Y-m-d H:i:s')
                        ]
                    ]);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Response sent successfully',
            'feedback' => $feedback,
            'admin_info' => [
                'name' => $adminName,
                'timestamp' => now()->format('Y-m-d H:i:s')
            ]
        ]);
    }

    /**
     * Log admin actions for notification purposes
     */
    protected function logAdminAction($adminId, $actionType, $entityId, $details = [])
    {
        try {
            // This could insert into an admin_actions or notifications table
            // For now we'll just log it
            Log::info('Admin action logged', [
                'admin_id' => $adminId,
                'action_type' => $actionType,
                'entity_id' => $entityId,
                'details' => $details,
                'timestamp' => now()
            ]);

            // In a real implementation, you would create a notification record:
            // AdminNotification::create([
            //     'admin_id' => $adminId,
            //     'action_type' => $actionType,
            //     'entity_id' => $entityId,
            //     'details' => json_encode($details),
            //     'created_at' => now()
            // ]);
        } catch (\Exception $e) {
            Log::error('Failed to log admin action', [
                'error' => $e->getMessage(),
                'admin_id' => $adminId,
                'action_type' => $actionType
            ]);
        }
    }

    protected function sendSimpleEmail($to, $feedback)
    {
        $subject = 'Response to your feedback: ' . $feedback->subject;
        $userName = $feedback->user ? $feedback->user->first_name . ' ' . $feedback->user->last_name : 'User';

        try {
            // Prepare the data for the email template
            $data = [
                'name' => $userName,
                'subject' => $feedback->subject,
                'response' => $feedback->response,
                'created_at' => $feedback->created_at,
                'message' => $feedback->message,
                'status' => $feedback->status // Include the status in the email
            ];

            // Send formatted HTML email using the template
            Mail::send('emails.feedback-response', $data, function ($message) use ($to, $subject) {
                $message->to($to)
                    ->subject($subject)
                    ->from(config('mail.from.address'), config('mail.from.name'));
            });

            // Check for failures
            if (Mail::failures()) {
                $failures = Mail::failures();
                Log::error('Mail failures encountered', ['failures' => $failures]);

                // Fallback to plain text if HTML email fails
                Log::info('Attempting fallback to plain text email');
                $this->sendFallbackPlainTextEmail($to, $feedback);
            }

            Log::info('Email sent successfully to: ' . $to);
            return true;
        } catch (\Exception $e) {
            Log::error('Exception while sending HTML email', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Try plain text email as a fallback
            try {
                Log::info('Attempting fallback to plain text email after exception');
                $this->sendFallbackPlainTextEmail($to, $feedback);
                return true;
            } catch (\Exception $innerException) {
                Log::error('Fallback email also failed', [
                    'exception' => $innerException->getMessage()
                ]);
                throw $e; // Re-throw the original exception
            }
        }
    }

    /**
     * Send a plain text email as a fallback
     */
    protected function sendFallbackPlainTextEmail($to, $feedback)
    {
        $subject = 'Response to your feedback: ' . $feedback->subject;
        $userName = $feedback->user ? $feedback->user->first_name . ' ' . $feedback->user->last_name : 'User';

        // Create a more descriptive status message
        $statusInfo = "";
        if ($feedback->status) {
            $statusInfo = "Current Status: " . ucfirst($feedback->status) . "\n";

            // Add descriptive text based on status
            switch (strtolower($feedback->status)) {
                case 'pending':
                    $statusInfo .= "Your feedback has been received and is waiting to be reviewed by our team.";
                    break;
                case 'in-progress':
                    $statusInfo .= "Our team is currently working on addressing your feedback.";
                    break;
                case 'resolved':
                    $statusInfo .= "We've completed our work on this feedback item. We hope our solution meets your needs.";
                    break;
                case 'closed':
                    $statusInfo .= "This feedback item has been closed. If you're not satisfied, please submit a new feedback.";
                    break;
            }
            $statusInfo .= "\n\n";
        }

        $emailContent = "Hello {$userName},\n\n";
        $emailContent .= "Thank you for your feedback submitted on {$feedback->created_at->format('F j, Y')} ";
        $emailContent .= "regarding \"{$feedback->subject}\".\n\n";
        $emailContent .= "Your Message:\n{$feedback->message}\n\n";
        $emailContent .= "Our Response:\n{$feedback->response}\n\n";
        $emailContent .= $statusInfo;
        $emailContent .= "If you have any further questions or feedback, please don't hesitate to reach out to us.\n\n";
        $emailContent .= "Best regards,\nThe TidyUp Team";

        Mail::raw($emailContent, function ($message) use ($to, $subject) {
            $message->to($to)
                ->subject($subject)
                ->from(config('mail.from.address'), config('mail.from.name'));
        });
    }

    public function show()
    {
        return Inertia::render('Admin/UserFeedback');
    }
}
