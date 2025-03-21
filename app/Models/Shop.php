<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Appointments;
use Illuminate\Support\Facades\Log;

class Shop extends Model
{
    //
    protected $fillable = [
        'shop_name',
        'user_id',
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
        'status',
        'rejection_reason',
    ];

    // Add appends to ensure status is always included
    protected $appends = ['shop_status', 'formatted_date'];

    // Clean up the shop status logging to prevent excessive log entries
    public function getShopStatusAttribute()
    {
        return $this->attributes['status'] ?? 'processing';
    }

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Add scope for processing shops
    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    public function getFormattedDateAttribute()
    {
        return $this->created_at ? $this->created_at->format('n/j/Y') : null;
    }

    // These are the relationships you already had - keeping them in case they're used elsewhere
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
    }


    protected $with = ['user', 'shopCategories.categories', 'legalDocuments'];

    public function subscriptions()
    {
    return $this->belongsToMany(Subscription::class, 'shop_subscriptions')
                ->withPivot('start_date', 'end_date', 'status')
                ->withTimestamps();
    }


}
