<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class EnsureVerifiedIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Allow guests to access everything
        if (!Auth::check()) {
            return $next($request);
        }

        // If logged in but not verified, redirect to email verification page
        if (!Auth::user() || !Auth::user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail || !Auth::user()->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }

        return $next($request);
    }
}
