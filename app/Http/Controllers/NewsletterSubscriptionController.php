<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewsletterSubscription;

class NewsletterSubscriptionController extends Controller
{
    //
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletter_subscription,email',
        ]);

        NewsletterSubscription::create([
            'email' => $request->email,
        ]);

        return redirect()->back()->with('message', 'You have been subscribed to the newsletter')->with('success', true);
    }
}
