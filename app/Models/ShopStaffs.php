<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopStaffs extends Model
{
    //
    protected $table = 'shop_staffs';

    protected $fillable = [
        'shop_id',
        'staff_id',
        'role',
        'position',
        'is_active',
        'started_at',
        'ended_at',
        'created_at',
        'updated_at'
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id');
    }

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function appointments()
    {
        return $this->hasMany(UserAppointments::class, 'staff_id');
    }
}
