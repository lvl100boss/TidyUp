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
                ->where('staff_booked', false) // Filter out staff-booked appointments
                ->values()
                ->all();
        }

        extract($appointmentsByStatus);
        // Also filter reschedule requests to exclude staff-booked appointments
        $requestRescheduleAppointments = $userAppointments->appointments
            ->where('status', 'pending')
            ->where('is_successful', true)
            ->where('resched_data', '!=', null)
            ->where('staff_booked', false)
            ->values()
            ->all();

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
        $appointmentId = $request->input('appointment_id');
        $appointment = Appointments::find($appointmentId);

        if (!$appointment) {
            return redirect()->back()
                ->with('message', 'Appointment not found')
                ->with('success', false);
        }

        // Verify the appointment belongs to the authenticated user
        if ($appointment->user_id !== Auth::id()) {
            return redirect()->back()
                ->with('message', 'Unauthorized action')
                ->with('success', false);
        }

        DB::beginTransaction();
        try {
            // Update the appointment to confirm it's completed
            $appointment->is_user_confirmed = true;
            $appointment->is_successful = true;
            $appointment->save();

            DB::commit();

            return redirect()->route('appointments', ['tab' => 'completed'])
                ->with('message', 'Appointment has been confirmed as completed')
                ->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('message', 'An error occurred while confirming appointment completion: ' . $e->getMessage())
                ->with('success', false);
        }
    }
}
