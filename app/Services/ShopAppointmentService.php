<?php

namespace App\Services;

use App\Models\Appointments;
use App\Models\ShopStaffs;
use App\Models\User;
use App\Models\UserAppointments;
use Illuminate\Support\Facades\Auth;

class ShopAppointmentService
{
    /**
     * Get all appointment data for a staff member
     * 
     * @param int $userId
     * @return array
     */
    public function getAppointmentsData($userId)
    {
        $user = User::find($userId);
        $currentStaff = ShopStaffs::with(['shop', 'staff'])->where('staff_id', $user->id)->first();

        if (!$currentStaff) {
            return [
                'currentStaff' => null,
                'appointments' => []
            ];
        }
        return [
            'currentStaff' => $currentStaff,
            'appointments' => $this->getCategorizedAppointments($currentStaff->id),
            'upcomingSchedules' => $this->getCurrentStaffUpcomingAppointmentSchedules($currentStaff->id),
            'shopBusinessSchedules' => $this->getShopBusinessHours($currentStaff->id),
            'shopAppointments' => $this->getShopAppointments($currentStaff->id),
            'rescheduleRequests' => $this->requestReschedule($currentStaff->id)
        ];
    }


    /**
     * Get appointments for a staff member categorized by status
     * 
     * @param int $staffId
     * @return array
     */
    private function getCategorizedAppointments($staffId)
    {
        $userAppointments = UserAppointments::where('staff_id', $staffId)
            ->whereHas('appointment', function ($query) {
                $query->whereNull('resched_data');
            })
            ->with([
                'user',
                'appointment',
                'appointment.appointmentServices.shopService'
            ])
            ->get();

        // Group appointments by status
        $categorized = [
            'pending' => [],
            'upcoming' => [],
            'completed' => [],
            'cancelled' => [],
            'no-show' => [],
            'declined' => []
        ];

        foreach ($userAppointments as $appointment) {
            $status = $appointment->appointment->status ?? 'pending';
            $categorized[$status][] = $this->formatAppointmentData($appointment);
        }

        return $categorized;
    }

    /**
     * Format appointment data for cleaner frontend usage
     * 
     * @param UserAppointments $userAppointment
     * @return array
     */
    private function formatAppointmentData($userAppointment)
    {
        // Get all services for this appointment
        $services = [];
        foreach ($userAppointment->appointment->appointmentServices as $service) {
            $services[] = [
                'id' => $service->shopService->id,
                'name' => $service->shopService->service_name,
                'cost' => $service->shopService->cost,
                'duration' => [
                    'hours' => $service->shopService->duration_hour,
                    'minutes' => $service->shopService->duration_minute
                ]
            ];
        }

        // Calculate total cost and duration
        $totalCost = array_sum(array_column($services, 'cost'));
        $totalHours = array_sum(array_column(array_column($services, 'duration'), 'hours'));
        $totalMinutes = array_sum(array_column(array_column($services, 'duration'), 'minutes'));

        // Convert excess minutes to hours
        $totalHours += floor($totalMinutes / 60);
        $totalMinutes %= 60;

        return [
            'id' => $userAppointment->appointment->id,
            'date' => $userAppointment->appointment->date,
            'time' => $userAppointment->appointment->time,
            'end_time' => $this->calculateRoundedEndTime(
                $userAppointment->appointment->date,
                $userAppointment->appointment->time,
                $totalHours,
                $totalMinutes
            ),
            'status' => $userAppointment->appointment->status,
            'customer' => [
                'id' => $userAppointment->user->id,
                'name' => $userAppointment->user->first_name . " " . $userAppointment->user->last_name,
                'email' => $userAppointment->user->email,
                'profile_photo' => '/storage/' . $userAppointment->user->profile_photo_path
            ],
            'services' => $services,
            'total_cost' => $totalCost,
            'total_duration' => [
                'hours' => $totalHours,
                'minutes' => $totalMinutes
            ],
            'notes' => $userAppointment->appointment->note,
            'decline_reason' => $userAppointment->appointment->decline_reason,
            'cancel_reason' => $userAppointment->appointment->cancel_reason,
            'resched_reason' => $userAppointment->appointment->resched_reason,
            'resched_data' => $userAppointment->appointment->resched_data
        ];
    }

