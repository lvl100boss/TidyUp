<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopGallery extends Model
{
    //
    protected $table = 'shop_gallery';
    protected $fillable = [
        'filename',
        'path',
        'url',
        'shop_id'
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}
