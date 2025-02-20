<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(): Response
    {
        $users = User::select('id', 'username', 'first_name', 'last_name', 'email', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($user) => [
                'id' => $user->id,
                'username' => $user->username,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'dateRegistered' => $user->created_at->format('m/d/Y'),
            ]);

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'canManageUsers' => true, // Add permissions if needed
        ]);
    }
}