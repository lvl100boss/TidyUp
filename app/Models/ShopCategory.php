<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopCategory extends Model
{
    //
    protected $table = 'shop_category';

    protected $fillable = [
        'shop_id',
        'category_id'
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function categories()
    {
        return $this->belongsTo(Categories::class, 'category_id');
    }
}
