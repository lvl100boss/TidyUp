<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Appointments;
use Illuminate\Support\Facades\Log;

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
        'status',
        'rejection_reason',
    ];

    // Add appends to ensure status is always included
    protected $appends = ['shop_status'];

    // Add a custom accessor for status to diagnose issues
    public function getShopStatusAttribute()
    {
        $status = $this->attributes['status'] ?? 'unknown';
        Log::debug("Shop {$this->id} status: {$status}");
        return $status;
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

    // Remove or comment out the problematic methods that use non-existent tables
    // public function shop_categories()
    // {
    //     return $this->hasMany(ShopCategory::class);
    // }

    // public function shop_gallery()
    // {
    //     return $this->hasMany(ShopGallery::class);
    // }

    // public function shop_service_categories()
    // {
    //     return $this->hasMany(ShopServiceCategories::class);
    // }

    // public function shop_operation_hours()
    // {
    //     return $this->hasMany(OperationHours::class, 'shop_id');
    // }
}
