<?php

namespace App\Http\Controllers;

use App\Models\Appointments;
use App\Models\Shop;
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
        $shop->load(['shopGallery', 'shopServiceCategories.serviceCategories', 'shopOperationHours']);
        $shopStaff = ShopStaffs::with('appointments.appointment.appointmentServices.shopService', 'staff')->where('shop_id', $shop->id)->get();
        $business_days = $shop->shopOperationHours->where('is_open', 1)->pluck('day')->toArray();




        return Inertia::render('Users/BookingPages/BookingStepOne', [
            'shop' => $shop,
            'businessDays' => $business_days,
            'shopStaff' => $shopStaff,
        ]);
    }
}
