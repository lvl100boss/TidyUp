<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OperationHours extends Model
{
    //
    protected $table = 'shop_operation_hours';

    protected $fillable = [
        'shop_id',
        'day',
        'is_open',
        'open_time',
        'close_time'
    ];

    public function branch()
    {
        return $this->belongsTo(ShopBranch::class, 'branch_id');
    }
}
