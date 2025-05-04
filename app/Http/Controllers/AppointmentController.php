<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Appointments;
use App\Models\User;
use App\Models\AppointmentReview;
use App\Notifications\RescheduleRequestedNotification;

class AppointmentController extends Controller
{
    //
    public function index()
    {
        $user = Auth::user();
        $userAppointments = User::with(['appointments.shop.shopGallery', 'appointments.userAppointments.staff.staff', 'appointments.appointmentServices.shopService', 'appointments.review'])->find($user->id);
        $statuses = ['pending', 'upcoming', 'completed', 'cancelled', 'no-show', 'declined', 'started'];
        $appointmentsByStatus = [];

        foreach ($statuses as $status) {
            $variableName = $status . 'Appointments';
            if ($status === 'no-show') {
                $variableName = 'noShowAppointments';
            }

            $appointmentsByStatus[$variableName] = $userAppointments->appointments
                ->where('status', $status)
                ->where('is_successful', true)
                ->where('resched_data', null)
                ->values()
                ->all();
        }

        extract($appointmentsByStatus);
        $requestRescheduleAppointments = $userAppointments->appointments->where('status', 'pending')->where('is_successful', true)->where('resched_data', '!=', null)->values()->all();

        return inertia('Users/Appointments', [
            'pendingAppointments' => $pendingAppointments,
            'upcomingAppointments' => $upcomingAppointments,
            'completedAppointments' => $completedAppointments,
            'cancelledAppointments' => $cancelledAppointments,
            'noShowAppointments' => $noShowAppointments,
            'declinedAppointments' => $declinedAppointments,
            'startedAppointments' => $startedAppointments,
            'requestRescheduleAppointments' => $requestRescheduleAppointments,
        ]);
    }

