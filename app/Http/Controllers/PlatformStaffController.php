<?php

namespace App\Http\Controllers;

use App\Models\PlatformStaff;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PlatformStaffController extends Controller
{
    public function index()
    {
        try {
            $staff = PlatformStaff::latest()->get()->map(function($staff) {
                return [
                    'id' => $staff->id,
                    'name' => $staff->name,
                    'role' => $staff->role,
                    'email' => $staff->email,
                    'phone' => $staff->phone ?? '',
                    'avatar' => $staff->avatar ? Storage::url($staff->avatar) : null,
                    'department' => $staff->department ?? '',
                    'office_location' => $staff->office_location ?? '',
                    'date_hired' => $staff->date_hired ? $staff->date_hired->format('Y-m-d') : null,
                    'status' => $staff->status ?? 'active'
                ];
            });

            return Inertia::render('Admin/PlatformStaff', [
                'initialStaff' => $staff,
                'success' => session('success')
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Admin/PlatformStaff', [
                'initialStaff' => [],
                'error' => 'Failed to load staff data'
            ]);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'email' => 'required|email|unique:platform_staff',
            'phone' => 'nullable|string|max:20',
            'department' => 'required|string|max:255',
            'office_location' => 'nullable|string|max:255',
            'date_hired' => 'required|date',
            'status' => 'required|in:active,inactive,on_leave,suspended'
        ]);

        $staff = PlatformStaff::create($validated);

        return response()->json($staff);
    }

    public function update(Request $request, PlatformStaff $staff)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'email' => 'required|email|unique:platform_staff,email,' . $staff->id,
            'phone' => 'nullable|string|max:20',
            'department' => 'required|string|max:255',
            'office_location' => 'nullable|string|max:255',
            'date_hired' => 'required|date',
            'status' => 'required|in:active,inactive,on_leave,suspended'
        ]);

        $staff->update($validated);

        return response()->json($staff);
    }

    public function updateAvatar(Request $request, PlatformStaff $staff)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048'
        ]);

        if ($staff->avatar) {
            Storage::disk('public')->delete($staff->avatar);
        }

        $path = $request->file('avatar')->store('staff-avatars', 'public');
        $staff->update(['avatar' => $path]);

        return response()->json([
            'avatar' => Storage::url($path)
        ]);
    }

    public function destroy(PlatformStaff $staff)
    {
        if ($staff->avatar) {
            Storage::disk('public')->delete($staff->avatar);
        }

        $staff->delete();
        return response()->json(['message' => 'Staff member deleted successfully']);
    }
}
