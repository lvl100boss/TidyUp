<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'username' => 'subaru',
                'first_name' => 'Subaru',
                'last_name' => 'Natsuki',
                'email' => 'subaru@tidyup.com',
                'password' => Hash::make('password123'),
                'contact_number' => '09123456781',
                'email_verified_at' => now(),
            ],
            [
                'username' => 'emilia',
                'first_name' => 'Emilia',
                'last_name' => 'Satella',
                'email' => 'emilia@tidyup.com',
                'password' => Hash::make('password123'),
                'contact_number' => '09123456782',
                'email_verified_at' => now(),
            ],
            [
                'username' => 'rem',
                'first_name' => 'Rem',
                'last_name' => 'Oni',
                'email' => 'rem@tidyup.com',
                'password' => Hash::make('password123'),
                'contact_number' => '09123456783',
                'email_verified_at' => now(),
            ],
            [
                'username' => 'ram',
                'first_name' => 'Ram',
                'last_name' => 'Oni',
                'email' => 'ram@tidyup.com',
                'password' => Hash::make('password123'),
                'contact_number' => '09123456784',
                'email_verified_at' => now(),
            ],
            [
                'username' => 'beatrice',
                'first_name' => 'Beatrice',
                'last_name' => 'Betty',
                'email' => 'beatrice@tidyup.com',
                'password' => Hash::make('password123'),
                'contact_number' => '09123456785',
                'email_verified_at' => now(),
            ],
            [
                'username' => 'roswaal',
                'first_name' => 'Roswaal',
                'last_name' => 'Mathers',
                'email' => 'roswaal@tidyup.com',
                'password' => Hash::make('password123'),
                'contact_number' => '09123456786',
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}