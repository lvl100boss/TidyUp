<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable = [
        'name'
    ];

    /**
     * Get the shop categories for this category
     */
    public function shopCategories()
    {
        return $this->hasMany(ShopCategory::class, 'category_id');
    }
}
