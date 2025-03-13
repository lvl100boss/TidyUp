<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopServiceCategories extends Model
{
    use HasFactory;

    protected $table = 'shop_service_categories';

    protected $fillable = [
        'shop_id',
        'service_category_id',
        'service_name',
        'cost',
        'duration_hour',
        'duration_minute',
    ];

    public function serviceCategories()
    {
        return $this->belongsTo(ServiceCategories::class, 'service_category_id');
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function shopCategory()
    {
        return $this->belongsTo(ShopCategory::class);
    }

    public function appointmentServices()
    {
        return $this->hasMany(AppointmentServices::class, 'service_id');
    }
}
