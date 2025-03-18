<?php

namespace App\Notifications;

use App\Models\Shop;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ShopVerifiedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $shop;

    /**
     * Create a new notification instance.
     */
    public function __construct(Shop $shop)
    {
        $this->shop = $shop;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Shop Has Been Verified - TidyUp')
            ->greeting('Congratulations!')
            ->line('We\'re pleased to inform you that your shop "' . $this->shop->shop_name . '" has been verified and is now live on TidyUp.')
            ->line('You can now start accepting appointments and managing your business through the shop dashboard.')
            ->action('Go to Shop Dashboard', url('/shop/dashboard'))
            ->line('Thank you for choosing TidyUp for your business!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'shop_id' => $this->shop->id,
            'shop_name' => $this->shop->shop_name,
            'title' => 'Shop Verified',
            'message' => 'Your shop "' . $this->shop->shop_name . '" has been verified and is now live on TidyUp.',
            'type' => 'success',
            'action_url' => '/shop/dashboard',
            'action_text' => 'Go to Dashboard',
        ];
    }
}
