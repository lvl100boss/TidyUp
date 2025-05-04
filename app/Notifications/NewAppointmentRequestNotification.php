<?php

namespace App\Notifications;

use App\Models\Appointments;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewAppointmentRequestNotification extends Notification implements ShouldQueue
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
        $shopName = $this->appointment->shop->shop_name;
        $date = $this->appointment->date;
        $time = date('h:i A', strtotime($this->appointment->time));

        return (new MailMessage)
            ->subject("New Appointment Request - $shopName")
            ->greeting('Hello!')
            ->line("You have a new appointment request for $shopName")
            ->line("Date: $date")
            ->line("Time: $time")
            ->action('View Appointment', url('/shop/appointments'))
            ->line('Thank you for using TidyUp!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'appointment_id' => $this->appointment->id,
            'shop_id' => $this->appointment->shop_id,
            'shop_name' => $this->appointment->shop->shop_name,
            'user_name' => $this->appointment->user->name,
            'date' => $this->appointment->date,
            'time' => $this->appointment->time,
            'message' => 'New appointment request',
            'status' => $this->appointment->status,
            'type' => 'appointment_request',
        ];
    }
}
