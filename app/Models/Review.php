<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class Review extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'appointment_id',
        'user_id',
        'rating',
        'comment',
        'image_path',
    ];

    // Add shop_id, service_rating, and staff_rating to fillable if they exist
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        if (Schema::hasColumn('reviews', 'shop_id')) {
            $this->fillable[] = 'shop_id';
        }

        if (Schema::hasColumn('reviews', 'service_rating')) {
            $this->fillable[] = 'service_rating';
        }

        if (Schema::hasColumn('reviews', 'staff_rating')) {
            $this->fillable[] = 'staff_rating';
        }
    }

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = ['service_rating', 'staff_rating', 'image_url'];

    /**
     * Get the service rating
     */
    public function getServiceRatingAttribute()
    {
        // If the attribute exists in database and has a value, return it
        if (isset($this->attributes['service_rating'])) {
            return $this->attributes['service_rating'];
        }

        // Fall back to the overall rating
        return $this->attributes['rating'] ?? 0;
    }

    /**
     * Get the staff rating
     */
    public function getStaffRatingAttribute()
    {
        // If the attribute exists in database and has a value, return it
        if (isset($this->attributes['staff_rating'])) {
            return $this->attributes['staff_rating'];
        }

        // Fall back to the overall rating
        return $this->attributes['rating'] ?? 0;
    }

    /**
     * Get the image URL
     */
    public function getImageUrlAttribute()
    {
        if (empty($this->image_path)) {
            return null;
        }

        // Check if the path already has storage/ prefix
        if (strpos($this->image_path, 'storage/') === 0) {
            return '/' . $this->image_path;
        }

        // Otherwise, prepend the /storage/ path
        return '/storage/' . $this->image_path;
    }

    /**
     * Get the appointment that owns the review.
     */
    public function appointment()
    {
        return $this->belongsTo(Appointments::class, 'appointment_id');
    }

    /**
     * Get the user that wrote the review.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the shop that was reviewed.
     */
    public function shop()
    {
        // Only define this relationship if shop_id column exists
        if (Schema::hasColumn('reviews', 'shop_id')) {
            return $this->belongsTo(Shop::class);
        }

        // Otherwise return the shop through the appointment relationship
        return $this->appointment->shop;
    }
}
