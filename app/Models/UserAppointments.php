<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAppointments extends Model
{
    //
    use HasFactory;

    protected $table = 'user_appointments';

    protected $fillable = [
        'user_id',
        'staff_id',
        'appointment_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function appointment()
    {
        return $this->belongsTo(Appointments::class);
    }

    public function staff()
    {
        return $this->belongsTo(ShopStaffs::class, 'staff_id');
    }
}