    private function calculateRoundedEndTime($date, $time, $durationHours, $durationMinutes)
    {
        // Create Carbon instance from date and time
        $startDateTime = \Carbon\Carbon::parse("$date $time");

        // Add the duration
        $endDateTime = $startDateTime->addHours($durationHours)->addMinutes($durationMinutes);

        // Round to the nearest 30-minute mark
        $roundedMinutes = ($endDateTime->minute < 30) ? 30 : 0;
        if ($roundedMinutes === 0) {
            $endDateTime->addHour();
        }
        $endDateTime->minute($roundedMinutes);

        return $endDateTime->format('H:i') . ':00';
    }


    private function getCurrentStaffUpcomingAppointmentSchedules($staffId)
    {
        $upcomingSchedule = UserAppointments::where('staff_id', $staffId)
            ->with([
                'appointment',
                'appointment.appointmentServices.shopService'
            ])
            ->whereHas('appointment', function ($query) {
                $query->where('status', 'upcoming');
            })
            ->get();

        // Calculate duration for each appointment individually
        $formattedSchedules = [];
        foreach ($upcomingSchedule as $schedule) {
            $totalMinutes = $schedule->appointment->appointmentServices->sum(function ($service) {
                return $service->shopService->duration_hour * 60 + $service->shopService->duration_minute;
            });

            // Convert to hours and minutes
            $hours = floor($totalMinutes / 60);
            $minutes = $totalMinutes % 60;

            $formattedSchedules[] = [
                'id' => $schedule->appointment->id,
                'date' => $schedule->appointment->date,
                'time' => $schedule->appointment->time,
                'end_time' => $this->calculateRoundedEndTime(
                    $schedule->appointment->date,
                    $schedule->appointment->time,
                    $hours,
                    $minutes
                ),
                'appointment_data' => $schedule,
                'appointment_resched_data' => $schedule->appointment->resched_data
                // Add any other data you need from the appointment
            ];
        }
        // dd($formattedSchedules);
        return $formattedSchedules;
    }

    private function getShopBusinessHours($staffId)
    {
        $staff = ShopStaffs::find($staffId);
        $shopBusinessSchedules = $staff->shop->load('shopOperationHours')->shopOperationHours;
        return $shopBusinessSchedules;
    }

    private function getShopAppointments($staffId)
    {
        $shopAppointments = ShopStaffs::find($staffId)->shop->appointments;
        $shopAppointments = $shopAppointments->map(function ($appointment) {
            $totalHours = $appointment->appointmentServices->sum('shopService.duration_hour');
            $totalMinutes = $appointment->appointmentServices->sum('shopService.duration_minute');

            // Convert excess minutes to hours
            if ($totalMinutes >= 60) {
                $totalHours += floor($totalMinutes / 60);
                $totalMinutes = $totalMinutes % 60;
            }

            // Calculate end time
            $startDateTime = \Carbon\Carbon::parse($appointment->date . ' ' . $appointment->time);
            $endDateTime = $startDateTime->copy()->addHours($totalHours)->addMinutes($totalMinutes);
            $endTime = $endDateTime->format('H:i:s');

            return [
                'id' => $appointment->id,
                'date' => $appointment->date,
                'time' => $appointment->time,
                'end_time' => $endTime,
                'status' => $appointment->status,
                'customer' => [
                    'id' => $appointment->user->id,
                    'name' => $appointment->user->first_name . " " . $appointment->user->last_name,
                    'email' => $appointment->user->email,
                    'profile_photo' => '/storage/' . $appointment->user->profile_photo_path
                ],
                'stylist' => [
                    'id' => $appointment->userAppointments->isNotEmpty() ? $appointment->userAppointments[0]->staff->id : null,
                    'name' => $appointment->userAppointments->isNotEmpty() ? $appointment->userAppointments[0]->staff->staff->first_name . " " . $appointment->userAppointments[0]->staff->staff->last_name : null,
                    'email' => $appointment->userAppointments->isNotEmpty() ? $appointment->userAppointments[0]->staff->staff->email : null,
                    'profile_photo' => $appointment->userAppointments->isNotEmpty() ? '/storage/' . $appointment->userAppointments[0]->staff->staff->profile_photo_path : null
                ],

                'services' => $appointment->appointmentServices->map(function ($service) {
                    return [
                        'id' => $service->shopService->id,
                        'name' => $service->shopService->service_name,
                        'cost' => $service->shopService->cost,
                        'duration' => [
                            'hours' => $service->shopService->duration_hour,
                            'minutes' => $service->shopService->duration_minute
                        ]
                    ];
                }),
                'total_cost' => $appointment->appointmentServices->sum('shopService.cost'),
                'total_duration' => [
                    'hours' => $totalHours,
                    'minutes' => $totalMinutes
                ],
                'notes' => $appointment->note,
                'decline_reason' => $appointment->decline_reason,
                'cancel_reason' => $appointment->cancel_reason,
                'resched_reason' => $appointment->resched_reason
            ];
        })->sortByDesc(function ($appointment) {
            return $appointment['date'] . ' ' . $appointment['time'];
        })->values();
        return $shopAppointments;
    }

