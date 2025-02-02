<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BranchCategory extends Model
{
    protected $table = 'branch_category';
    protected $fillable = [
        'category_name'
    ];

    public function branches()
    {
        return $this->belongsToMany(ShopBranch::class, 'branch_branch_category', 'branch_category_id', 'branch_id');
    }
}
