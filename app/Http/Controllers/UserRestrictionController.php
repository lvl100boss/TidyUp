<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserRestrictionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'reason' => 'required|string',
            'duration' => 'required|integer',
        ]);
    
        $dateRestricted = now();
        $scheduledLiftDate = $dateRestricted->copy()->addDays($request->duration);
    
        DB::table('user_restrictions')->insert([
            'user_id' => $request->user_id,
            'date_restricted' => $dateRestricted,
            'scheduled_lift_date' => $scheduledLiftDate,
            'duration' => $request->duration,
            'role_id' => 2,
            'restricted_by' => Auth::user()->username,
            'reason' => $request->reason,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    
        return back()->with('success', 'User has been restricted');
    }

    public function lift(Request $request)
{
    $request->validate([
        'restriction_id' => 'required|exists:user_restrictions,id',
        'lift_reason' => 'required|string'
    ]);

    DB::table('user_restrictions')
        ->where('id', $request->restriction_id)
        ->update([
            'actual_lift_date' => now(),
            'lifted_by' => Auth::user()->username,
            'lift_reason' => $request->lift_reason
        ]);

    return back()->with('success', 'Restriction lifted successfully');
}
}