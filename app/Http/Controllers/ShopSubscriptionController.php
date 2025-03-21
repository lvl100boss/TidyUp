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
    public function index(Request $request)
    {
        $shop = Shop::where('user_id', Auth::id())->first();

        
        if (!$shop) {
            return redirect()->route('dashboard')->with('error', 'Shop not found');
        }
        
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
            ->where(function($query) {
                $query->where('status', '!=', 'active')
                    ->orWhere('end_date', '<=', Carbon::now());
            })
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Shops/Subscriptions', [
            'shop' => $shop,
            'subscriptionPlans' => $subscriptions,
            'currentSubscription' => $currentSubscription,
            'subscriptionHistory' => $subscriptionHistory
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
            'payment_method' => 'required|string',
        ]);
        
        $shop = Shop::where('user_id', auth::id())->first();
        
        if (!$shop) {
            return redirect()->route('dashboard')
                ->with('error', 'Shop not found');
        }
        
        $subscription = Subscription::findOrFail($request->subscription_id);
        
        // Calculate end date based on subscription duration
        $startDate = Carbon::now();
        $endDate = Carbon::now();
        
        switch ($subscription->duration_unit) {
            case 'days':
                $endDate->addDays($subscription->duration);
                break;
            case 'months':
                $endDate->addMonths($subscription->duration);
                break;
            case 'years':
                $endDate->addYears($subscription->duration);
                break;
        }
        
        // Cancel any active subscriptions
        ShopSubscription::where('shop_id', $shop->id)
            ->where('status', 'active')
            ->update(['status' => 'canceled']);
        
        // Create new subscription
        ShopSubscription::create([
            'shop_id' => $shop->id,
            'subscription_id' => $subscription->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => 'active',
            'payment_method' => $request->payment_method,
            'payment_id' => $request->payment_id ?? null,
        ]);
        
        return redirect()->route('shop.subscriptions')
            ->with('success', "Successfully subscribed to {$subscription->name}");
    }

    public function cancel(Request $request)
    {
        $shop = Shop::where('user_id', Auth::id())->first();
        
        if (!$shop) {
            return redirect()->route('dashboard')
                ->with('error', 'Shop not found');
        }
        
        ShopSubscription::where('shop_id', $shop->id)
            ->where('status', 'active')
            ->update(['status' => 'canceled']);
        
        return redirect()->route('shop.subscriptions')
            ->with('success', 'Subscription canceled successfully');
    }
}