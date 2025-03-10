<?php

namespace App\Services;

use App\Models\Appointments;
use App\Models\Shop;
use App\Models\ShopStaffs;
use App\Models\User;

class ShopDashboardService
{
    public function getShopData($userId)
    {
        $user = User::find($userId);
        $shopStaff = ShopStaffs::where('staff_id', $user->id)->first();
        $shop = $shopStaff->shop;
        $shop = $shop->load('appointments.user.appointmentServices.shopService');

        return [
            'shop' => $shop,
            'user' => $user,
            'pendingAppointments' => $this->getPendingAppointments($shop->id),
            'upcomingAppointments' => $this->getUpcomingAppointments($shop->id),
            'popularServices' => $this->getPopularServices($shop->id),
            'completedBookingsCount' => $this->getCompletedBookingsCount($shop->id),
            'completedBookingsChange' => $this->getCompletedBookingsChange($shop->id),
            'totalRevenue' => $this->getTotalRevenue($shop->id),
            'revenueChange' => $this->getRevenueChange($shop->id),
        ];
    }

    private function getPendingAppointments($shopId)
    {
        return Appointments::with('user.appointmentServices.shopService')
            ->with('userAppointments.staff.staff')
            ->where('shop_id', $shopId)
            ->where('status', 'pending')
            ->where('created_at', '<', now())
            ->orderBy('date')
            ->orderBy('time')
            ->where('is_successful', 1)
            ->get();
    }

    private function getUpcomingAppointments($shopId)
    {
        return Appointments::with('user.appointmentServices.shopService')
            ->with('userAppointments.staff.staff')
            ->where('shop_id', $shopId)
            ->where('date', '>', now())
            ->where('status', 'upcoming')
            ->orderBy('date')
            ->orderBy('time')
            ->get();
    }

    private function getCompletedBookingsCount($shopId)
    {
        return Appointments::where('shop_id', $shopId)
            ->where('status', 'completed')
            ->count();
    }

    private function getCompletedBookingsChange($shopId)
    {
        // Current month completed bookings
        $currentMonthCount = Appointments::where('shop_id', $shopId)
            ->where('status', 'completed')
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->count();
        // Previous month completed bookings
        $previousMonthCount = Appointments::where('shop_id', $shopId)
            ->where('status', 'completed')
            ->whereMonth('date', now()->subMonth()->month)
            ->whereYear('date', now()->subMonth()->year)
            ->count();
        // Calculate percentage change
        $percentChange = 0;
        if ($previousMonthCount > 0) {
            $percentChange = (($currentMonthCount - $previousMonthCount) / $previousMonthCount) * 100;
        }

        return $percentChange;
    }

    private function getPopularServices($shopId)
    {
        $popularServices = Appointments::with('appointmentServices.shopService')
            ->where('shop_id', $shopId)
            ->whereIn('status', ['completed', 'upcoming'])
            ->get();

        return $this->calculatePopularServices($popularServices);
    }

    private function calculatePopularServices($appointments)
    {
        $servicesCount = [];
        $servicesData = [];

        foreach ($appointments as $appointment) {
            foreach ($appointment->appointmentServices as $service) {
                $serviceId = $service->shopService->id;

                if (!isset($servicesCount[$serviceId])) {
                    $servicesCount[$serviceId] = 0;
                    $servicesData[$serviceId] = $service->shopService;
                }

                $servicesCount[$serviceId]++;
            }
        }

        arsort($servicesCount);

        $popularServicesList = [];
        foreach ($servicesCount as $id => $count) {
            $popularServicesList[] = [
                'service' => $servicesData[$id],
                'count' => $count
            ];
        }

        return $popularServicesList;
    }

    private function getTotalRevenue($shopId)
    {
        $appointments = Appointments::with('appointmentServices.shopService')
            ->where('shop_id', $shopId)
            ->where('status', 'completed')
            ->get();

        $totalRevenue = 0;

        foreach ($appointments as $appointment) {
            foreach ($appointment->appointmentServices as $appointmentService) {
                $totalRevenue += $appointmentService->shopService->cost;
            }
        }

        return $totalRevenue;
    }

    private function getRevenueChange($shopId)
    {
        // Current month appointments
        $currentMonthAppointments = Appointments::with('appointmentServices.shopService')
            ->where('shop_id', $shopId)
            ->where('status', 'completed')
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->get();

        // Previous month appointments
        $previousMonthAppointments = Appointments::with('appointmentServices.shopService')
            ->where('shop_id', $shopId)
            ->where('status', 'completed')
            ->whereMonth('date', now()->subMonth()->month)
            ->whereYear('date', now()->subMonth()->year)
            ->get();

        // Calculate current month revenue
        $currentMonthRevenue = 0;
        foreach ($currentMonthAppointments as $appointment) {
            foreach ($appointment->appointmentServices as $appointmentService) {
                $currentMonthRevenue += $appointmentService->shopService->cost;
            }
        }

        // Calculate previous month revenue
        $previousMonthRevenue = 0;
        foreach ($previousMonthAppointments as $appointment) {
            foreach ($appointment->appointmentServices as $appointmentService) {
                $previousMonthRevenue += $appointmentService->shopService->cost;
            }
        }
        // Calculate percentage change
        $percentChange = 0;
        if ($previousMonthRevenue > 0) {
            $percentChange = (($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100;
        }

        return $percentChange;
    }
}
