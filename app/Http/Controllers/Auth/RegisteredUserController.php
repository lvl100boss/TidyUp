<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        //onload clear the session data
        session()->forget('partial_user');
        // return the registration view
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function saveUserForm(Request $request)
    {
        // validate the request
        $partialUser = $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',     // At least one lowercase letter
                'regex:/[A-Z]/',     // At least one uppercase letter
                'regex:/[0-9]/',     // At least one digit
                'regex:/[@$!%*?&#]/', // At least one special character
                'confirmed', // This requires a password confirmation field (password_confirmation)
            ],
        ]);
        // save to session
        $request->session()->put('partial_user', $partialUser);
        // redirect to setup profile form
        return redirect(route('register.setupProfile'));
    }

    public function showSetupProflleForm()
    {
        //get the session data
        $partialUser = session('partial_user');
        if (!$partialUser) {
            return redirect()->route('register');
        }
        return Inertia::render('Auth/SetupUserProfile');
    }

    public function saveUserForm2(Request $request)
    {
        // validate the request
        if (!$request->session()->has('partial_user')) {
            return redirect()->route('register');
        }
        // validate the request
        $partialUser = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
        ]);

        $existingData = $request->session()->get('partial_user', []);
        $updatedData = array_merge($existingData, $partialUser);
        $request->session()->put('partial_user', $updatedData);
        // redirect to setup profile form
        return redirect(route('register.setupProfile2'));
    }

    public function showSetupProflleForm2()
    {
        //get the session data
        $partialUser = session('partial_user');
        if (!$partialUser) {
            return redirect()->route('register');
        }

        $first_name = $partialUser['first_name'] ?? '';
        $last_name = $partialUser['last_name'] ?? '';
        return Inertia::render('Auth/SetupUserProfileTwo', [
            'first_name' => $first_name,
            'last_name' => $last_name,
        ]);
    }

    public function store(Request $request)
    {
        $partialUser = session('partial_user');
        $validatedData = $request->validate([
            'profile_photo_path' => 'nullable|image|mimes:webp,jpeg,jpg,png|max:20048',
            'gender' => 'required|string|in:Male,Female|max:6',
            'contact_number' => 'required|string|max:15',
            'date_of_birth' => [
                'required',
                'date',
                'before:today',
                function ($attribute, $value, $fail) {
                    $dob = new \DateTime($value);
                    $today = new \DateTime();
                    $age = $dob->diff($today)->y;
                    if ($age < 14) {
                        $fail('You must be at least 14 years old to register.');
                    }
                }
            ],
        ]);

        if ($request->hasFile('profile_photo_path')) {
            $path = $request->file('profile_photo_path')->store('profile-photos', 'public');
            $partialUser['profile_photo_path'] = $path;
        } else {
            $partialUser['profile_photo_path'] = null;
        }
        
        $user = User::create([
            'first_name' => $partialUser['first_name'],
            'middle_name' => $partialUser['middle_name'],
            'last_name' => $partialUser['last_name'],
            'username' => $partialUser['username'],
            'email' => $partialUser['email'],
            'password' => Hash::make($partialUser['password']),
            'gender' => $validatedData['gender'],
            'contact_number' => $validatedData['contact_number'],
            'date_of_birth' => $validatedData['date_of_birth'],
            'profile_photo_path' => $partialUser['profile_photo_path'],
        ]);

        $user->userRole()->create([
            'user_id' => $user->id,
            'role_id' => 5,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('verification.notice', absolute: false))->with('message', 'Registration successful. Please verify your email address.')->with('success', true);
    }
}