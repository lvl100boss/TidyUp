<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\ShopStaffs;
use App\Models\Appointments;
use App\Models\ShopServiceCategories;
use App\Models\UserAppointments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use Throwable;
use Barryvdh\DomPDF\Facade\Pdf; // Import the PDF facade
use Illuminate\Support\Facades\View; // Import View facade

class ShopAnalyticsController extends Controller
{
    // --- Helper method to get analytics data ---
    private function getAnalyticsData(Request $request, Shop $shop)
    {
        $selectedYear = $request->input('year', now()->year);
        $totalAppointments = Appointments::where('shop_id', $shop->id)->count();
        $appointmentStats = [
            'completed' => Appointments::where('shop_id', $shop->id)
                ->where('status', 'completed')
                ->count(),
            'pending' => Appointments::where('shop_id', $shop->id)
                ->where('status', 'pending')
                ->count(),
            'upcoming' => Appointments::where('shop_id', $shop->id)
                ->where('status', 'upcoming')
                ->count(),
            'cancelled' => Appointments::where('shop_id', $shop->id)
                ->where('status', 'cancelled')
                ->count(),
            'declined' => Appointments::where('shop_id', $shop->id)
                ->where('status', 'declined')
                ->count(),
            'no_show' => Appointments::where('shop_id', $shop->id)
                ->where('status', 'no-show')
                ->count()
        ];

        $totalStaff = ShopStaffs::where('shop_id', $shop->id)
            ->where('is_active', true)
            ->count();
        $totalServices = ShopServiceCategories::where('shop_id', $shop->id)->count();

        $totalRevenue = Appointments::where('shop_id', $shop->id)
            ->where('status', 'completed')
            ->sum('total_price') ?? 0;

        $monthlyRevenue = Appointments::where('shop_id', $shop->id)
            ->where('status', 'completed')
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('total_price') ?? 0;

        $monthlyRevenueTotals = [];
        $monthlyRevenueByMonth = collect(range(1, 12))->map(fn($month) => ['month' => $month, 'revenue' => 0.0]);

        try {
            Log::info("Fetching monthly revenue for shop {$shop->id}, year {$selectedYear}");

            $monthlyRevenueTotals = Appointments::where('shop_id', $shop->id)
                ->where('status', 'completed')
                ->whereYear('date', $selectedYear)
                ->selectRaw('MONTH(date) as month, SUM(CAST(total_price AS DECIMAL(10, 2))) as revenue')
                ->groupBy('month')
                ->orderBy('month')
                ->pluck('revenue', 'month')
                ->all();

            Log::info("Raw monthly revenue totals for {$selectedYear}: ", $monthlyRevenueTotals);

            $monthlyRevenueByMonth = collect(range(1, 12))->map(function ($month) use ($monthlyRevenueTotals) {
                return [
                    'month' => $month,
                    'revenue' => (float) ($monthlyRevenueTotals[$month] ?? 0)
                ];
            });
        } catch (Throwable $e) {
            Log::error("Error fetching monthly revenue for shop {$shop->id}, year {$selectedYear}: " . $e->getMessage(), [
                'exception' => $e
            ]);
        }

        $yearlyTotals = collect();
        try {
            $years = DB::table('appointments')
                ->where('shop_id', $shop->id)
                ->where('status', 'completed')
                ->whereNotNull('total_price')
                ->selectRaw('DISTINCT YEAR(date) as year')
                ->orderBy('year', 'asc')
                ->pluck('year')
                ->toArray();

            if (!in_array(now()->year, $years)) {
                $years[] = now()->year;
                sort($years);
            }

            $yearlyTotals = collect($years)->map(function ($year) use ($shop) {
                $revenue = DB::table('appointments')
                    ->where('shop_id', $shop->id)
                    ->where('status', 'completed')
                    ->whereYear('date', $year)
                    ->sum(DB::raw('CAST(total_price AS DECIMAL(10, 2))'));

                return [
                    'year' => (int) $year,
                    'revenue' => (float) ($revenue ?: 0)
                ];
            })->values();
        } catch (Throwable $e) {
            Log::error("Error fetching yearly revenue totals for shop {$shop->id}: " . $e->getMessage(), [
                'exception' => $e
            ]);
            $years = [$selectedYear];
        }

        $weeklyRevenue = collect();
        try {
            $startDate = now()->subDays(6)->startOfDay();
            $endDate = now()->endOfDay();

            $revenueData = Appointments::where('shop_id', $shop->id)
                ->where('status', 'completed')
                ->whereBetween('date', [$startDate, $endDate])
                ->selectRaw('DATE(date) as day_date, SUM(CAST(total_price AS DECIMAL(10, 2))) as revenue')
                ->groupBy('day_date')
                ->orderBy('day_date')
                ->pluck('revenue', 'day_date')
                ->all();

            $weeklyRevenue = collect(range(0, 6))->map(function ($day) use ($revenueData) {
                $date = now()->subDays($day);
                $dateString = $date->toDateString();
                return [
                    'date' => $date->format('D'),
                    'revenue' => (float) ($revenueData[$dateString] ?? 0.0)
                ];
            })->reverse()->values();

            Log::info('Weekly Revenue Data (Refined Query) for Shop ' . $shop->id . ':', $weeklyRevenue->toArray());
        } catch (Throwable $e) {
            Log::error("Error fetching weekly revenue for shop {$shop->id}: " . $e->getMessage(), [
                'exception' => $e
            ]);
            $weeklyRevenue = collect();
        }

        $uniqueCustomers = Appointments::where('shop_id', $shop->id)
            ->distinct('user_id')
            ->count('user_id');

        $repeatCustomers = Appointments::where('shop_id', $shop->id)
            ->select('user_id', DB::raw('count(*) as appointment_count'))
            ->groupBy('user_id')
            ->having('appointment_count', '>', 1)
            ->count();

        $peakHours = Appointments::where('shop_id', $shop->id)
            ->select(DB::raw('HOUR(time) as hour'), DB::raw('count(*) as count'))
            ->groupBy('hour')
            ->orderBy('count', 'desc')
            ->limit(3)
            ->get();

        $popularServices = ShopServiceCategories::where('shop_id', $shop->id)
            ->withCount(['appointmentServices as service_count'])
            ->orderBy('service_count', 'desc')
            ->limit(5)
            ->get();

        $staffPerformance = ShopStaffs::where('shop_id', $shop->id)
            ->where('is_active', true)
            ->with(['staff', 'appointments.appointment'])
            ->get()
            ->map(function ($staff) {
                $ratedAppointmentsPivot = $staff->appointments->filter(function ($userAppointmentPivot) {
                    return $userAppointmentPivot->appointment
                        && $userAppointmentPivot->appointment->status === 'completed'
                        && $userAppointmentPivot->appointment->rating !== null;
                });

                $avgRating = $ratedAppointmentsPivot->avg(function ($userAppointmentPivot) {
                    return $userAppointmentPivot->appointment->rating;
                });

                $completedAppointmentsPivot = $staff->appointments->filter(function ($userAppointmentPivot) {
                    return $userAppointmentPivot->appointment && $userAppointmentPivot->appointment->status === 'completed';
                });

                return [
                    'id' => $staff->id,
                    'first_name' => $staff->staff->first_name ?? '',
                    'last_name' => $staff->staff->last_name ?? '',
                    'name' => trim(($staff->staff->first_name ?? '') . ' ' . ($staff->staff->last_name ?? '')),
                    'position' => $staff->position,
                    'role' => $staff->role,
                    'completed_appointments' => $completedAppointmentsPivot->count(),
                    'rating' => $avgRating !== null ? round($avgRating, 1) : 0,
                ];
            })
            ->sortByDesc('completed_appointments')
            ->values();

        return [
            'basicStats' => [
                'totalAppointments' => $totalAppointments,
                'appointmentStats' => $appointmentStats,
                'totalStaff' => $totalStaff,
                'totalServices' => $totalServices,
            ],
            'revenueStats' => [
                'totalRevenue' => $totalRevenue,
                'monthlyRevenue' => $monthlyRevenue,
                'yearlyTotals' => $yearlyTotals,
                'monthlyRevenueByMonth' => $monthlyRevenueByMonth,
                'weeklyRevenue' => $weeklyRevenue,
                'availableYears' => $years,
                'selectedYear' => (int) $selectedYear
            ],
            'customerStats' => [
                'uniqueCustomers' => $uniqueCustomers,
                'repeatCustomers' => $repeatCustomers,
            ],
            'peakHours' => $peakHours,
            'popularServices' => $popularServices,
            'staffPerformance' => $staffPerformance,
        ];
    }

