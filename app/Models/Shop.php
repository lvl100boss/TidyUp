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
<<<<<<< HEAD
<<<<<<< Updated upstream

    /**
     * Get the legal documents for this shop.
     */
    public function legalDocuments()
    {
        return $this->hasOne(ShopLegalDocument::class, 'shop_id');
    }

    // Fix the relationship between Shop and ShopStaffs to ensure it works correctly
    public function shopStaffs()
    {
        return $this->hasMany(ShopStaffs::class, 'shop_id');
    }

    /**
     * Get the shop owner from shop staffs
     */
    public function owner()
    {
        return $this->shopStaffs()
            ->where(function ($query) {
                $query->where('role', 'Shop Owner')
                    ->orWhere('position', 'owner');
            })
            ->with('staff')
            ->first();
    }

    // Make sure this relationship works correctly
    public function shopOwner()
    {
        $ownerStaff = $this->shopStaffs()->where('role', 'Shop Owner')->orWhere('position', 'owner')->first();
        return $ownerStaff ? $ownerStaff->staff() : null;
=======
    public function subscriptions()
    {
    return $this->belongsToMany(Subscription::class, 'shop_subscriptions')
                ->withPivot('start_date', 'end_date', 'status')
                ->withTimestamps();
>>>>>>> Stashed changes
    }
=======
>>>>>>> parent of d6b13c5 (Merge pull request #111 from lvl100boss/main)
}
