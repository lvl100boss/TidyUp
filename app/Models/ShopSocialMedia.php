<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopSocialMedia extends Model
{
    use HasFactory;

    protected $table = 'shop_social_media';

    protected $fillable = [
        'shop_id',
        'name',
        'url',
        'icon',
        'is_active',
    ];

    /**
     * Get the shop that owns the social media
     */
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}