    public function declineAppointment(Request $request)
    {
        $appointment = Appointments::find($request->appointment_id);

        DB::beginTransaction();
        try {
            $appointment->status = 'declined';
            $appointment->resched_data = null;
            $appointment->save();
            DB::commit();
            return redirect()->back()->with('message', 'Appointment declined successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'An error occurred while declining appointment');
        }
    }

    public function acceptAppointment(Request $request)
    {
        $appointment = Appointments::find($request->appointment_id);

        DB::beginTransaction();
        try {
            $appointment->status = 'upcoming';
            $appointment->resched_data = null;
            $appointment->save();
            DB::commit();
            return redirect()->back()->with('message', 'Appointment accepted successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('error', 'An error occurred while accepting appointment');
        }
    }

    /**
     * User confirms that the appointment was completed successfully
     */
    public function confirmCompletion(Request $request)
    {
        try {
            $appointment = Appointments::findOrFail($request->appointment_id);
            
            // Check if user is authorized to mark this appointment as completed
            if ($appointment->user_id !== Auth::id()) {
                return back()->withErrors(['message' => 'You are not authorized to mark this appointment as completed.']);
            }
            
            // Check if appointment is in a valid state to be marked completed
            if (!in_array($appointment->status, ['started', 'upcoming'])) {
                return back()->withErrors(['message' => 'Only started or upcoming appointments can be marked as completed.']);
            }
            
            DB::beginTransaction();
            
            // Update the appointment status
            $appointment->update([
                'status' => 'completed',
                'user_confirmed' => true
            ]);
            
            DB::commit();
            
            return redirect()->back()
                ->with('message', 'Appointment has been confirmed as completed. You may now leave a review.')
                ->with('success', true);
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Confirm Completion Error: " . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);
            return back()->withErrors(['message' => 'An error occurred while confirming completion. Please try again.']);
        }
    }

    public function review(Request $request)
    {
        try {
            // Validate the input first
            $validated = $request->validate([
                'appointment_id' => 'required|exists:appointments,id',
                'service_rating' => 'required|integer|min:1|max:5',
                'staff_rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:1000',
                'confirm_completion' => 'nullable|boolean'
            ]);
            
            $appointment = Appointments::findOrFail($request->appointment_id);
            
            // Validate the appointment is eligible for review
            if (!in_array($appointment->status, ['completed', 'started'])) {
                return back()->withErrors(['message' => 'You can only review completed or started appointments.']);
            }
            
            // Check if user is authorized to review this appointment
            if ($appointment->user_id !== Auth::id()) {
                return back()->withErrors(['message' => 'You are not authorized to review this appointment.']);
            }
            
            DB::beginTransaction();
            
            // Check if review already exists
            $existingReview = AppointmentReview::where('appointment_id', $appointment->id)
                ->where('user_id', Auth::id())
                ->first();
                
            if ($existingReview) {
                // Update existing review
                $existingReview->update([
                    'service_rating' => $request->service_rating,
                    'staff_rating' => $request->staff_rating,
                    'comment' => $request->comment ?? '',
                ]);
                
                $message = 'Your review has been updated.';
            } else {
                // Create new review
                AppointmentReview::create([
                    'appointment_id' => $appointment->id,
                    'user_id' => Auth::id(),
                    'shop_id' => $appointment->shop_id,
                    'service_rating' => $request->service_rating,
                    'staff_rating' => $request->staff_rating,
                    'comment' => $request->comment ?? '',
                ]);
                
                // Mark the appointment as having a review
                $appointment->update([
                    'has_review' => true
                ]);
                
                $message = 'Your review has been submitted. Thank you for your feedback!';
            }
            
            // If user checked "confirm completion" and status is "started"
            if ($request->confirm_completion && $appointment->status === 'started') {
                $appointment->update([
                    'status' => 'completed',
                    'user_confirmed' => true
                ]);
                $message .= ' Appointment has been marked as completed.';
            }
            
            DB::commit();
            
            return redirect()->back()->with('message', $message)->with('success', true);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Review Submission Error: " . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);
            return back()->withErrors(['message' => 'An error occurred while submitting your review. Please try again.']);
        }
    }

    /**
     * Add API endpoint for real-time appointment status updates
     */
    public function getStatusUpdates()
    {
        try {
            $user = Auth::user();
            $statuses = ['pending', 'upcoming', 'completed', 'cancelled', 'no-show', 'declined', 'started'];
            $appointmentsByStatus = [];

            foreach ($statuses as $status) {
                $variableName = $status;
                if ($status === 'no-show') {
                    $variableName = 'noShow';
                }

                $appointmentsByStatus[$variableName . 'Appointments'] = $user->appointments()
                    ->with([
                        'shop.shopGallery', 
                        'staff.staff',  // Direct path to staff relationship
                        'userAppointments.staff.staff', 
                        'appointmentServices.shopService.serviceCategories', 
                        'appointmentServices.attendee', // Make sure attendees are properly loaded
                        'appointmentServices.staff.staff', // Load staff directly from appointment services
                        'review'
                    ])
                    ->where('status', $status)
                    ->where('is_successful', true)
                    ->where('resched_data', null)
                    ->orderBy('date', 'desc')
                    ->orderBy('time', 'desc')
                    ->get();
            }
            
            $requestRescheduleAppointments = $user->appointments()
                ->with([
                    'shop.shopGallery', 
                    'userAppointments.staff.staff', 
                    'appointmentServices.shopService.serviceCategories', 
                    'appointmentServices.attendee', 
                    'review'
                ])
                ->where('status', 'pending')
                ->where('is_successful', true)
                ->where('resched_data', '!=', null)
                ->orderBy('date', 'desc')
                ->orderBy('time', 'desc')
                ->get();
                
            $appointmentsByStatus['requestRescheduleAppointments'] = $requestRescheduleAppointments;
            
            return response()->json($appointmentsByStatus);
            
        } catch (\Exception $e) {
            Log::error("Get Status Updates Error: " . $e->getMessage(), [
                'exception' => $e
            ]);
            return response()->json(['error' => 'Failed to fetch appointment updates'], 500);
        }
    }
    
    /**
     * Show a single appointment
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            $appointment = $user->appointments()
                ->with([
                    'shop.shopGallery', 
                    'staff.staff',  // Direct staff relationship
                    'userAppointments.staff.staff',
                    'appointmentServices.shopService.serviceCategories', 
                    'appointmentServices.attendee',
                    'appointmentServices.staff.staff', // Staff from appointment services
                    'review',
                    'attendees'
                ])
                ->findOrFail($id);
                
            return inertia('Users/AppointmentDetail', [
                'appointment' => $appointment
            ]);
            
        } catch (\Exception $e) {
            Log::error("Show Appointment Error: " . $e->getMessage(), [
                'exception' => $e,
                'appointment_id' => $id
            ]);
            return redirect()->route('appointments')->with('message', 'Appointment not found')->with('success', false);
        }
    }
    
    /**
     * Cancel an appointment
     */
    public function cancelAppointment(Request $request)
    {
        try {
            $validated = $request->validate([
                'appointment_id' => 'required|exists:appointments,id',
                'cancel_reason' => 'nullable|string|max:500'
            ]);
            
            $appointment = Appointments::findOrFail($request->appointment_id);
            
            // Check if user is authorized to cancel this appointment
            if ($appointment->user_id !== Auth::id()) {
                return back()->withErrors(['message' => 'You are not authorized to cancel this appointment.']);
            }
            
            // Check if appointment is in a state that allows cancellation
            if (!in_array($appointment->status, ['pending', 'upcoming'])) {
                return back()->withErrors(['message' => 'This appointment cannot be cancelled.']);
            }
            
            DB::beginTransaction();
            
            $appointment->status = 'cancelled';
            $appointment->cancel_reason = $request->cancel_reason;
            $appointment->save();
            
            // Notify related staff about cancellation
            // Add notification code here if needed
            
            DB::commit();
            
            return redirect()->back()
                ->with('message', 'Appointment has been cancelled successfully.')
                ->with('success', true);
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Cancel Appointment Error: " . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);
            return back()->withErrors(['message' => 'An error occurred while cancelling the appointment. Please try again.']);
        }
    }
    
    /**
     * Request appointment reschedule
     */
    public function requestReschedule(Request $request)
    {
        try {
            $validated = $request->validate([
                'appointment_id' => 'required|exists:appointments,id',
                'date' => 'required|date|after:today',
                'time' => 'required|string',
                'reason' => 'nullable|string|max:500'
            ]);
            
            $appointment = Appointments::with('shop.shopStaff.staff')
                ->findOrFail($request->appointment_id);
            
            // Check if user is authorized to reschedule this appointment
            if ($appointment->user_id !== Auth::id()) {
                return back()->withErrors(['message' => 'You are not authorized to reschedule this appointment.']);
            }
            
            // Check if appointment is in a state that allows rescheduling
            if (!in_array($appointment->status, ['pending', 'upcoming'])) {
                return back()->withErrors(['message' => 'This appointment cannot be rescheduled.']);
            }
            
            DB::beginTransaction();
            
            // Save the old appointment data
            $oldData = [
                'date' => $appointment->date,
                'time' => $appointment->time,
                'status' => $appointment->status
            ];
            
            // Save the requested reschedule data
            $reschedData = [
                'date' => $request->date,
                'time' => $request->time,
                'reason' => $request->reason
            ];
            
            $appointment->old_data = $oldData;
            $appointment->resched_data = $reschedData;
            $appointment->status = 'pending'; // Reset to pending for reschedule request
            $appointment->resched_reason = $request->reason;
            $appointment->save();
            
            // Notify shop staff about reschedule request
            if ($appointment->shop && $appointment->staff) {
                $staff = $appointment->staff->staff;
                if ($staff) {
                    $staff->notify(new RescheduleRequestedNotification($appointment));
                }
            }
            
            DB::commit();
            
            return redirect()->back()
                ->with('message', 'Reschedule request submitted successfully. You will be notified once approved.')
                ->with('success', true);
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Request Reschedule Error: " . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);
            return back()->withErrors(['message' => 'An error occurred while requesting reschedule. Please try again.']);
        }
    }
    
    /**
     * Get available time slots for rescheduling
     */
    public function getAvailableTimeSlots(Request $request)
    {
        try {
            $validated = $request->validate([
                'shop_id' => 'required|exists:shops,id',
                'date' => 'required|date|after_or_equal:today',
                'staff_id' => 'required|exists:shop_staffs,id',
            ]);
            
            // Get the shop's operating hours for the selected date
            $day = strtolower(date('l', strtotime($request->date)));
            
            $shopOperatingHours = DB::table('shop_operation_hours')
                ->where('shop_id', $request->shop_id)
                ->where('day', $day)
                ->where('is_open', 1)
                ->first();
                
            if (!$shopOperatingHours) {
                return response()->json([
                    'message' => 'Shop is closed on this day',
                    'available_slots' => []
                ]);
            }
            
            // Get existing appointments for this staff on this date
            $existingAppointments = Appointments::where('staff_id', $request->staff_id)
                ->where('date', $request->date)
                ->whereIn('status', ['pending', 'upcoming', 'started'])
                ->get();
                
            // Calculate available time slots based on shop hours and existing appointments
            // This would involve a more complex algorithm that considers service durations
            // For simplicity, here's a basic implementation:
            $openTime = strtotime($shopOperatingHours->open_time);
            $closeTime = strtotime($shopOperatingHours->close_time);
            
            $timeSlots = [];
            $currentTime = $openTime;
            
            // Generate time slots in 30-minute increments
            while ($currentTime < $closeTime) {
                $formattedTime = date('H:i:s', $currentTime);
                $isAvailable = true;
                
                // Check if this time slot conflicts with existing appointments
                foreach ($existingAppointments as $appointment) {
                    $appointmentStart = strtotime($appointment->time);
                    $appointmentServices = $appointment->appointmentServices()
                        ->where('staff_id', $request->staff_id)
                        ->get();
                        
                    $duration = 0;
                    foreach ($appointmentServices as $service) {
                        if ($service->shopService) {
                            $duration += ($service->shopService->duration_hour * 60) + $service->shopService->duration_minute;
                        }
                    }
                    
                    // Add buffer time
                    $duration += 15; // 15-minute buffer
                    
                    $appointmentEnd = $appointmentStart + ($duration * 60);
                    
                    // If this time slot is within an existing appointment, mark as unavailable
                    if (($currentTime >= $appointmentStart && $currentTime < $appointmentEnd) || 
                        ($currentTime + 1800 > $appointmentStart && $currentTime < $appointmentEnd)) {
                        $isAvailable = false;
                        break;
                    }
                }
                
                if ($isAvailable) {
                    $timeSlots[] = $formattedTime;
                }
                
                $currentTime += 1800; // 30 minutes in seconds
            }
            
            return response()->json([
                'available_slots' => $timeSlots
            ]);
            
        } catch (\Exception $e) {
            Log::error("Get Available Time Slots Error: " . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);
            return response()->json(['error' => 'Failed to get available time slots'], 500);
        }
    }
}
