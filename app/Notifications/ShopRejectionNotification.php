<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Shop;

class ShopRejectionNotification extends Notification
{
    use Queueable;

    protected $shop;
    protected $reason;

    public function __construct(Shop $shop, $reason)
    {
        $this->shop = $shop;
        $this->reason = $reason;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Shop Registration Update')
            ->line('Your shop registration has been reviewed but could not be verified at this time.')
            ->line('Shop Name: ' . $this->shop->shop_name)
            ->line('Reason: ' . $this->reason)
            ->line('You can update your information and submit for review again.');
    }

    public function toArray($notifiable)
    {
        return [
            'shop_id' => $this->shop->id,
            'shop_name' => $this->shop->shop_name,
            'message' => 'Your shop registration was not approved',
            'reason' => $this->reason,
            'action_url' => route('shop.setup')
        ];
    }
}
