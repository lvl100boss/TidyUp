<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\ShopSubscription;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ShopSubscriptionController extends Controller
{
    /**
     * Display the subscription page with plans, current subscription, and history.
     */
    public function index(Request $request)
    {
        // Fetch the shop associated with the logged-in user
        $shop = Shop::where('user_id', Auth::id())->first();

        if (!$shop) {
            return redirect()->route('dashboard')->with('error', 'Shop not found');
        }

        // Fetch all active subscription plans
        $subscriptions = Subscription::where('status', 'active')->get();

        // Get the current active subscription for this shop
        $currentSubscription = ShopSubscription::with('subscription')
            ->where('shop_id', $shop->id)
            ->where('status', 'active')
            ->where('end_date', '>', Carbon::now())
            ->first();

        // Get subscription history
        $subscriptionHistory = ShopSubscription::with('subscription')
            ->where('shop_id', $shop->id)
            ->where(function ($query) {
                $query->where('status', '!=', 'active')
                    ->orWhere('end_date', '<=', Carbon::now());
            })
            ->orderBy('created_at', 'desc')
            ->get();

        // Pass data to the frontend
        return Inertia::render('Shops/Shop_Subscriptions', [
            'shop' => $shop,
            'subscriptionPlans' => $subscriptions,
            'currentSubscription' => $currentSubscription,
            'subscriptionHistory' => $subscriptionHistory,
        ]);
    }

    /**
     * Subscribe the shop to a new plan.
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
            'billing_cycle' => 'required|in:monthly,yearly',
        ]);
    
        $shop = Shop::where('user_id', Auth::id())->first();
    
        if (!$shop) {
            return redirect()->back()->with('error', 'Shop not found');
        }
    
        $subscription = Subscription::findOrFail($request->subscription_id);
    
        $startDate = Carbon::now();
        $endDate = Carbon::now();
    
        // Calculate the end date based on the billing cycle
        if ($request->billing_cycle === 'monthly') {
            $endDate->addMonth();
        } elseif ($request->billing_cycle === 'yearly') {
            $endDate->addYear();
        }
    
        // Cancel any active subscriptions
        ShopSubscription::where('shop_id', $shop->id)
            ->where('status', 'active')
            ->update(['status' => 'canceled']);
    
        // Create a new subscription
        $newSubscription = ShopSubscription::create([
            'shop_id' => $shop->id,
            'subscription_id' => $subscription->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => 'active',
            'billing_cycle' => $request->billing_cycle,
        ]);
        
        // For Inertia requests with XHR, return a redirect with flash data
        if ($request->wantsJson()) {
            return response()->json([
                'subscription' => [
                    'id' => $subscription->id,
                    'tier' => $subscription->tier,
                    'description' => $subscription->description,
                    'monthly_price' => $subscription->monthly_price,
                    'yearly_price' => $subscription->yearly_price,
                ],
                'start_date' => $startDate->toDateTimeString(),
                'end_date' => $endDate->toDateTimeString(),
                'billing_cycle' => $newSubscription->billing_cycle,
                'status' => $newSubscription->status,
            ]);
        }
        
        // Return to the subscription page with the new subscription data
        return redirect()->route('shop.subscriptions')->with([
            'success' => "Successfully subscribed to {$subscription->tier} ({$request->billing_cycle})",
            'newSubscription' => [
                'subscription' => $subscription,
                'start_date' => $startDate->toDateTimeString(),
                'end_date' => $endDate->toDateTimeString(),
                'billing_cycle' => $newSubscription->billing_cycle,
                'status' => $newSubscription->status,
            ]
        ]);
    }

    /**
     * Cancel the current active subscription for the shop.
     */
    public function cancel(Request $request)
    {
        // Fetch the shop associated with the logged-in user
        $shop = Shop::where('user_id', Auth::id())->first();

        if (!$shop) {
            return redirect()->route('dashboard')->with('error', 'Shop not found');
        }

        // Cancel the active subscription for the shop
        ShopSubscription::where('shop_id', $shop->id)
            ->where('status', 'active')
            ->update(['status' => 'canceled']);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Subscription canceled successfully'
            ]);
        }

        return redirect()->route('shop.subscriptions')->with('success', 'Subscription canceled successfully');
    }
}