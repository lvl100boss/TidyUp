<?php

namespace App\Notifications;

use App\Models\Appointments;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class AppointmentCompletedNotification extends Notification
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
        // Eager load relationships needed for notification content
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
            $shopName = $this->appointment->shop->shop_name ?? 'The Shop';
            $serviceName = $this->appointment->appointmentServices->first()?->shopService?->service_name ?? 'your service';
            $appointmentDateTime = $this->appointment->date && $this->appointment->time
                ? \Carbon\Carbon::parse($this->appointment->date . ' ' . $this->appointment->time)->format('F j, Y \a\t g:i A')
                : 'your requested time';

            // Generate URL for appointment confirmation
            $confirmationUrl = url(route('appointments.confirm-completion', ['appointment' => $this->appointment->id], false));

            return (new MailMessage)
                ->subject('Your Appointment Has Been Marked as Completed')
                ->greeting('Action Required')
                ->line("{$shopName} has marked your appointment for {$serviceName} on {$appointmentDateTime} as completed.")
                ->line("Please confirm if this service was actually completed to your satisfaction.")
                ->action('Confirm Completion', $confirmationUrl)
                ->line("If you believe this was marked in error, please contact the shop or submit feedback through the app.");
        } catch (\Throwable $e) {
            Log::error('Failed to build appointment completed mail notification: ' . $e->getMessage(), ['exception' => $e]);
            return (new MailMessage)
                ->subject('Your Appointment Status Has Changed')
                ->greeting('Action Required')
                ->line('Your appointment has been marked as completed by the shop.')
                ->line('Please confirm if this is correct.');
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
            $shopName = $this->appointment->shop->shop_name ?? 'The Shop';
            $serviceName = $this->appointment->appointmentServices->first()?->shopService?->service_name ?? 'your service';
            $appointmentDateTime = $this->appointment->date && $this->appointment->time
                ? \Carbon\Carbon::parse($this->appointment->date . ' ' . $this->appointment->time)->format('M j, Y @ g:i A')
                : 'your requested time';
    
            // Instead of linking to appointment details, link to appointments page
            // with 'completed' tab active to trigger the modal automatically
            return [
                'title' => 'Appointment Marked as Completed',
                'message' => "{$shopName} has marked your {$serviceName} appointment as completed. Please confirm if this is correct.",
                'appointment_id' => $this->appointment->id,
                'link' => '/appointments?tab=completed', // Changed from appointment details to appointments list
            ];
        } catch (\Throwable $e) {
            Log::error('Failed to build appointment completed database notification: ' . $e->getMessage(), ['exception' => $e]);
            return [
                'title' => 'Appointment Marked as Completed',
                'message' => 'Your appointment has been marked as completed. Please confirm if this is correct.',
                'appointment_id' => $this->appointment->id ?? null,
                'link' => '/appointments?tab=completed', // Changed this one too
            ];
        }
    }
}