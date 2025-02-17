<?php

namespace App\Http\Controllers;

use App\Models\Appointments;
use App\Models\Shop;
use App\Models\ShopServiceCategories;
use App\Models\UserAppointments;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    public function index(Shop $shop)
    {
        $shop->load(['shopGallery', 'shopServiceCategories.serviceCategories']);

        return Inertia::render('Users/Booking', [
            'shop' => $shop
        ]);
    }

    public function getAvailableTimeSlots(Request $request, Shop $shop)
    {
        $date = Carbon::parse($request->date);

        // Get shop's business hours for the selected day
        $openTime = Carbon::parse($shop->open_time);
        $closeTime = Carbon::parse($shop->close_time);

        // Get all staff members
        $staffMembers = $shop->staff()
            ->where('is_active', true)
            ->get();

        // Get existing appointments for the date
        $existingAppointments = Appointments::where('shop_id', $shop->id)
            ->where('date', $date->format('Y-m-d'))
            ->whereIn('status', ['pending', 'upcoming', 'started'])
            ->with('userAppointments')
            ->get();

        // Generate time slots (30-minute intervals)
        $timeSlots = [];
        $currentTime = clone $openTime;

        while ($currentTime < $closeTime) {
            $slotStart = $currentTime->format('H:i');
            $currentTime->addMinutes(30);
            $slotEnd = $currentTime->format('H:i');

            // Check staff availability for this slot
            $availableStaff = $this->getAvailableStaffForSlot(
                $staffMembers,
                $existingAppointments,
                $slotStart,
                $slotEnd
            );

            if (count($availableStaff) > 0) {
                $timeSlots[] = [
                    'start_time' => $slotStart,
                    'end_time' => $slotEnd,
                    'available_staff' => count($availableStaff)
                ];
            }
        }

        return response()->json(['time_slots' => $timeSlots]);
    }

    private function getAvailableStaffForSlot($staffMembers, $existingAppointments, $slotStart, $slotEnd)
    {
        return $staffMembers->filter(function ($staff) use ($existingAppointments, $slotStart, $slotEnd) {
            foreach ($existingAppointments as $appointment) {
                foreach ($appointment->userAppointments as $userAppointment) {
                    if ($userAppointment->staff_id === $staff->id) {
                        // Check if the appointment overlaps with the slot
                        $appointmentStart = Carbon::parse($userAppointment->start_time);
                        $appointmentEnd = Carbon::parse($userAppointment->end_time);
                        $slotStartTime = Carbon::parse($slotStart);
                        $slotEndTime = Carbon::parse($slotEnd);

                        if ($slotStartTime < $appointmentEnd && $slotEndTime > $appointmentStart) {
                            return false;
                        }
                    }
                }
            }
            return true;
        });
    }

    public function createBooking(Request $request, Shop $shop)
    {
        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'users' => 'required|array|min:1',
            'users.*.user_id' => 'required|exists:users,id',
            'users.*.service_id' => 'required|exists:shop_service_categories,id',
            'users.*.start_time' => 'required|date_format:H:i',
            'note' => 'nullable|string|max:500'
        ]);

        try {
            DB::beginTransaction();

            // Calculate total duration and cost
            $totalDuration = 0;
            $totalCost = 0;

            foreach ($validated['users'] as $userBooking) {
                $service = ShopServiceCategories::find($userBooking['service_id']);
                $totalDuration += ($service->duration_hour * 60) + $service->duration_minute;
                $totalCost += $service->cost;
            }

            // Create main appointment
            $appointment = Appointments::create([
                'user_id' => auth()->id(),
                'shop_id' => $shop->id,
                'date' => $validated['date'],
                'time' => $validated['users'][0]['start_time'],
                'duration_minutes' => $totalDuration,
                'total_price' => $totalCost,
                'note' => $validated['note'] ?? null,
                'booking_reference' => strtoupper(Str::random(8)),
                'status' => 'pending'
            ]);

            // Create user appointments
            foreach ($validated['users'] as $userBooking) {
                $service = ShopServiceCategories::find($userBooking['service_id']);
                $startTime = Carbon::parse($userBooking['start_time']);
                $endTime = $startTime->copy()->addMinutes(
                    ($service->duration_hour * 60) + $service->duration_minute
                );

                UserAppointments::create([
                    'user_id' => $userBooking['user_id'],
                    'appointment_id' => $appointment->id,
                    'service_id' => $service->id,
                    'start_time' => $startTime->format('H:i'),
                    'end_time' => $endTime->format('H:i'),
                    'status' => 'pending'
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Booking created successfully',
                'booking_reference' => $appointment->booking_reference
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'general' => ['Failed to create booking. Please try again.']
            ]);
        }
    }

    public function getServices(Shop $shop)
    {
        $services = $shop->services()
            ->with('serviceCategory')
            ->where('is_active', true)
            ->get()
            ->groupBy('serviceCategory.name');

        return response()->json(['services' => $services]);
    }
}
