<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $subscriptions = Subscription::all();

        return Inertia::render('Admin/Subscription', [
            'subscriptions' => $subscriptions,
        ]);
    }

    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'tier' => 'required|string|max:255',
            'monthly_price' => 'nullable',
            'yearly_price' => 'nullable',
            'monthly_discount' => 'nullable|numeric|min:0|max:100',
            'yearly_discount' => 'nullable|numeric|min:0|max:100',
            'status' => 'required|in:active,inactive', // Add status validation
        ]);

        // Create the subscription
        $subscription = Subscription::create($validated);

        // Return the created subscription as JSON
        return response()->json($subscription);
    }

    public function update(Request $request, Subscription $subscription)
    {
        // Validate the request
        $validated = $request->validate([
            'tier' => 'required|string|max:255',
            'monthly_price' => 'required|numeric|min:0',
            'yearly_price' => 'required|numeric|min:0',
            'monthly_discount' => 'nullable|numeric|min:0|max:100',
            'yearly_discount' => 'nullable|numeric|min:0|max:100',
            'status' => 'required|in:active,inactive', // Add status validation
        ]);

        // Update the subscription
        $subscription->update($validated);

        // Return the updated subscription as JSON
        return response()->json($subscription);
    }

    public function destroy(Subscription $subscription)
    {
        // Delete the subscription
        $subscription->delete();

        // Return a success response
        return response()->json(['message' => 'Subscription plan deleted successfully.']);
    }
}
