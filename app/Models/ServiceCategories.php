<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceCategories extends Model
{
    //
    protected $table = 'service_categories';

    protected $fillable = [
        'category_name',
        'category_description',
        'category_image',
        'is_active'
    ];

    public function services()
    {
        return $this->hasMany(BranchServices::class);
    }
}
