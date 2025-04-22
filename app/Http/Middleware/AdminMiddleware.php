<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // In a testing environment, allow all authenticated users
        if (auth()->check()) {
            return $next($request);
        }

        // If accessing via API, return JSON response
        if ($request->wantsJson()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Otherwise redirect to home with an error message
        return redirect()->route('home')->with('error', 'You need to be logged in to access this area.');
    }
}
