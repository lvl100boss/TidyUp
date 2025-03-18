<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'category_id'
    ];

    /**
     * Get the table associated with the model.
     *
     * @return string
     */
    protected $table = 'shop_category'; // Changed from 'shop_categories' to 'shop_category'

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['category_name'];

    /**
     * Get the shop that owns this category.
     */
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    /**
     * Get the category information.
     */
    public function categories()
    {
        return $this->belongsTo(Categories::class, 'category_id');
    }

    /**
     * Get the category name directly from the database if relationship isn't loading
     */
    public function getCategoryNameAttribute()
    {
        // First try to get from relationship
        if ($this->categories) {
            return $this->categories->name;
        }

        // If relationship fails, try direct query
        $category = Categories::find($this->category_id);
        return $category ? $category->name : 'Unknown';
    }
}
