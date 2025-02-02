<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BranchServices extends Model
{
    //
    protected $table = 'branch_service_categories';

    protected $fillable = [
        'branch_id',
        'service_category_id',
        'service_name',
        'cost',
        'duration'
    ];

    public function branch()
    {
        return $this->belongsTo(ShopBranch::class, 'branch_id');
    }
}
