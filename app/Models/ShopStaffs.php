<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopStaffs extends Model
{
    //
    protected $table = 'shop_staffs';

    protected $fillable = [
        'shop_id',
        'staff_id', // User ID
        'role', // this just identify what role the staff is in the shop
        'position', // this is the position of the staff in the shop like {Owner, Manager, Staff}
        'is_active', // Active status of the staff
        'started_at', // Start date of the staff
        'ended_at', // End date of the staff
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
    //staff() and user() are the same
    public function user()
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function appointments()
    {
        return $this->hasMany(UserAppointments::class, 'staff_id');
    }
    // see if the staff is a Manager of the shop
    public function isManager()
    {
        return $this->position === 'manager';
    }
    // see if the staff is a Owner of the shop
    public function isOwner()
    {
        return $this->position === 'owner';
    }
    // see if the staff is a Staff of the shop
    public function isStaff()
    {
        return $this->position === 'staff';
    }
    // check if owner or manager of the shop
    public function isOwnerOrManager()
    {
        return $this->isOwner() || $this->isManager();
    }
}
