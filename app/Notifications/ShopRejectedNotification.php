<?php

namespace App\Notifications;

use App\Models\Shop;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ShopRejectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $shop;
    protected $reason;

    /**
     * Create a new notification instance.
     */
    public function __construct(Shop $shop, string $reason)
    {
        $this->shop = $shop;
        $this->reason = $reason;
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
            ->subject('Shop Registration Status Update - TidyUp')
            ->greeting('Hello ' . $notifiable->first_name)
            ->line('We regret to inform you that your shop "' . $this->shop->shop_name . '" registration has not been approved at this time.')
            ->line('Reason:')
            ->line($this->reason)
            ->line('You can update your shop details and resubmit for verification.')
            ->action('Update Shop Details', url('/shop/dashboard'))
            ->line('If you have any questions or need assistance, please contact our support team.');
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
            'title' => 'Shop Registration Not Approved',
            'message' => 'Your shop registration for "' . $this->shop->shop_name . '" was not approved. Please check the details.',
            'reason' => $this->reason,
            'type' => 'error',
            'action_url' => '/shop/dashboard',
            'action_text' => 'View Details',
        ];
    }
}
