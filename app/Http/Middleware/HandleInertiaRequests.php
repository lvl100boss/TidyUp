<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user(); // Get authenticated user

        // Fetch notifications only if user is authenticated
        $notifications = collect(); // Default to empty collection
        if ($user) {
            // Assuming User model uses Notifiable trait
            $notifications = $user->notifications()
                ->latest()
                ->limit(15) // Adjust limit as needed
                ->get()
                ->map(function ($notification) {
                    // Map to ensure consistent structure passed to frontend
                    return [
                        'id' => $notification->id,
                        'type' => $notification->type, // Notification class name
                        'data' => $notification->data, // Array from toDatabase()
                        'read_at' => $notification->read_at,
                        'created_at' => $notification->created_at,
                    ];
                });
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'userRole' => $request->user()?->userRole,
                'notifications' => $notifications, // Add notifications here
            ],
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
                'success' => fn() => $request->session()->get('success'),
            ],
            'shops' => fn() => \App\Models\Shop::select('id', 'shop_name', 'shop_photo')->get(),
        ];
    }
}
