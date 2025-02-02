<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OperationHours extends Model
{
    //
    protected $table = 'operation_hours';

    protected $fillable = [
        'branch_id',
        'day',
        'is_open',
        'opening_time',
        'closing_time'
    ];

    public function branch()
    {
        return $this->belongsTo(ShopBranch::class, 'branch_id');
    }
}
