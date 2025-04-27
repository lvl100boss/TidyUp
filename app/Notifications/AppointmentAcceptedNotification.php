<?php

namespace App\Notifications;

use App\Models\Appointments;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class AppointmentAcceptedNotification extends Notification
{
    /**
     * @var Appointments
     */
    protected $appointment;

    /**
     * Create a new notification instance.
     */
    public function __construct(Appointments $appointment)
    {
        // Eager load relationships needed for the notification content
        $this->appointment = $appointment->loadMissing(['shop', 'appointmentServices.shopService']);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        try {
            $shopName = $this->appointment->shop->name ?? 'The Shop';
            $serviceName = $this->appointment->appointmentServices->first()?->shopService?->service_name ?? 'your service';
            $appointmentDateTime = $this->appointment->date && $this->appointment->time
                ? \Carbon\Carbon::parse($this->appointment->date . ' ' . $this->appointment->time)->format('F j, Y \a\t g:i A')
                : 'your requested time';

            // Generate the full URL for the appointment show route
            $viewAppointmentUrl = url(route('appointments.show', ['appointment' => $this->appointment->id], false));

            return (new MailMessage)
                ->subject('Your Appointment is Confirmed!')
                ->greeting('Great News!')
                ->line("Your appointment with {$shopName} for {$serviceName} on {$appointmentDateTime} has been accepted.")
                ->action('View Your Appointment', $viewAppointmentUrl)
                ->line('We look forward to seeing you!');
        } catch (\Throwable $e) {
            Log::error('Failed to build appointment accepted mail notification: ' . $e->getMessage(), ['exception' => $e]);
            return (new MailMessage)
                ->subject('Your Appointment is Confirmed!')
                ->greeting('Great News!')
                ->line('Your appointment has been accepted.')
                ->line('We look forward to seeing you!');
        }
    }

    /**
     * Get the array representation of the notification for database storage.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        try {
            $shopName = $this->appointment->shop->name ?? 'The Shop';
            $serviceName = $this->appointment->appointmentServices->first()?->shopService?->service_name ?? 'your service';
            $appointmentDateTime = $this->appointment->date && $this->appointment->time
                ? \Carbon\Carbon::parse($this->appointment->date . ' ' . $this->appointment->time)->format('M j, Y @ g:i A')
                : 'your requested time';
            $viewAppointmentUrl = "/appointments/" . $this->appointment->id; // Adjust if necessary;

            return [
                'title' => 'Appointment Accepted',
                'message' => "Confirmed: {$serviceName} at {$shopName} on {$appointmentDateTime}.",
                'appointment_id' => $this->appointment->id,
                'link' => $viewAppointmentUrl,
            ];
        } catch (\Throwable $e) {
            Log::error('Failed to build appointment accepted database notification: ' . $e->getMessage(), ['exception' => $e]);
            return [
                'title' => 'Appointment Accepted',
                'message' => 'Your appointment has been accepted.',
                'appointment_id' => $this->appointment->id ?? null,
                'link' => null,
            ];
        }
    }
}
