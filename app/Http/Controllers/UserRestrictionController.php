<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserRestrictionController extends Controller
{
    public function index()
    {
        $restrictedUsers = DB::table('user_restrictions')
            ->join('users', 'user_restrictions.user_id', '=', 'users.id')
            ->whereNull('actual_lift_date')
            ->where('scheduled_lift_date', '>', now())
            ->select([
                'user_restrictions.id',
                'users.username',
                'user_restrictions.date_restricted',
                DB::raw('DATEDIFF(scheduled_lift_date, date_restricted) as duration'),
                'user_restrictions.restricted_by',
                'user_restrictions.reason',
                'users.first_name',
                'users.last_name',
                'users.email',
                'user_restrictions.scheduled_lift_date'
            ])
            ->orderBy('user_restrictions.date_restricted', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'username' => $user->username,
                    'dateRestricted' => $user->date_restricted,
                    'duration' => $user->duration . ' days',
                    'committedBy' => $user->restricted_by,
                    'reason' => $user->reason,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'scheduled_lift_date' => $user->scheduled_lift_date
                ];
            });

        return Inertia::render('Admin/Restriction', [
            'restrictedUsers' => $restrictedUsers
        ]);
    }
    
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
        ]);

        DB::table('user_restrictions')
            ->where('id', $request->restriction_id)
            ->update([
                'actual_lift_date' => now(),
                'lifted_by' => Auth::user()->username
            ]);

        return back()->with('success', 'Restriction lifted successfully');
    }
}