    public function index(Request $request)
    {
        $shop = null;
        $user = Auth::user();

        $currentStaff = ShopStaffs::where('staff_id', $user->id)->first();
        if ($currentStaff) {
            $shop = Shop::find($currentStaff->shop_id);
        }

        if (!$shop) {
            $ownedShop = Shop::where('user_id', $user->id)->first();
            if ($ownedShop) {
                $shop = $ownedShop;
            }
        }

        if (!$shop) {
            abort(403, 'User is not associated with any shop or shop not found.');
        }

        $isStaff = ShopStaffs::where('staff_id', $user->id)->where('shop_id', $shop->id)->exists();
        $isOwner = ($shop->user_id === $user->id);
        if (!$isStaff && !$isOwner) {
            abort(403, 'User is not authorized for this shop.');
        }

        $analyticsData = $this->getAnalyticsData($request, $shop);

        return Inertia::render('Shops/Analytics/AnalyticsPage', [
            'shop' => $shop,
            'analytics' => $analyticsData
        ]);
    }

    public function downloadPdf(Request $request)
    {
        $shop = null;
        $user = Auth::user();
        $currentStaff = ShopStaffs::where('staff_id', $user->id)->first();
        if ($currentStaff) {
            $shop = Shop::find($currentStaff->shop_id);
        }
        if (!$shop) {
            $ownedShop = Shop::where('user_id', $user->id)->first();
            if ($ownedShop) {
                $shop = $ownedShop;
            }
        }
        if (!$shop) {
            abort(403, 'User is not associated with any shop or shop not found.');
        }

        $isStaff = ShopStaffs::where('staff_id', $user->id)->where('shop_id', $shop->id)->exists();
        $isOwner = ($shop->user_id === $user->id);
        if (!$isStaff && !$isOwner) {
            abort(403, 'User is not authorized for this shop.');
        }

        $analyticsData = $this->getAnalyticsData($request, $shop);

        $data = [
            'shop' => $shop,
            'analytics' => $analyticsData,
        ];

        try {
            $pdf = Pdf::loadView('pdfs.shop_analytics', $data);

            $filename = 'analytics-report-' . $shop->shop_name . '-' . now()->format('Ymd') . '.pdf';

            return $pdf->download($filename);
        } catch (Throwable $e) {
            Log::error("Error generating PDF for shop {$shop->id}: " . $e->getMessage(), [
                'exception' => $e
            ]);
            return redirect()->route('shop.analytics')->with('error', 'Failed to generate PDF report.');
        }
    }
}
