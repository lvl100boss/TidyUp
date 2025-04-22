<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'subject',
        'category',
        'priority',
        'rating',
        'message',
        'attachments',
        'status',
        'response',
        'responded_at',
        'responded_by',
        'user_id'
    ];

    protected $casts = [
        'attachments' => 'string', // Store as JSON string
        'responded_at' => 'datetime',
    ];

    // Relationship with user who submitted the feedback
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with admin who responded
    public function responder()
    {
        return $this->belongsTo(User::class, 'responded_by');
    }
}
