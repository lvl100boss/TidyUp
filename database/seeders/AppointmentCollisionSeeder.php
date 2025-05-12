<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointments;
use App\Models\Shop;
use App\Models\User;
use App\Models\ShopServiceCategories;
use App\Models\ShopStaffs;
use App\Models\UserAppointments;
use App\Models\AppointmentServices;
use Carbon\Carbon;

class AppointmentCollisionSeeder extends Seeder
{
    /**
     * Seed two pending appointments with the same time to test collision detection
     */
    public function run(): void
    {
        // Find a shop to use for our test
        $shop = Shop::first();
        if (!$shop) {
            $this->command->error('No shops found! Please run the ShopSeeder first.');
            return;
        }

        // Get the first shop staff
        $shopStaff = ShopStaffs::where('shop_id', $shop->id)->where('is_active', true)->first();
        if (!$shopStaff) {
            $this->command->error('No active staff found for the shop!');
            return;
        }

        // Get two users for our test appointments (using take(2) instead of whereDoesntHave('shops'))
        $users = User::take(2)->get();
        if (count($users) < 2) {
            $this->command->error('Need at least two users for testing!');
            return;
        }

        // Get a service from this shop
        $service = ShopServiceCategories::where('shop_id', $shop->id)->first();
        if (!$service) {
            $this->command->error('No services found for this shop!');
            return;
        }

        // Common appointment date and time (both will be at the same time)
        $date = Carbon::now()->addDays(3)->format('Y-m-d');

        // Create appointments with same date but different times for more realistic testing
        $times = ['14:00:00', '14:30:00']; // 2 PM and 2:30 PM

        for ($i = 0; $i < 2; $i++) {
            $user = $users[$i];
            $appointmentNumber = $i + 1;
            $time = $times[$i];

            // Create the appointment
            $appointment = Appointments::create([
                'user_id' => $user->id,
                'shop_id' => $shop->id,
                'staff_id' => $shopStaff->id,
                'date' => $date,
                'time' => $time,
                'total_price' => $service->cost,
                'status' => 'pending',
                'is_successful' => true,
                'nickname' => $user->first_name,
            ]);

            // Create the user appointment link
            UserAppointments::create([
                'appointment_id' => $appointment->id,
                'user_id' => $user->id,
                'staff_id' => $shopStaff->id,
            ]);

            // Add the service to the appointment
            AppointmentServices::create([
                'appointment_id' => $appointment->id,
                'service_id' => $service->id,
                'user_id' => $user->id,
            ]);

            $this->command->info("Created test appointment {$appointmentNumber} for {$user->first_name} {$user->last_name} at {$time}");
        }

        $this->command->info('Successfully created two appointments that may conflict depending on service duration!');
    }
}
