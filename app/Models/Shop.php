<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Appointments;

class Shop extends Model
{
    //
    protected $fillable = [
        'user_id',
        'shop_name',
        'email',
        'contact_number',
        'shop_photo',
        'region',
        'province',
        'city',
        'barangay',
        'detailed_address',
        'availability',
        'is_verified',
        'bio',
        'tokens',
    ];

    public function shopAccount()
    {
        return $this->hasOne(ShopAccount::class);
    }

    public function branches()
    {
        return $this->hasMany(ShopBranch::class);
    }

    public function shopGallery()
    {
        return $this->hasMany(ShopGallery::class, ShopBranch::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointments::class);
    }
}
