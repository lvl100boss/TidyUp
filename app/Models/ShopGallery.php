<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopGallery extends Model
{
    //
    protected $table = 'shop_gallery';
    protected $fillable = [
        'filename',
        'path',
        'url',
        'branch_id'
    ];

    public function branch()
    {
        return $this->belongsTo(ShopBranch::class);
    }
}
