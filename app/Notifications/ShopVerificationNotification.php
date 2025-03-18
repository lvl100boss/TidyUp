<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Shop;

class ShopVerificationNotification extends Notification
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
            ->subject('Your Shop Has Been Verified')
            ->line('Congratulations! Your shop has been verified and is now visible to customers.')
            ->line('Shop Name: ' . $this->shop->shop_name)
            ->action('View Your Shop', route('shop.show', $this->shop->id))
            ->line('You can now start accepting bookings and managing your services.');
    }

    public function toArray($notifiable)
    {
        return [
            'shop_id' => $this->shop->id,
            'shop_name' => $this->shop->shop_name,
            'message' => 'Your shop has been verified',
            'action_url' => route('shop.show', $this->shop->id)
        ];
    }
}
