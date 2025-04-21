<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Appointments;
use App\Models\User;

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
        $validated = $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
        ]);

        $appointment = Appointments::find($validated['appointment_id']);

        // Verify the appointment belongs to the authenticated user
        if ($appointment->user_id !== Auth::id()) {
            return redirect()->back()->with('message', 'You are not authorized to confirm this appointment')->with('success', false);
        }

        DB::beginTransaction();
        try {
            // Update status only if it's not already completed
            if ($appointment->status !== 'completed') {
                $appointment->status = 'completed';
            }

            // Mark the appointment as confirmed by the user
            $appointment->is_successful = true;
            $appointment->save();

            DB::commit();
            return redirect()->back()->with('message', 'Thank you for confirming your appointment was completed successfully!')->with('success', true);
        } catch (\Exception $e) {
            DB::rollback();
            return redirect()->back()->with('message', 'An error occurred while confirming appointment completion: ' . $e->getMessage())->with('success', false);
        }
    }
}
