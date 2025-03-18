<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopLegalDocument extends Model
{
    //table
    protected $table = 'shop_legal_document';

    //fillable
    protected $fillable = [
        'shop_id',
        'business_permit_url',
        'dti_registration_url',
        'valid_id_url',
    ];
}
