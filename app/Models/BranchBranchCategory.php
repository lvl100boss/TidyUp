<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BranchBranchCategory extends Model
{
    //
    protected $table = 'branch_branch_category';
    protected $fillable = [
        'branch_id',
        'branch_category_id'
    ];

    public function branch()
    {
        return $this->belongsTo(ShopBranch::class, 'branch_id');
    }

    public function branchCategory()
    {
        return $this->belongsTo(BranchCategory::class, 'branch_category_id');
    }
}
