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
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
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
        // dd($data);
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
            $formData = session()->get('form_data');

            $appointment = Appointments::create([
                'user_id' => auth()->check() ? auth()->user()->id : null,
                'shop_id' => $formData['shop_id'],
                'date' => $formData['date'],
                'time' => $formData['time'],
                'total_price' => $formData['total_price'],
                'note' => $request->note,
                'status' => 'pending',
                'is_successful' => true,
            ]);

            UserAppointments::create([
                'user_id' => auth()->check() ? auth()->user()->id : null,
                'appointment_id' => $appointment->id,
                'staff_id' => $formData['staff_id'],
            ]);

            foreach ($formData['service_id'] as $serviceId) {
                AppointmentServices::create([
                    'appointment_id' => $appointment->id,
                    'service_id' => $serviceId,
                    'user_id' => auth()->user()->id,
                ]);
            }

            session()->forget('form_data');
            return redirect()->route('appointments')->with('message', value: 'Appointment has been booked successfully')->with('success', true);
        } catch (\Exception $e) {
            return redirect()->back()->with('message', 'Something went wrong')->with('success', false);
        }
    }
}
