<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopAccount extends Model
{
    //
    protected $table = 'shop_account';
    protected $fillable = [
        'shop_owner_id',
        'shop_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'shop_owner_id');
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}
