<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    //
    protected $fillable = [
        'shop_name'
    ];

    public function shopAccount()
    {
        return $this->hasOne(ShopAccount::class);
    }

    public function branches()
    {
        return $this->hasMany(ShopBranch::class);
    }

    public function shopGallery()
    {
        return $this->hasMany(ShopGallery::class, ShopBranch::class);
    }
}
