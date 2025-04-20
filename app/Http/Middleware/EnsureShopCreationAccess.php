<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureShopCreationAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $userRole = Auth::user()->userRole->role_id;

        // Redirect shop owners to their dashboard
        if ($userRole == 3) {
            return redirect()->route('shop.dashboard');
        }

        // Redirect admins to admin dashboard
        if ($userRole == 1 || $userRole == 2) {
            return redirect()->route('admin.dashboard');
        }

        // Redirect non-shop owners to appointments
        if ($userRole != 5) {
            return redirect()->route('shop.appointments');
        }

        return $next($request);
    }
}
