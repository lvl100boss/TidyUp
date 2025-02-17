<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ManageStaffController extends Controller
{
    public function index()
    {
        $user_id = Auth::user()->id;
        $shop = Shop::with('staffs.staff')->where('user_id', $user_id)->first();
        $staffs = $shop->staffs;
        return Inertia::render('Shops/ManageStaff', [
            'staffs' => $staffs
        ]);
    }

    public function store(Request $request)
    {
        dd($request->all());

        $request->validate([
            'staff_id' => 'required|exists:users,id',
            'role' => 'required|in:owner,staff,manager',
            'position' => 'nullable|string',
            'is_active' => 'required|boolean',
            'started_at' => 'nullable|date',
            'ended_at' => 'nullable|date',
        ]);

        $user_id = Auth::user()->id;
        $shop = Shop::where('user_id', $user_id)->first();
        $shop->staffs()->create($request->all());

        return redirect()->route('shop.manage.staff');
    }
}
