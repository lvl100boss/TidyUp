<?php

namespace App\Http\Controllers;

use App\Models\Appointments;
use Illuminate\Http\Request;
use App\Models\Shop;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Collection;

class ShopDashboardController extends Controller
{
    //
    public function index()
    {
        $user = User::find(auth()->id());

        $shop = Shop::with(['appointments' => function ($query) {
            $query->where('status', 'pending')->where('is_successful', 1);
        }, 'appointments.user.appointmentServices.shopService'])->where('user_id', $user->id)->first();
        $appointments = $shop->appointments;
        $pendingAppointments = $appointments;

        $upcomingAppointments = Appointments::with(
            'user.appointmentServices.shopService',
        )->where('shop_id', $shop->id)
            ->where('date', '>', now())
            ->where('status', 'upcoming')
            ->orderBy('date')
            ->get();

        $popularServices = Appointments::with('appointmentServices.shopService')
            ->where('shop_id', $shop->id)
            ->where('status', ['completed', 'upcoming', 'started'])
            ->get();

        // Extract popular services
        $servicesCount = [];
        $servicesData = [];

        foreach ($popularServices as $appointment) {
            foreach ($appointment->appointmentServices as $service) {
                $serviceId = $service->shopService->id;

                // Count occurrences of each service
                if (!isset($servicesCount[$serviceId])) {
                    $servicesCount[$serviceId] = 0;
                    $servicesData[$serviceId] = $service->shopService;
                }

                $servicesCount[$serviceId]++;
            }
        }

        // Sort by popularity (count) in descending order
        arsort($servicesCount);

        // Create the final popular services array with service details and count
        $popularServicesList = [];
        foreach ($servicesCount as $id => $count) {
            $popularServicesList[] = [
                'service' => $servicesData[$id],
                'count' => $count
            ];
        }

        return Inertia::render('Shops/Dashboard', [
            'shop' => $shop,
            'user' => $user,
            'pendingAppointments' => $pendingAppointments,
            'upcomingAppointments' => $upcomingAppointments,
            'popularServices' => $popularServicesList,
        ]);
    }
}
