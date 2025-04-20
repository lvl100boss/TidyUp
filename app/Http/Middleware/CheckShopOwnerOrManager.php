<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\ShopStaffs;
use App\Models\Shop; // Assuming you might use Route Model Binding later

class CheckShopOwnerOrManager
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Ensure user is authenticated
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $user = Auth::user();

        // 4. Check if a ShopStaffs record exists for this user with position 'owner' or 'manager'
        $shopStaff = ShopStaffs::where('staff_id', $user->id)->first();
        $isOwnerOrManager = $shopStaff->isOwnerOrManager();

        // 5. Check if the user has the required role
        if ($isOwnerOrManager) {
            // User has the required role, proceed with the request
            return $next($request);
        }

        // 6. User does not have the required permission
        // redirect to shop.appointments
        return redirect()->route('shop.appointments');
    }
}
