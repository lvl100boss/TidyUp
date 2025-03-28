<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'subscription_id',
        'start_date',
        'end_date',
        'status',
        'billing_cycle', // Added billing_cycle
        'payment_id',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}