<?php

namespace App\Http\Controllers;

use App\Models\Appointments;
use App\Models\AppointmentServices;
use App\Models\Categories;
use App\Models\Shop;
use App\Models\ShopCategory;
use App\Models\ShopServiceCategories;
use App\Models\ShopStaffs;
use App\Models\UserAppointments;
use App\Notifications\NewAppointmentRequestNotification; // Import the notification class
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // Import Log facade
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    public function stepOne(Shop $shop)
    {
        // session()->forget('form_data');
        $shop->load(['shopGallery', 'shopServiceCategories.serviceCategories', 'shopOperationHours']);
        $shopStaff = ShopStaffs::with('appointments.appointment.appointmentServices.shopService', 'staff')
            ->where('shop_id', $shop->id)
            ->where('is_active', 1)
            ->get();

        $data = session()->get('form_data', []);
        return Inertia::render('Users/BookingPages/BookingStepOne', [
            'shop' => $shop,
            'shopStaff' => $shopStaff,
            'data' => $data,
        ]);
    }

    public function stepOneStore(Request $request, Shop $shop)
    {
        $validatedData = $request->validate([
            'service_id' => 'required|array',
            'service_id.*' => 'exists:shop_service_categories,id', // Ensure shop_services table exists
            'total_price' => 'required',
        ]);
        session()->put('form_data', array_merge(session()->get('form_data', []), $validatedData));
        return redirect()->route('booking.step.two', $shop);
    }

    public function stepTwo(Shop $shop)
    {
        $data = session()->get('form_data', []);
        $shop->load(['shopGallery', 'shopServiceCategories.serviceCategories', 'shopOperationHours']);
        $shopStaff = ShopStaffs::with('appointments.appointment.appointmentServices.shopService', 'staff')
            ->where('shop_id', $shop->id)
            ->where('is_active', 1)
            ->get();
        $business_days = $shop->shopOperationHours->where('is_open', 1)->pluck('day')->toArray();
        $shopServiceCategories = ShopServiceCategories::with('serviceCategories')->where('shop_id', $shop->id)->get();
        return Inertia::render('Users/BookingPages/BookingStepTwo', [
            'shop' => $shop,
            'businessDays' => $business_days,
            'shopStaff' => $shopStaff,
            'shopServiceCategories' => $shopServiceCategories,
            'data' => $data,
        ]);
    }

    public function stepTwoStore(Request $request, Shop $shop)
    {
        $validatedData = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'staff_id' => 'required|exists:shop_staffs,id',
            'staff_index' => 'required',
            'date' => 'required|date',
            'time' => 'required',
        ]);
        session()->put('form_data', array_merge(session()->get('form_data', []), $validatedData));
        return redirect()->route('booking.step.three', $shop);
    }

    public function stepThree(Shop $shop)
    {
        $data = session()->get('form_data', []);
        $shop->load(['shopGallery', 'shopServiceCategories.serviceCategories', 'shopOperationHours']);
        $shopStaff = ShopStaffs::with('appointments.appointment.appointmentServices.shopService', 'staff')
            ->where('shop_id', $shop->id)
            ->where('is_active', 1)
            ->get();
        return Inertia::render('Users/BookingPages/BookingStepThree', [
            'shop' => $shop,
            'shopStaff' => $shopStaff,
            'data' => $data,
        ]);
    }

    public function stepThreeStore(Request $request, Shop $shop)
    {
        $validatedData = $request->validate([
            'note' => 'nullable|string',
        ]);

        try {
            // Get form data and verify it exists
            $formData = session()->get('form_data');
            if (!$formData) {
                throw new \Exception('Session data is missing. Please start the booking process again.');
            }

            // Check for required fields
            $requiredFields = ['shop_id', 'staff_id', 'date', 'time', 'service_id', 'total_price'];
            foreach ($requiredFields as $field) {
                if (!isset($formData[$field])) {
                    throw new \Exception("Required field '$field' is missing from session data.");
                }
            }

            // Create the main appointment record
            $appointment = Appointments::create([
                'user_id' => Auth::id(),
                'shop_id' => $formData['shop_id'],
                'staff_id' => $formData['staff_id'], // Use the staff_id from session
                'date' => $formData['date'],
                'time' => $formData['time'],
                'total_price' => $formData['total_price'],
                'note' => $request->note,
                'status' => 'pending',
                'is_successful' => true, // Consider if this should default to true or be set later
            ]);

            // Create the user appointment link
            UserAppointments::create([
                'user_id' => Auth::id(),
                'appointment_id' => $appointment->id,
                'staff_id' => $formData['staff_id'], // Use the staff_id from session
            ]);

            // Create appointment services links
            foreach ($formData['service_id'] as $serviceId) {
                AppointmentServices::create([
                    'appointment_id' => $appointment->id,
                    'service_id' => $serviceId,
                    'user_id' => Auth::id() // Assuming service is linked to the booking user
                ]);
            }

            // --- Send Notification to the Selected Staff ---
            // Find the ShopStaff record, including the related User model
            // Assuming 'staff' is the relationship name on ShopStaffs model linking to the User model
            $staffMember = ShopStaffs::with('staff')->find($formData['staff_id']);

            if ($staffMember && $staffMember->staff) {
                // Ensure the appointment instance has necessary relations loaded for the notification content
                $appointment->loadMissing(['user', 'appointmentServices.shopService']);
                // Notify the User associated with the ShopStaff record
                $staffMember->staff->notify(new NewAppointmentRequestNotification($appointment));
            } else {
                // Optional: Log a warning if the staff member or their user account can't be found
                Log::warning("Could not find staff user for ShopStaff ID: {$formData['staff_id']} to send NewAppointmentRequestNotification for appointment ID: {$appointment->id}");
            }
            // --- End Notification ---

            session()->forget('form_data');
            return redirect()->route('appointments')->with('message', 'Appointment has been booked successfully')->with('success', true);
        } catch (\Exception $e) {
            // Log the detailed error for debugging
            Log::error("Booking Step 3 Error: " . $e->getMessage(), ['exception' => $e]);
            // Provide a user-friendly error message
            return redirect()->back()->with('message', 'Error: Could not complete booking. Please try again or contact support.')->with('success', false);
        }
    }
}
