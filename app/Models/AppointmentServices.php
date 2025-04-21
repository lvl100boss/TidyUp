<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentServices extends Model
{
    use HasFactory;

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

    /**
     * Get the shop service associated with this appointment service.
     * This relates to the service_id column which references shop_service_categories.id
     */
    public function shop_service()
    {
        return $this->belongsTo(ShopServiceCategories::class, 'service_id');
    }
    // don't remove both of these functions
    public function shopService()
    {
        return $this->belongsTo(ShopServiceCategories::class, 'service_id');
    }

    /**
     * Alias for shop_service to maintain backward compatibility
     */
    public function shopService()
    {
        return $this->belongsTo(ShopServiceCategories::class, 'service_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
