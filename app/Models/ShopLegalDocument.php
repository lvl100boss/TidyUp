<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ShopLegalDocument extends Model
{
    use HasFactory;

    protected $table = 'shop_legal_document';

    protected $fillable = [
        'shop_id',
        'business_permit_url',
        'dti_registration_url',
        'valid_id_url'
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'business_permit_public_url',
        'dti_registration_public_url',
        'valid_id_public_url'
    ];

    /**
     * Get the shop that owns these legal documents.
     */
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    /**
     * Get the public URL for business permit
     */
    public function getBusinessPermitPublicUrlAttribute()
    {
        if ($this->business_permit_url) {
            $url = url($this->business_permit_url);
            Log::info("Business permit public URL: {$url}");
            return $url;
        }
        return null;
    }

    /**
     * Get the public URL for DTI registration
     */
    public function getDtiRegistrationPublicUrlAttribute()
    {
        if ($this->dti_registration_url) {
            return url($this->dti_registration_url);
        }
        return null;
    }

    /**
     * Get the public URL for valid ID
     */
    public function getValidIdPublicUrlAttribute()
    {
        if ($this->valid_id_url) {
            return url($this->valid_id_url);
        }
        return null;
    }

    /**
     * Check if documents exist in storage
     */
    public static function checkDocumentsExist($shopId)
    {
        $document = self::where('shop_id', $shopId)->first();

        if (!$document) {
            Log::warning("No documents found for shop ID: {$shopId}");
            return false;
        }

        $paths = [
            'business_permit' => $document->business_permit_url,
            'dti_registration' => $document->dti_registration_url,
            'valid_id' => $document->valid_id_url
        ];

        foreach ($paths as $type => $path) {
            if (!$path) continue;

            // Convert path for storage check
            $storagePath = str_replace('storage/', 'public/', $path);
            $exists = Storage::exists($storagePath);

            Log::info("Document check: {$type}", [
                'path' => $path,
                'storage_path' => $storagePath,
                'exists' => $exists
            ]);
        }

        return true;
    }
}
