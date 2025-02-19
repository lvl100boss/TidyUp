<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\ShopStaffs;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ManageStaffController extends Controller
{
    public function index()
    {
        $user_id = Auth::user()->id;
        $shop = Shop::with('staffs.staff')->where('user_id', $user_id)->first();
        $staffs = $shop->staffs;
        $currentStaff = $staffs->where('staff_id', $user_id)->first();
        $isOwner = $currentStaff->position === 'owner';
        return Inertia::render('Shops/ManageStaff', [
            'staffs' => $staffs,
            'shop' => [
                'name' => $shop->shop_name,
            ],
            'isOwner' => $isOwner,
        ]);
    }

    public function create()
    {
        return Inertia::render('Shops/CreateStaff');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'role' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', Rule::in(['staff', 'manager'])],
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
            ]);

            // Get the shop ID based on the authenticated user's association
            $authenticatedUser = Auth::user();
            $userShopAssociation = ShopStaffs::where('staff_id', $authenticatedUser->id)
                ->where('is_active', true)
                ->first();

            if (!$userShopAssociation || !$userShopAssociation->shop_id) {
                throw ValidationException::withMessages([
                    'shop' => ['You are not associated with any shop'],
                ]);
            }
            ShopStaffs::create([
                'shop_id' => $userShopAssociation->shop_id,
                'staff_id' => $user->id,
                'role' => $validated['role'],
                'position' => $validated['position'],
                'is_active' => true,
                'started_at' => now(),
            ]);

            DB::commit();
            return redirect('/shop/manage/staff')->with('message', 'Staff member added successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('shop.manage.staff.create')->with('message', 'Failed to add staff member')->with('success', false);
        }
    }

    public function edit($id)
    {
        $staff = ShopStaffs::with('staff')->where('staff_id', $id)->firstOrFail();


        // Check if the authenticated user has access to this staff member
        $authenticatedUser = Auth::user();
        $userShopAssociation = ShopStaffs::where('staff_id', $authenticatedUser->id)
            ->where('is_active', true)
            ->first();

        if (!$userShopAssociation || $staff->shop_id !== $userShopAssociation->shop_id) {
            abort(403);
        }

        return Inertia::render('Shops/EditsStaff', [
            'staff' => [
                'id' => $staff->id,
                'role' => $staff->role,
                'position' => $staff->position,
                'first_name' => $staff->staff->first_name,
                'last_name' => $staff->staff->last_name,
                'username' => $staff->staff->username,
                'email' => $staff->staff->email,
                'date_of_birth' => $staff->staff->date_of_birth,
                'gender' => $staff->staff->gender,
                'is_active' => $staff->is_active,
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $staff = ShopStaffs::with('staff')->findOrFail($id);
        $validated = $request->validate([
            'role' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', Rule::in(['staff', 'manager'])],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($staff->staff->id)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($staff->staff->id)],
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
            ];

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $staff->staff->update($userData);

            $staff->update([
                'role' => $validated['role'],
                'position' => $validated['position'],
                'is_active' => $validated['is_active'] === "1" ? true : false,
            ]);

            DB::commit();
            return redirect('/shop/manage/staff')->with('message', 'Staff information updated successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('message', 'Failed to update staff information')->with('success', false);
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
                return back()->withErrors(['password' => 'The password is required.'])->with('message', "Failed to Delete Staff.")->with('success', false);
            }
            if (!Hash::check($request->password, Auth::user()->password)) {
                return back()->withErrors(['password' => 'The password is incorrect.'])->with('message', "You've entered an incorrect password.")->with('success', false);
            }
            // Find the staff record (adjust if needed: use staff_id or id based on your model)
            $staff = ShopStaffs::findOrFail($id);
            // Optional: check that the user is allowed to delete this staff (e.g. only owner can delete)
            $user_id = Auth::user()->id;
            $userPosition = ShopStaffs::where('staff_id', $user_id)->first()->position;
            if ($userPosition !== 'owner') {
                return back()->withErrors(['password' => 'You are not allowed to delete this staff.'])->with('message', "You are not allowed to delete this staff.")->with('success', false);
            }
            $staff->delete();
            return redirect()->route('shop.manage.staff')->with('message', 'Staff deleted successfully.')->with('success', true);
        } catch (\Exception $e) {
            return back()->with('message', 'Failed to delete staff.')->with('success', false);
        }
        // Check if the provided password matches the authenticated user's password

    }
}
