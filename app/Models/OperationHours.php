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

    /**
     * Get the shop that owns the operation hours.
     */
    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id');
    }
}
