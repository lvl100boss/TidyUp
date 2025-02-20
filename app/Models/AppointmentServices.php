<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentServices extends Model
{
    //
    protected $table = 'appointment_services';

    protected $fillable = [
        'appointment_id',
        'service_id',
        'user_id',
        'created_at',
        'updated_at',
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointments::class, 'appointment_id');
    }

    public function shopService()
    {
        return $this->belongsTo(ShopServiceCategories::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
