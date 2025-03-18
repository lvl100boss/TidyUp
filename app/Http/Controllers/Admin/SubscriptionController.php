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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'duration_unit' => 'required|in:days,months,years',
            'status' => 'required|in:active,inactive',
        ]);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
    
        Subscription::create($request->all());
        
        // Get all subscriptions after creating the new one
        $subscriptions = Subscription::all();
    
        return redirect()->route('admin.subscriptions.index')
            ->with('success', 'Subscription plan created successfully.')
            ->with('subscriptions', $subscriptions); // Pass updated subscriptions
    }

    public function update(Request $request, Subscription $subscription)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'duration_unit' => 'required|in:days,months,years',
            'status' => 'required|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $subscription->update($request->all());

        $subscriptions = Subscription::all();

        return redirect()->route('admin.subscriptions.index')
            ->with('success', 'Subscription plan updated successfully.')
            ->with('subscriptions', $subscriptions); // Pass updated subscriptions
    }

    public function destroy(Subscription $subscription)
    {
        $subscription->delete();
        
        // Get all subscriptions after deleting
        $subscriptions = Subscription::all();
    
        return redirect()->route('admin.subscriptions.index')
            ->with('success', 'Subscription plan deleted successfully.')
            ->with('subscriptions', $subscriptions); // Pass updated subscriptions
    }
}