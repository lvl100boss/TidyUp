<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformStaff extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'role',
        'email',
        'phone',
        'avatar',
        'department',
        'office_location',
        'date_hired',
        'status'
    ];

    protected $casts = [
        'date_hired' => 'date'
    ];
}