    private function requestReschedule($staffId)
    {
        $shopAppointments = ShopStaffs::find($staffId)->shop->appointments
            ->where('resched_data', '!=', null);
        $shopAppointments = $shopAppointments->map(function ($appointment) {
            $totalHours = $appointment->appointmentServices->sum('shopService.duration_hour');
            $totalMinutes = $appointment->appointmentServices->sum('shopService.duration_minute');

            // Convert excess minutes to hours
            if ($totalMinutes >= 60) {
                $totalHours += floor($totalMinutes / 60);
                $totalMinutes = $totalMinutes % 60;
            }

            // Calculate end time
            $startDateTime = \Carbon\Carbon::parse($appointment->date . ' ' . $appointment->time);
            $endDateTime = $startDateTime->copy()->addHours($totalHours)->addMinutes($totalMinutes);
            $endTime = $endDateTime->format('H:i:s');

            return [
                'id' => $appointment->id,
                'date' => $appointment->date,
                'time' => $appointment->time,
                'end_time' => $endTime,
                'status' => $appointment->status,
                'customer' => [
                    'id' => $appointment->user->id,
                    'name' => $appointment->user->first_name . " " . $appointment->user->last_name,
                    'email' => $appointment->user->email,
                    'profile_photo' => '/storage/' . $appointment->user->profile_photo_path
                ],
                'stylist' => [
                    'id' => $appointment->userAppointments->isNotEmpty() ? $appointment->userAppointments[0]->staff->id : null,
                    'name' => $appointment->userAppointments->isNotEmpty() ? $appointment->userAppointments[0]->staff->staff->first_name . " " . $appointment->userAppointments[0]->staff->staff->last_name : null,
                    'email' => $appointment->userAppointments->isNotEmpty() ? $appointment->userAppointments[0]->staff->staff->email : null,
                    'profile_photo' => $appointment->userAppointments->isNotEmpty() ? '/storage/' . $appointment->userAppointments[0]->staff->staff->profile_photo_path : null
                ],

                'services' => $appointment->appointmentServices->map(function ($service) {
                    return [
                        'id' => $service->shopService->id,
                        'name' => $service->shopService->service_name,
                        'cost' => $service->shopService->cost,
                        'duration' => [
                            'hours' => $service->shopService->duration_hour,
                            'minutes' => $service->shopService->duration_minute
                        ]
                    ];
                }),
                'total_cost' => $appointment->appointmentServices->sum('shopService.cost'),
                'total_duration' => [
                    'hours' => $totalHours,
                    'minutes' => $totalMinutes
                ],
                'notes' => $appointment->note,
                'decline_reason' => $appointment->decline_reason,
                'cancel_reason' => $appointment->cancel_reason,
                'resched_reason' => $appointment->resched_reason
            ];
        })->sortByDesc(function ($appointment) {
            return $appointment['date'] . ' ' . $appointment['time'];
        })->values();
        return $shopAppointments;
    }
}
