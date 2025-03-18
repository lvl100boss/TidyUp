<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // DEVELOPMENT MODE - Bypass admin check for testing
        // TODO: REMOVE THIS IN PRODUCTION!
        if (config('app.env') === 'local') {
            Log::info('Admin middleware bypassed in development mode', [
                'user_id' => Auth::id(),
                'path' => $request->path()
            ]);
            return $next($request);
        }

        // Check if user is logged in
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // Check if user is an admin (role_id = 1) or has any role_id for testing
        if (Auth::user()->userRole && (Auth::user()->userRole->role_id == 1 || config('app.env') === 'local')) {
            return $next($request);
        }

        // If not an admin, redirect to home with error message
        return redirect()->route('home')->with('error', 'You do not have permission to access the admin area.');
    }
}
