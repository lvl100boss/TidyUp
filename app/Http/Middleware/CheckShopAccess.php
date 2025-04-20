<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckShopAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user) {
            // If user is not authenticated, redirect to login
            return redirect()->route('login');
        }

        // Eager load the userRole relationship to avoid N+1 issues if used frequently
        /** @var \App\Models\User $user */
        $user->load('userRole');

        if (!$user->userRole) {
            // Handle cases where user might not have a role assigned, redirect home
            return redirect('/');
        }

        $roleId = $user->userRole->role_id;

        // Allow Shop Owner (3) and Shop Staff (4)
        if ($roleId == 3 || $roleId == 4) {
            return $next($request);
        }

        // Redirect users with role ID 5 to shop setup
        if ($roleId == 5) {
            // Assuming you have a named route 'shop.setup'
            // If not, change '/shop/setup'
            return redirect()->route('shop.setup');
        }

        // Redirect Admin (1) and Platform Staff (2) to home
        if ($roleId == 1 || $roleId == 2) {
            return redirect('/');
        }

        // Fallback redirect for any other unexpected roles
        return redirect('/');
    }
}
