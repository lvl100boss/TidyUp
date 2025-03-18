<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Shop;

class NewShopRegistrationNotification extends Notification
{
    use Queueable;

    protected $shop;

    public function __construct(Shop $shop)
    {
        $this->shop = $shop;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Shop Registration Requires Verification')
            ->line('A new shop has registered and requires verification:')
            ->line('Shop Name: ' . $this->shop->shop_name)
            ->line('Owner: ' . $this->shop->user->first_name . ' ' . $this->shop->user->last_name)
            ->action('Review Shop', route('admin.shops.show', $this->shop->id));
    }

    public function toArray($notifiable)
    {
        return [
            'shop_id' => $this->shop->id,
            'shop_name' => $this->shop->shop_name,
            'message' => 'New shop registration requires verification',
            'action_url' => route('admin.shops.show', $this->shop->id)
        ];
    }
}
