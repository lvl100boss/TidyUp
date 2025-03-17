<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointments extends Model
{
    use HasFactory;

    protected $table = 'appointments';

    protected $fillable = [
        'user_id',
        'shop_id',
        'date',
        'time',
        'total_price',
        'status',
        'note',
        'is_successful',
        'created_at',
        'updated_at',
        'decline_reason',
        'cancel_reason',
        'resched_reason',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
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



    // Helper scope for filtering by status
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
