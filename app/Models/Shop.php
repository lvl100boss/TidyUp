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
        // 'tokens',
    ];

    public function shopGallery()
    {
        return $this->hasMany(ShopGallery::class, 'shop_id');
    }

    public function shopServiceCategories()
    {
        return $this->hasMany(ShopServiceCategories::class);
    }

    public function shopCategories()
    {
        return $this->hasMany(ShopCategory::class);
    }

    public function shopOperationHours()
    {
        return $this->hasMany(OperationHours::class, 'shop_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointments::class);
    }

    public function staffs()
    {
        return $this->hasMany(ShopStaffs::class, 'shop_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function socialMedia()
    {
        return $this->hasMany(ShopSocialMedia::class, 'shop_id');
    }
    public function subscriptions()
    {
    return $this->belongsToMany(Subscription::class, 'shop_subscriptions')
                ->withPivot('start_date', 'end_date', 'status')
                ->withTimestamps();
    }
}
