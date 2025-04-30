<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {

        $userRole = Auth::user()->userRole->role_id;
        // Check if the user has the 'is_admin' attribute set to true
        if ($userRole === 1) {
            // If the user is an admin, allow access
            return $next($request);
        }
        // If the user is not an admin, redirect to home
        // with an error message

        // Otherwise redirect to home with an error message
        return redirect()->route('home')->with('error', 'You need to be logged in to access this area.');
    }
}
