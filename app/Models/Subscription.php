<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'duration',
        'duration_unit',
        'status',
    ];

    // Shop subscriptions relationship (if needed)
    public function shops()
    {
        return $this->hasMany(ShopSubscription::class);
    }
}
