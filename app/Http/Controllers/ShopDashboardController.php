<?php

namespace App\Http\Controllers;

use App\Models\Appointments;
use Illuminate\Http\Request;
use App\Models\Shop;
use App\Models\User;
use Inertia\Inertia;

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
        return Inertia::render('Shops/Dashboard', [
            'shop' => $shop,
            'user' => $user,
            'pendingAppointments' => $pendingAppointments,
            'upcomingAppointments' => $upcomingAppointments,
        ]);
    }
}
