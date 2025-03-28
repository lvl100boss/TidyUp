<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'tier',
        'monthly_price',
        'yearly_price',
        'monthly_discount',
        'yearly_discount',
        'status', // Add status to fillable attributes
    ];
}