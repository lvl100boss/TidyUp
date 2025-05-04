<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentServices extends Model
{
    use HasFactory;

    protected $table = 'appointment_services';

    protected $fillable = [
        'appointment_id',
        'service_id',
        'attendee_id',
        'staff_id',
        'user_id',
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointments::class, 'appointment_id');
    }

    public function shopService()
    {
        return $this->belongsTo(ShopServiceCategories::class, 'service_id');
    }

    public function attendee()
    {
        return $this->belongsTo(Attendee::class, 'attendee_id');
    }

    public function staff()
    {
        return $this->belongsTo(ShopStaffs::class, 'staff_id');
    }
}
