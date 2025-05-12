<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Appointments extends Model
{
    use HasFactory;

    protected $table = 'appointments';

    protected $fillable = [
        'user_id',
        'shop_id',
        'staff_id',
        'date',
        'time',
        'total_price',
        'status',
        'old_data',
        'resched_data',
        'note',
        'is_successful',
        'created_at',
        'updated_at',
        'decline_reason',
        'cancel_reason',
        'resched_reason',
        'has_review',
        'user_confirmed',
        'nickname',
        'status_admin',
        'completed_by',
        'completed_at',
        'is_user_confirmed',
        'approved_by',
        'booking_for_other',
    ];

    protected $casts = [
        'old_data' => 'array',
        'resched_data' => 'array',
        'booking_for_other' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function staff()
    {
        return $this->belongsTo(ShopStaffs::class, 'staff_id');
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function appointmentServices()
    {
        return $this->hasMany(AppointmentServices::class, 'appointment_id');
    }

    public function userAppointments()
    {
        return $this->hasMany(UserAppointments::class, 'appointment_id');
    }

    /**
     * Get the review for the appointment.
     */
    public function review()
    {
        return $this->hasOne(Review::class, 'appointment_id');
    }

    /**
     * Get the services associated with the appointment.
     */
    public function services()
    {
        return $this->hasMany(AppointmentServices::class, 'appointment_id');
    }

    // Helper scope for filtering by status
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Check if this appointment conflicts with other appointments for the same staff and date
     * 
     * @return array ['hasConflict' => bool, 'conflictingAppointment' => Appointment|null, 'message' => string|null]
     */
    public function checkTimeConflict()
    {
        if (!$this->staff_id || !$this->date || !$this->time) {
            return [
                'hasConflict' => false,
                'message' => null,
                'conflictingAppointment' => null
            ];
        }

        // Calculate the duration of this appointment
        $durationMinutes = $this->appointmentServices->sum(function ($service) {
            return ($service->shopService->duration_hour * 60) + $service->shopService->duration_minute;
        });

        // Format appointment time for display in error messages
        $appointmentTimeDisplay = Carbon::parse($this->time)->format('g:i A');

        // Get appointment start time in minutes
        $startHour = (int)substr($this->time, 0, 2);
        $startMinute = (int)substr($this->time, 3, 2);
        $startTimeInMinutes = ($startHour * 60) + $startMinute;

        // Calculate end time in minutes
        $endTimeInMinutes = $startTimeInMinutes + $durationMinutes;
        
        // Get formatter for end time display
        $endTimeDisplay = Carbon::parse($this->time)
            ->addMinutes($durationMinutes)
            ->format('g:i A');

        // Find existing appointments for the same staff on the same date with potential conflicts
        $conflictingAppointments = self::where('staff_id', $this->staff_id)
            ->where('id', '!=', $this->id) // Exclude the current appointment
            ->where('date', $this->date)
            ->whereIn('status', ['pending', 'upcoming', 'started'])
            ->with(['appointmentServices.shopService', 'user'])
            ->get();

        foreach ($conflictingAppointments as $existingAppointment) {
            // Calculate existing appointment time range
            $existingStartHour = (int)substr($existingAppointment->time, 0, 2);
            $existingStartMinute = (int)substr($existingAppointment->time, 3, 2);
            $existingStartTimeInMinutes = ($existingStartHour * 60) + $existingStartMinute;

            // Format existing appointment time for display
            $existingTimeDisplay = Carbon::parse($existingAppointment->time)->format('g:i A');

            // Calculate existing appointment end time
            $existingDurationMinutes = $existingAppointment->appointmentServices->sum(function ($service) {
                return ($service->shopService->duration_hour * 60) + $service->shopService->duration_minute;
            });

            $existingEndTimeInMinutes = $existingStartTimeInMinutes + $existingDurationMinutes;
            
            // Format end time for existing appointment
            $existingEndTimeDisplay = Carbon::parse($existingAppointment->time)
                ->addMinutes($existingDurationMinutes)
                ->format('g:i A');

            // Check for overlap:
            // If the new appointment starts before the existing one ends 
            // AND the new appointment ends after the existing one starts
            if ($startTimeInMinutes < $existingEndTimeInMinutes && $endTimeInMinutes > $existingStartTimeInMinutes) {
                // Get customer name for better error messages
                $customerName = $existingAppointment->user ? 
                    $existingAppointment->user->first_name . ' ' . $existingAppointment->user->last_name : 
                    'Another customer';
                
                // Format date for display in error message
                $displayDate = Carbon::parse($this->date)->format('F j, Y');
                
                // Construct detailed error message
                $message = "Scheduling conflict detected on {$displayDate}. ";
                $message .= "This appointment ({$appointmentTimeDisplay} - {$endTimeDisplay}) ";
                $message .= "overlaps with {$customerName}'s {$existingAppointment->status} appointment ";
                $message .= "({$existingTimeDisplay} - {$existingEndTimeDisplay}).";
                
                // Conflict found with detailed information
                return [
                    'hasConflict' => true,
                    'conflictingAppointment' => $existingAppointment,
                    'message' => $message
                ];
            }
        }

        // No conflicts found
        return [
            'hasConflict' => false,
            'conflictingAppointment' => null,
            'message' => null
        ];
    }
}
