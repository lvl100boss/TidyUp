<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopAppointments extends Model
{
    //
    use HasFactory;

    protected $table = 'shop_appointments';

    protected $fillable = [
        'shop_id',
        'branch_id',
        'appointment_id'
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function branch()
    {
        return $this->belongsTo(ShopBranch::class);
    }

    public function appointment()
    {
        return $this->belongsTo(Appointments::class);
    }
}
