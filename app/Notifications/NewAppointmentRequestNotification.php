<?php

namespace App\Notifications;

use App\Models\Appointments;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Log; // Optional: For debugging

class NewAppointmentRequestNotification extends Notification
{

    protected Appointments $appointment;

    /**
     * Create a new notification instance.
     */
    public function __construct(Appointments $appointment) // Inject the Appointment model
    {
        // Eager load relationships needed for both mail and database notifications
        $this->appointment = $appointment->loadMissing(['user', 'appointmentServices.shopService']);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database']; // Send via email and store in DB
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Safely access related data
        $userName = $this->appointment->user->username ?? 'A user';
        // Assuming the first service represents the main service for the notification title
        $serviceName = $this->appointment->appointmentServices->first()?->shopService?->service_name ?? 'a service';
        $appointmentDateTime = $this->appointment->date && $this->appointment->time
            ? \Carbon\Carbon::parse($this->appointment->date . ' ' . $this->appointment->time)->format('F j, Y \a\t g:i A')
            : 'the specified time';

        // Link to the main shop appointments page where the staff can see pending requests
        // Based on routes/shopappointments.php, 'shop.appointments' is the index route.
        $viewAppointmentUrl = route('shop.appointments');

        return (new MailMessage)
            ->subject('New Appointment Request Received')
            ->greeting('Hello!') // Consider using $notifiable->first_name if available
            ->line("You have received a new appointment request from {$userName} for {$serviceName}.")
            ->line("Appointment Time: {$appointmentDateTime}")
            ->action('View Appointments', $viewAppointmentUrl) // Changed action text and URL
            ->line('Please review the request in your dashboard.');
    }

    /**
     * Get the array representation of the notification for database storage.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        $userName = $this->appointment->user->username ?? 'A user';
        $serviceName = $this->appointment->appointmentServices->first()?->shopService?->service_name ?? 'a service';
        // Use the same route as the email action - linking to the main appointments page
        $viewAppointmentUrl = "/shop/appointments"; // Adjust if necessary

        return [
            'title' => 'New Appointment Request',
            'message' => "New request from {$userName} for {$serviceName}.",
            'appointment_id' => $this->appointment->id, // Keep ID for potential future use
            'link' => $viewAppointmentUrl, // Link to the main shop appointments page
        ];
    }
}
