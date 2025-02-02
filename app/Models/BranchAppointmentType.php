<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BranchAppointmentType extends Model
{
    //
    use HasFactory;

    protected $table = 'branch_appointment_types';

    protected $fillable = [
        'branch_id',
        'appointment_type_id'
    ];

    public function branch()
    {
        return $this->belongsTo(ShopBranch::class, 'branch_id');
    }
}
