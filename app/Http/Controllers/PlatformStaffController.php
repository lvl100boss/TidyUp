<?php

namespace App\Http\Controllers;

use App\Models\PlatformStaff;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PlatformStaffController extends Controller
{
    public function index()
    {
        $user = User::find(auth()->id());
        $platformStaffs = PlatformStaff::with('user')->get();
        $userRole = $user->userRole()->first();

        if ($userRole->role_id === true) {
            $isAdmin = true;
        } else {
            $isAdmin = false;
        }

        return Inertia::render('Admin/PlatformStaff', [
            'staffs' => $platformStaffs,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function create()
    {


        $user = User::find(auth()->id());
        $platformStaffs = PlatformStaff::with('user')->get();
        $userRole = $user->userRole()->first();

        if ($userRole->role_id === 1) {
            $isAdmin = true;
        } else {
            $isAdmin = false;
        }
        
        return Inertia::render(
            'Admin/CreatePlatformStaff',
            [
                'isAdmin' => $isAdmin,
            ]
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'position' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'date_of_birth' => ['required', 'date'],
            'gender' => ['required', 'string', Rule::in(['Male', 'Female'])],
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*?&#]/',
                'confirmed',
            ],
            'is_active' => ['required', 'boolean'],
            'profile_photo_path' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:24048'],
            'contact_number' => ['nullable', 'string', 'max:255'],
        ], [
            'username.unique' => 'This username is already taken.',
            'email.unique' => 'This email address is already registered.',
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ]);

        try {
            DB::beginTransaction();
            $user = User::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'date_of_birth' => $validated['date_of_birth'],
                'gender' => $validated['gender'],
                'password' => Hash::make($validated['password']),
                'contact_number' => $validated['contact_number'] ?? null,
                'email_verified_at' => now(),
            ]);

            // Save the user to the database before handling the profile photo
            $user->save();

            if ($request->hasFile('profile_photo_path')) {
                // Store the uploaded file and get the path
                $path = $request->file('profile_photo_path')->store('profile-photos', 'public');
                $user->profile_photo_path = $path;
                $user->save(); // Save the user again to store the profile photo path
            }
            
            $platformStaff = PlatformStaff::create([
                'user_id' => $user->id,
                'position' => $validated['position'],
                'is_active' => $validated['is_active'] === "1" ? true : false,
                'started_at' => now(),
            ]);

            // Remove this debug line that stops execution
            // dd($platformStaff);

            // Assign admin role to platform staff
            $user->userRole()->create([
                'user_id' => $user->id,
                'role_id' => 2, // assuming 2 is platform staff role
            ]);

            DB::commit();
            // Use the route helper instead of hardcoded URL
            return redirect()->route('admin.platform-staff')->with('message', 'Platform staff member added successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.platform-staff.create')->with('message', 'Failed to add platform staff member: ' . $e->getMessage())->with('success', false);
        }
    }

    public function edit($id)
    {
        $platformStaff = PlatformStaff::with('user')->where('id', $id)->firstOrFail();
        $user = User::find(auth()->id());
        $platformStaffs = PlatformStaff::with('user')->get();
        $userRole = $user->userRole()->first();

        if ($userRole->role_id === 1) {
            $isAdmin = true;
        } else {
            $isAdmin = false;
        }

        return Inertia::render('Admin/EditPlatformStaff', [
            'staff' => [
                'id' => $platformStaff->id,
                'position' => $platformStaff->position,
                'first_name' => $platformStaff->user->first_name,
                'last_name' => $platformStaff->user->last_name,
                'username' => $platformStaff->user->username,
                'email' => $platformStaff->user->email,
                'date_of_birth' => $platformStaff->user->date_of_birth,
                'gender' => $platformStaff->user->gender,
                'is_active' => $platformStaff->is_active,
                'profile_photo_path' => $platformStaff->user->profile_photo_path,
                'contact_number' => $platformStaff->user->contact_number,
            ],
            'isAdmin' => $isAdmin,
        ]);
    }

    public function update(Request $request, $id)
    {
        $platformStaff = PlatformStaff::with('user')->findOrFail($id);
        $validated = $request->validate([
            'position' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($platformStaff->user->id)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($platformStaff->user->id)],
            'date_of_birth' => ['required', 'date'],
            'gender' => ['required', 'string', Rule::in(['Male', 'Female'])],
            'is_active' => ['required', 'boolean'],
            'password' => [
                'nullable',
                'string',
                'min:8',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*?&#]/',
                'confirmed',
            ],
            'profile_photo_path' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:24048'],
            'contact_number' => ['nullable', 'string', 'max:255'],
        ], [
            'username.unique' => 'This username is already taken.',
            'email.unique' => 'This email address is already registered.',
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ]);

        try {
            DB::beginTransaction();

            $userData = [
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'date_of_birth' => $validated['date_of_birth'],
                'gender' => $validated['gender'],
                'contact_number' => $validated['contact_number'] ?? null,
            ];

            if ($request->hasFile('profile_photo_path')) {
                // Store the uploaded file and get the path
                $path = $request->file('profile_photo_path')->store('profile-photos', 'public');
                $userData['profile_photo_path'] = $path;
            }

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $platformStaff->user->update($userData);

            $platformStaff->update([
                'position' => $validated['position'],
                'is_active' => $validated['is_active'] === "1" ? true : false,
            ]);

            DB::commit();
            return redirect('/admin/platform-staff')->with('message', 'Platform staff information updated successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('message', 'Failed to update platform staff information')->with('success', false);
        }
    }

    public function destroy(Request $request, $id)
    {
        // Validate that the password field is provided
        $request->validate([
            'password' => 'required',
        ]);
        
        try {
            if ($request->password === null) {
                return back()->withErrors(['password' => 'The password is required.'])->with('message', "Failed to Delete Platform Staff.")->with('success', false);
            }
            
            if (!Hash::check($request->password, Auth::user()->password)) {
                return back()->withErrors(['password' => 'The password is incorrect.'])->with('message', "You've entered an incorrect password.")->with('success', false);
            }
            
            // Find the platform staff record
            $platformStaff = PlatformStaff::findOrFail($id);
            
            // Check that the user is an admin
            if (!auth()->user()->hasRole('admin')) {
                return back()->withErrors(['password' => 'You are not allowed to delete this platform staff.'])->with('message', "You are not allowed to delete this platform staff.")->with('success', false);
            }
            
            // Mark as inactive and set end date before soft delete
            $platformStaff->update([
                'is_active' => false,
                'ended_at' => now()
            ]);
            
            $platformStaff->delete();
            
            return redirect()->route('admin.platform-staff')->with('message', 'Platform staff deleted successfully.')->with('success', true);
        } catch (\Exception $e) {
            return back()->with('message', 'Failed to delete platform staff.')->with('success', false);
        }
    }
    
    public function updateAvatar(Request $request, $id)
    {
        $platformStaff = PlatformStaff::with('user')->findOrFail($id);
        
        $request->validate([
            'profile_photo_path' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:24048'],
        ]);

        try {
            if ($request->hasFile('profile_photo_path')) {
                $path = $request->file('profile_photo_path')->store('profile-photos', 'public');
                $platformStaff->user->update([
                    'profile_photo_path' => $path
                ]);
                
                return back()->with('message', 'Avatar updated successfully')->with('success', true);
            }
            
            return back()->with('message', 'No file uploaded')->with('success', false);
        } catch (\Exception $e) {
            return back()->with('message', 'Failed to upload avatar')->with('success', false);
        }
    }
}
