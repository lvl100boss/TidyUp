<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlatfomStaff extends Model
{
    //
    //
    protected $table = 'platform_staffs';

    protected $fillable = [
        'user_id',
        'role',
        'position',
        'is_active',
        'started_at',
        'ended_at',
        'created_at',
        'updated_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}
