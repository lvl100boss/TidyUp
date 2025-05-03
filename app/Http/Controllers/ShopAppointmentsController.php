<?php

namespace App\Http\Controllers;

use App\Models\Appointments;
use App\Models\ShopStaffs;
use App\Services\ShopAppointmentService;
use App\Notifications\AppointmentAcceptedNotification;
use App\Notifications\AppointmentCompletedNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShopAppointmentsController extends Controller
{
    protected $appointmentService;

    // All the logic for fetching appointments data will be handled by the ShopAppointmentService
    public function __construct(ShopAppointmentService $appointmentService)
    {
        $this->appointmentService = $appointmentService;
    }
    public function index()
    {
        $myAppointments = $this->appointmentService->getAppointmentsData(Auth::id());
        return Inertia::render('Shops/Appointments', [
            'staffData' => $myAppointments['currentStaff'],
            'myAppointments' => $myAppointments['appointments'],
            'upcomingSchedules' => $myAppointments['upcomingSchedules'],
            'shopBusinessSchedules' => $myAppointments['shopBusinessSchedules'],
            'shopAppointments' => $myAppointments['shopAppointments'],
            'rescheduleRequests' => $myAppointments['rescheduleRequests']
        ]);
    }

    public function approve(Request $request, $appointment)
    {
        // Eager load the 'user' relationship for notification
        $targetAppointment = Appointments::with('user')->find($appointment);

        if (!$targetAppointment) {
            return redirect()->back()->with('message', 'Appointment not found')->with('success', false);
        }

        $currentStaff = ShopStaffs::where('staff_id', Auth::id())->first();

        DB::beginTransaction();
        try {
            $targetAppointment->status = 'upcoming';
            $targetAppointment->approved_by = $currentStaff->id;
            $targetAppointment->save();
            $user = $targetAppointment->user;
            if ($user) {
                $user->notify(new AppointmentAcceptedNotification($targetAppointment));
            }
            DB::commit();
            return redirect()->back()->with('message', 'Appointment approved successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('message', 'Failed to approve appointment')->with('success', false);
        }
    }

    public function reject(Request $request, $appointment)
    {
        $validated = $request->validate([
            'reason' => 'required|string'
        ]);

        $targetAppointment = Appointments::find($appointment);
        DB::beginTransaction();
        try {
            $targetAppointment->status = 'declined';
            $targetAppointment->decline_reason = $validated['reason'];
            $targetAppointment->save();
            DB::commit();
            return redirect()->back()->with('message', 'Appointment rejected successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('message', 'Failed to reject appointment')->with('success', false);
        }
    }

    public function cancel(Request $request, $appointment)
    {
        $validated = $request->validate([
            'reason' => 'required|string'
        ]);

        $targetAppointment = Appointments::find($appointment);
        DB::beginTransaction();
        try {
            $targetAppointment->status = 'cancelled';
            $targetAppointment->cancel_reason = $validated['reason'];
            $targetAppointment->save();
            DB::commit();
            return redirect()->back()->with('message', 'Appointment cancelled successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('message', 'Failed to cancel appointment')->with('success', false);
        }
    }

    public function requestReschedule(Request $request, $appointment)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'time' => 'required|string',
            'reason' => 'required|string'
        ]);

        $targetAppointment = Appointments::find($appointment);

        if (!$targetAppointment) {
            return redirect()->back()->with('message', 'Appointment not found')->with('success', false);
        }
        $old_data = [
            'date' => $targetAppointment->date,
            'time' => $targetAppointment->time
        ];
        DB::beginTransaction();
        try {
            $targetAppointment->old_data = json_encode($old_data);
            $targetAppointment->resched_data = json_encode([
                'date' => $validated['date'],
                'time' => $validated['time'],
                'resched_reason' => $validated['reason']
            ]);
            $targetAppointment->save();
            DB::commit();
            return redirect()->back()->with('message', 'Appointment rescheduled successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('message', 'Failed to reschedule appointment: ' . $e->getMessage())->with('success', false);
        }
    }

    public function update(Request $request, $appointment)
    {
        return redirect()->back()->with('message', 'Appointment updated successfully')->with('success', true);
    }

    public function started(Request $request, $appointment)
    {
        $targetAppointment = Appointments::find($appointment);
        DB::beginTransaction();
        try {
            $targetAppointment->status = 'started';
            $targetAppointment->save();
            DB::commit();
            return redirect()->back()->with('message', 'Appointment started successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('message', 'Failed to start appointment')->with('success', false);
        }
    }

    public function noShow(Request $request, $appointment)
    {
        $targetAppointment = Appointments::find($appointment);
        DB::beginTransaction();
        try {
            $targetAppointment->status = 'no-show';
            $targetAppointment->save();
            DB::commit();
            return redirect()->back()->with('message', 'Appointment marked as no-show successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('message', 'Failed to mark appointment as no-show')->with('success', false);
        }
    }

    public function complete(Request $request, $appointment)
    {
        $targetAppointment = Appointments::with('user')->find($appointment);
    
        if (!$targetAppointment) {
            return redirect()->back()->with('message', 'Appointment not found')->with('success', false);
        }
    
        $currentStaff = ShopStaffs::where('staff_id', Auth::id())->first();
    
        DB::beginTransaction();
        try {
            // Change status to 'completed' but mark it as pending user confirmation
            $targetAppointment->status = 'completed';
            $targetAppointment->completed_by = $currentStaff->id;
            $targetAppointment->completed_at = now();
            $targetAppointment->is_user_confirmed = false; // Add this field to appointments table
            $targetAppointment->save();
            
            // Notify the user about completion and request confirmation
            $user = $targetAppointment->user;
            if ($user) {
                $user->notify(new AppointmentCompletedNotification($targetAppointment));
            }
            
            DB::commit();
            
            return redirect()->back()->with('message', 'Appointment marked as completed. Waiting for user confirmation.')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('message', 'An error occurred while completing the appointment: ' . $e->getMessage())->with('success', false);
        }
    }

    public function undo(Request $request, $appointment)
    {
        $targetAppointment = Appointments::find($appointment);
        DB::beginTransaction();
        try {
            $targetAppointment->status = 'upcoming';
            $targetAppointment->save();
            DB::commit();
            return redirect()->back()->with('message', 'Appointment completed successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('message', 'Failed to complete appointment')->with('success', false);
        }
    }
}
