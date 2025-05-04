<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'appointment_id',
        'name',
        'email',
    ];

    /**
     * Get the appointment that the attendee belongs to.
     */
    public function appointment()
    {
        return $this->belongsTo(Appointments::class, 'appointment_id');
    }

    /**
     * Get the services assigned to this attendee.
     */
    public function appointmentServices()
    {
        return $this->hasMany(AppointmentServices::class, 'attendee_id');
    }
}
