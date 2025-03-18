<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Auth\Notifications\VerifyEmail;

class CustomVerifyEmail extends VerifyEmail
{
    protected function buildMailMessage($url)
    {
        return (new MailMessage)
            ->subject('📧 Welcome to TidyUp - Email Verification')
            ->greeting('🎉 Welcome to TidyUp!')
            ->line('We\'re thrilled to have you join our community! Your journey to a more organized life begins here.')
            ->line('Please verify your email address to access all TidyUp features:')
            ->action('✨ Verify My Email', $url)
            ->line('⚠️ Note: This verification link will expire in 60 minutes.')
            ->line('If you didn\'t create a TidyUp account, you can safely ignore this email.')
            ->salutation("Warm regards,\n\nThe TidyUp Team");
    }
}
