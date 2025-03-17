<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRestriction
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {  // Changed from auth()->check()
            $restriction = DB::table('user_restrictions')
                ->where('user_id', Auth::id())  // Changed from auth()->id()
                ->whereNull('actual_lift_date')
                ->where('scheduled_lift_date', '>', Carbon::now())
                ->first();

            if ($restriction) {
                Auth::logout();
                
                return redirect()->route('login')->with('error', 
                    "Your account is restricted until " . 
                    Carbon::parse($restriction->scheduled_lift_date)->format('M d, Y') . 
                    ". Reason: " . $restriction->reason
                );
            }
        }

        return $next($request);
    }
}