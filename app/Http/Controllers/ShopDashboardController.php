<?php

namespace App\Http\Controllers;

use App\Models\ShopStaffs;
use App\Models\Shop;
use App\Models\User;
use App\Services\ShopDashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ShopDashboardController extends Controller
{
    protected $shopDashboardService;

    public function __construct(ShopDashboardService $shopDashboardService)
    {
        $this->shopDashboardService = $shopDashboardService;
    }

    public function index()
    {
        $userId = Auth::id();

        try {
            // Check if the user has the shop owner role (role_id = 3)
            $user = User::with('userRole')->find($userId);
            $isShopOwner = $user && $user->userRole && $user->userRole->role_id == 3;

            // Find the shop staff record for the current user
            $staffRecord = ShopStaffs::where('staff_id', $userId)->first();

            if (!$staffRecord) {
                Log::warning('User has no shop staff record', ['user_id' => $userId]);
                return redirect()->route('home')->with('error', 'You do not have a shop associated with your account. Please set up your shop first.');
            }

            // Find the shop
            $shop = Shop::find($staffRecord->shop_id);

            if (!$shop) {
                Log::error('Shop not found for staff record', [
                    'staff_id' => $staffRecord->id,
                    'shop_id' => $staffRecord->shop_id ?? 'null'
                ]);
                return redirect()->route('home')->with('error', 'Shop not found. Please contact support.');
            }

            // Get dashboard data from service
            $data = $this->shopDashboardService->getShopData($userId);

            // If we have data, render the dashboard
            if ($data && isset($data['shop'])) {
                // Add shop owner status to data based on database role_id
                $data['isOwner'] = $isShopOwner;

                // Add shop verification status warning if needed
                if ($shop->status !== 'verified') {
                    $data['shopStatusMessage'] = [
                        'status' => $shop->status,
                        'message' => $shop->status === 'processing'
                            ? 'Your shop is currently under review. You have access to your dashboard, but your shop is not visible to customers yet.'
                            : 'Your shop registration was rejected. Please contact support for assistance.',
                        'reason' => $shop->rejection_reason
                    ];
                }

                return Inertia::render('Shops/Dashboard', $data);
            } else {
                Log::error('Failed to get shop data', ['user_id' => $userId, 'error' => $data['error'] ?? 'Unknown error']);
                return redirect()->route('home')->with('error', $data['error'] ?? 'Unable to load shop data.');
            }
        } catch (\Exception $e) {
            Log::error('Exception in shop dashboard', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $userId
            ]);
            return redirect()->route('home')->with('error', 'An unexpected error occurred. Please try again later.');
        }
    }
}
