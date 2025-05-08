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
    // Add these methods to your BookingController class

    /**
     * Show preview of booking step one for unauthenticated users
     */
    public function previewStepOne(Shop $shop)
    {
        $shop->load(['shopGallery', 'shopServiceCategories.serviceCategories', 'shopOperationHours']);
        $shopStaff = ShopStaffs::with('appointments.appointment.appointmentServices.shopService', 'staff')
            ->where('shop_id', $shop->id)
            ->where('is_active', 1)
            ->get();

        $data = session()->get('preview_form_data', []);
        return Inertia::render('Users/BookingPages/BookingStepOne', [
            'shop' => $shop,
            'shopStaff' => $shopStaff,
            'data' => $data,
            'isPreview' => true
        ]);
    }

    /**
     * Store preview data for step one
     */
    public function previewStepOneStore(Request $request, Shop $shop)
    {
        $validatedData = $request->validate([
            'service_id' => 'required|array',
            'service_id.*' => 'exists:shop_service_categories,id',
            'total_price' => 'required',
        ]);
        session()->put('preview_form_data', array_merge(session()->get('preview_form_data', []), $validatedData));
        return redirect()->route('booking.preview.step.two', $shop);
    }

    /**
     * Show preview of booking step two
     */
    public function previewStepTwo(Shop $shop)
    {
        $data = session()->get('preview_form_data', []);
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
            'isPreview' => true
        ]);
    }

    /**
     * Store preview data for step two
     */
    public function previewStepTwoStore(Request $request, Shop $shop)
    {
        $validatedData = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'staff_id' => 'required|exists:shop_staffs,id',
            'staff_index' => 'required',
            'date' => 'required|date',
            'time' => 'required',
        ]);
        session()->put('preview_form_data', array_merge(session()->get('preview_form_data', []), $validatedData));
        return redirect()->route('booking.preview.step.three', $shop);
    }

    /**
     * Show preview of booking step three (final step)
     */
    public function previewStepThree(Shop $shop)
    {
        $data = session()->get('preview_form_data', []);
        $shop->load(['shopGallery', 'shopServiceCategories.serviceCategories', 'shopOperationHours']);
        $shopStaff = ShopStaffs::with('appointments.appointment.appointmentServices.shopService', 'staff')
            ->where('shop_id', $shop->id)
            ->where('is_active', 1)
            ->get();

        return Inertia::render('Users/BookingPages/BookingStepThree', [
            'shop' => $shop,
            'shopStaff' => $shopStaff,
            'data' => $data,
            'isPreview' => true
        ]);
    }







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

    /**
     * Process the final booking step and create the appointment
     */
    public function stepThreeStore(Request $request, Shop $shop)
    {
        try {
            // Retrieve all form data from previous steps
            $formData = session()->get('form_data', []);

            // Merge with any additional data from this step
            $formData = array_merge($formData, $request->all());

            // Determine if this is a staff-booked appointment (walk-in or guest booking)
            $isStaffBooking = isset($formData['is_walkin']) && $formData['is_walkin'] ||
                isset($formData['is_guest']) && $formData['is_guest'];

            // Begin transaction
            DB::beginTransaction();

            // Create the appointment
            $appointment = Appointments::create([
                'user_id' => Auth::id(),
                'shop_id' => $formData['shop_id'],
                'staff_id' => $formData['staff_id'],
                'date' => $formData['date'],
                'time' => $formData['time'],
                'total_price' => $formData['total_price'],
                'note' => $request->note,
                'nickname' => $request->nickname, // This is now required
                'booking_for_other' => $request->booking_for_other ? true : false,
                'status' => 'pending',
                'is_successful' => true,
                'staff_booked' => $isStaffBooking, // Flag for staff-booked appointments
            ]);

            // Create the user appointment link
            UserAppointments::create([
                'user_id' => Auth::id(),
                'appointment_id' => $appointment->id,
                'staff_id' => $formData['staff_id'],
                'is_staff_booking' => $isStaffBooking, // Add flag to junction table too
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

            DB::commit();

            session()->forget('form_data');

            // Redirect to the thank you page instead of directly to appointments
            return redirect()->route('booking.thank-you', [
                'shop' => $shop->id,
                'appointment' => $appointment->id
            ])->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the detailed error for debugging
            Log::error("Booking Step 3 Error: " . $e->getMessage(), ['exception' => $e]);
            // Provide a user-friendly error message
            return redirect()->back()->with('message', 'Error: Could not complete booking. Please try again or contact support.')->with('success', false);
        }
    }

    /**
     * Show the thank you page after successful booking
     */
    public function thankYou(Shop $shop, Appointments $appointment)
    {
        // Ensure the appointment belongs to the authenticated user
        if ($appointment->user_id !== Auth::id()) {
            return redirect()->route('appointments');
        }

        return Inertia::render('Users/BookingPages/BookingThankYou', [
            'shop' => $shop,
            'appointment' => $appointment->load(['appointmentServices.shopService', 'staff.staff']),
        ]);
    }
}
