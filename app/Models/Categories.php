<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    //
    protected $table = 'categories';

    protected $fillable = [
        'name',
    ];

    public function shopCategory()
    {
        return $this->hasMany(ShopCategory::class, 'category_id');
    }
}
