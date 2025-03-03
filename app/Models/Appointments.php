<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointments extends Model
{
    //
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
        'reschedule_count',
        'reschedule_from',
        'is_successful',
        'created_at',
        'updated_at',
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
}
