<?php

namespace App\Notifications;

use App\Models\Appointments;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RescheduleRequestedNotification extends Notification
{
    use Queueable;

    protected $appointment;

    /**
     * Create a new notification instance.
     */
    public function __construct(Appointments $appointment)
    {
        $this->appointment = $appointment;
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
        $shopName = $this->appointment->shop->shop_name ?? 'your shop';
        $userName = $this->appointment->user->name ?? 'A customer';
        $date = date('F j, Y', strtotime($this->appointment->resched_data['date']));
        $time = date('g:i A', strtotime($this->appointment->resched_data['time']));
        
        return (new MailMessage)
            ->subject('Appointment Reschedule Request')
            ->greeting("Hello {$notifiable->first_name},")
            ->line("{$userName} has requested to reschedule their appointment at {$shopName}.")
            ->line("Original date: " . date('F j, Y', strtotime($this->appointment->old_data['date'])) . 
                   " at " . date('g:i A', strtotime($this->appointment->old_data['time'])))
            ->line("Requested date: {$date} at {$time}")
            ->line("Reason: " . ($this->appointment->resched_data['reason'] ?? 'No reason provided'))
            ->action('View Appointment', url('/shop/appointments'))
            ->line('Please review and approve or deny this request.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $userName = $this->appointment->user->name ?? 'A customer';
        
        return [
            'title' => 'Reschedule Request',
            'message' => "{$userName} has requested to reschedule their appointment",
            'appointment_id' => $this->appointment->id,
            'type' => 'reschedule_request',
        ];
    }
}
