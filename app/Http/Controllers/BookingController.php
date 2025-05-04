<?php

namespace App\Http\Controllers;

use App\Models\Appointments;
use App\Models\AppointmentServices;
use App\Models\Attendee;
use App\Models\Categories;
use App\Models\Shop;
use App\Models\ShopCategory;
use App\Models\ShopServiceCategories;
use App\Models\ShopStaffs;
use App\Models\UserAppointments;
use App\Notifications\NewAppointmentRequestNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    // Define a constant for buffer time
    private const BUFFER_TIME_MINUTES = 30;

    public function stepOne(Shop $shop)
    {
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
            'service_id.*' => 'exists:shop_service_categories,id',
            'total_price' => 'required',
        ]);
        session()->put('form_data', array_merge(session()->get('form_data', []), $validatedData));
        return redirect()->route('booking.step.two', $shop);
    }

    public function stepTwo(Shop $shop)
    {
        $data = session()->get('form_data', []);

        // Check if we have the necessary data to continue
        if (empty($data) || empty($data['service_id'])) {
            return redirect()->route('booking.step.one', $shop)
                ->with('message', 'Please select services before continuing.');
        }

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

        // Check if we have the necessary data to continue
        if (empty($data) || empty($data['date']) || empty($data['time']) || empty($data['staff_id'])) {
            return redirect()->route('booking.step.two', $shop)
                ->with('message', 'Please select a date and time before continuing.');
        }

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
        try {
            $validatedData = $request->validate([
                'attendees' => 'nullable|array',
                'attendees.*.name' => 'required_with:attendees|string|max:255',
                'attendees.*.email' => 'required_with:attendees|email|max:255',
                'buffer_time_minutes' => 'nullable|integer|min:5|max:60',
            ]);

            // Get existing session data
            $formData = session()->get('form_data', []);

            // Consistently pass buffer time between steps
            if (!isset($validatedData['buffer_time_minutes']) && isset($formData['buffer_time_minutes'])) {
                $validatedData['buffer_time_minutes'] = $formData['buffer_time_minutes'];
            } elseif (!isset($validatedData['buffer_time_minutes'])) {
                $validatedData['buffer_time_minutes'] = self::BUFFER_TIME_MINUTES; // Use default
            }

            // Initialize attendee_services structure if we have attendees
            if (!empty($validatedData['attendees'])) {
                $attendee_services = [];
                foreach ($validatedData['attendees'] as $index => $attendee) {
                    $attendee_services[] = [
                        'attendee_index' => $index,
                        'services' => [],
                        'staff_id' => null,
                        'buffer_time_minutes' => $validatedData['buffer_time_minutes']
                    ];
                }
                $validatedData['attendee_services'] = $attendee_services;
            }

            // Update session data
            session()->put('form_data', array_merge($formData, $validatedData));

            // Handle case where there are no attendees (direct booking for user)
            if (empty($validatedData['attendees']) && !empty($formData['service_id']) && !empty($formData['staff_id'])) {
                // For direct booking, we can skip step 4 and go straight to confirmation
                session()->put('form_data', array_merge(session()->get('form_data'), [
                    'attendee_services' => [[
                        'attendee_index' => 0,
                        'services' => $formData['service_id'],
                        'staff_id' => $formData['staff_id'],
                        'buffer_time_minutes' => $validatedData['buffer_time_minutes']
                    ]]
                ]));
            }

            return redirect()->route('booking.step.four', $shop);
        } catch (\Exception $e) {
            Log::error('Booking Step 3 Error: ' . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);
            return back()->withErrors(['message' => 'An error occurred: ' . $e->getMessage()]);
        }
    }

    public function stepFour(Shop $shop)
    {
        try {
            $data = session()->get('form_data', []);

            // Check if we have the necessary data to continue
            if (empty($data) || empty($data['date']) || empty($data['time'])) {
                return redirect()->route('booking.step.three', $shop)
                    ->with('message', 'Please complete previous steps before continuing.');
            }

            // Initialize attendee_services if not present but we have attendees
            if (empty($data['attendee_services']) && !empty($data['attendees'])) {
                $attendee_services = [];
                foreach ($data['attendees'] as $index => $attendee) {
                    $attendee_services[] = [
                        'attendee_index' => $index,
                        'services' => [],
                        'staff_id' => null,
                        'buffer_time_minutes' => $data['buffer_time_minutes'] ?? self::BUFFER_TIME_MINUTES
                    ];
                }
                $data['attendee_services'] = $attendee_services;
                session()->put('form_data', $data);
            }

            // If this is a self-booking (no attendees) with service_id and staff_id already selected,
            // we can redirect straight to the confirmation step
            if (empty($data['attendees']) && !empty($data['service_id']) && !empty($data['staff_id'])) {
                if (empty($data['attendee_services'])) {
                    $data['attendee_services'] = [[
                        'attendee_index' => 0,
                        'services' => $data['service_id'],
                        'staff_id' => $data['staff_id'],
                        'buffer_time_minutes' => $data['buffer_time_minutes'] ?? self::BUFFER_TIME_MINUTES
                    ]];
                    session()->put('form_data', $data);
                }
                return redirect()->route('booking.step.five', $shop);
            }

            // Get all staff for the shop
            $staffList = ShopStaffs::with('staff')
                ->where('shop_id', $shop->id)
                ->where('is_active', 1)
                ->get();

            $shop->load(['shopGallery', 'shopServiceCategories.serviceCategories']);

            return Inertia::render('Users/BookingPages/BookingStepFour', [
                'shop' => $shop,
                'staffList' => $staffList,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            Log::error('Booking Step 4 Error: ' . $e->getMessage(), [
                'exception' => $e,
                'request' => session()->get('form_data')
            ]);
            return back()->withErrors(['message' => 'An error occurred preparing the booking form: ' . $e->getMessage()]);
        }
    }

    public function stepFourStore(Request $request, Shop $shop)
    {
        try {
            // Custom error messages
            $messages = [
                'attendee_services.*.services.required' => 'Please select at least one service.',
                'attendee_services.*.services.min' => 'Please select at least one service.',
                'attendee_services.*.staff_id.required' => 'Please select a staff member.',
            ];

            $validatedData = $request->validate([
                'attendee_services' => 'required|array',
                'attendee_services.*.attendee_index' => 'required|integer',
                'attendee_services.*.services' => 'required|array|min:1', // At least one service must be selected
                'attendee_services.*.services.*' => 'exists:shop_service_categories,id',
                'attendee_services.*.staff_id' => 'required|exists:shop_staffs,id',
                'attendee_services.*.max_duration' => 'nullable|numeric',
                'attendee_services.*.buffer_time_minutes' => 'nullable|numeric',
            ], $messages);

            // Get form data
            $formData = session()->get('form_data');
            if (empty($formData)) {
                throw new \Exception('Session data is missing. Please start the booking process again.');
            }

            $date = $formData['date'] ?? null;
            $time = $formData['time'] ?? null;

            if (!$date || !$time) {
                throw new \Exception('Date and time are required. Please complete the previous steps.');
            }

            // Start a transaction to prevent race conditions on bookings
            DB::beginTransaction();

            try {
                // Group services by staff member for duration calculation
                $staffServices = [];
                foreach ($validatedData['attendee_services'] as $attendeeService) {
                    $staffId = $attendeeService['staff_id'];
                    $serviceIds = $attendeeService['services'];

                    if (!isset($staffServices[$staffId])) {
                        $staffServices[$staffId] = [];
                    }

                    // Merge service IDs for the same staff (for sequential processing)
                    $staffServices[$staffId] = array_merge($staffServices[$staffId], $serviceIds);
                }

                // Check availability for each staff member with their total service duration
                // Use a database lock to prevent race conditions
                $conflictingAppointments = [];

                foreach ($staffServices as $staffId => $serviceIds) {
                    // Calculate total duration for this staff member (services are performed sequentially)
                    $totalDuration = 0;
                    $services = ShopServiceCategories::whereIn('id', $serviceIds)->get();

                    foreach ($services as $service) {
                        $totalDuration += ($service->duration_hour * 60) + $service->duration_minute;
                    }

                    // Ensure minimum duration
                    $totalDuration = max(30, $totalDuration);

                    // Calculate end time for this appointment
                    $startTime = Carbon::createFromFormat('H:i:s', $time);
                    $endTime = (clone $startTime)->addMinutes($totalDuration + self::BUFFER_TIME_MINUTES);

                    // Lock and check for conflicts
                    $conflicts = Appointments::where('staff_id', $staffId)
                        ->where('date', $date)
                        ->whereIn('status', ['pending', 'upcoming', 'started'])
                        ->lockForUpdate() // Lock for transaction
                        ->get();

                    foreach ($conflicts as $conflict) {
                        // Calculate existing appointment duration more accurately
                        $appointmentServices = AppointmentServices::where('appointment_id', $conflict->id)
                            ->where('staff_id', $staffId)
                            ->pluck('service_id')
                            ->toArray();

                        $existingDuration = $this->calculateTotalDuration($appointmentServices);
                        $existingStart = Carbon::createFromFormat('H:i:s', $conflict->time);
                        $existingEnd = (clone $existingStart)->addMinutes($existingDuration + self::BUFFER_TIME_MINUTES);

                        // Check for overlap
                        if (
                            ($startTime >= $existingStart && $startTime < $existingEnd) ||
                            ($endTime > $existingStart && $startTime < $existingEnd) ||
                            ($startTime <= $existingStart && $endTime >= $existingEnd)
                        ) {
                            // Get staff name for better error messaging
                            $staffMember = ShopStaffs::with('staff')->find($staffId);
                            $staffName = $staffMember ?
                                $staffMember->staff->first_name . ' ' . $staffMember->staff->last_name :
                                'Staff #' . $staffId;

                            $conflictingAppointments[] = [
                                'staff_id' => $staffId,
                                'staff_name' => $staffName,
                                'conflicting_time' => $conflict->time,
                                'next_available' => $this->getNextAvailableTime($staffId, $date, $time, $totalDuration)
                            ];
                        }
                    }
                }

                // If there are conflicts, abort transaction and return errors
                if (!empty($conflictingAppointments)) {
                    DB::rollback();

                    $errorMessages = [];
                    foreach ($conflictingAppointments as $conflict) {
                        $nextAvailable = Carbon::parse($conflict['next_available'])->format('g:i A');
                        $errorMessages[] = "Staff member {$conflict['staff_name']} is already booked at this time. Next available: {$nextAvailable}";
                    }

                    return back()->withErrors([
                        'message' => 'Scheduling conflicts detected. Please select different times or staff members.',
                        'conflicts' => $errorMessages
                    ]);
                }

                // If we made it here, all staff are available; update form data
                $formData = array_merge($formData, $validatedData);
                session()->put('form_data', $formData);

                DB::commit();
                return redirect()->route('booking.step.five', $shop);
            } catch (\Exception $innerException) {
                DB::rollback();
                throw $innerException;
            }
        } catch (ValidationException $e) {
            Log::error('Booking Step 4 Validation Error', [
                'errors' => $e->validator->getMessageBag()->toArray(),
                'request' => $request->all()
            ]);
            return back()->withErrors($e->validator->getMessageBag());
        } catch (\Exception $e) {
            Log::error('Booking Step 4 Error: ' . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);
            return back()->withErrors(['message' => 'An error occurred: ' . $e->getMessage()]);
        }
    }

    public function stepFive(Shop $shop)
    {
        $data = session()->get('form_data', []);

        // Check if we have the necessary data to continue
        if (
            empty($data) || empty($data['date']) || empty($data['time']) ||
            empty($data['staff_id']) || empty($data['service_id']) ||
            (isset($data['attendee_services']) && empty($data['attendee_services']))
        ) {
            return redirect()->route('booking.step.one', $shop)
                ->with('message', 'Please complete all required steps before confirming your booking.');
        }

        $shop->load(['shopGallery', 'shopServiceCategories.serviceCategories', 'shopOperationHours']);
        $shopStaff = ShopStaffs::with('appointments.appointment.appointmentServices.shopService', 'staff')
            ->where('shop_id', $shop->id)
            ->where('is_active', 1)
            ->get();
        return Inertia::render('Users/BookingPages/BookingStepFive', [
            'shop' => $shop,
            'shopStaff' => $shopStaff,
            'data' => $data,
        ]);
    }

    public function stepFiveStore(Request $request, Shop $shop)
    {
        try {
            // Add debug logging to help diagnose the issue
            Log::info("Starting booking step 5 store", [
                'shop_id' => $shop->id,
                'user_id' => Auth::id(),
                'has_session_data' => session()->has('form_data')
            ]);

            $validatedData = $request->validate([
                'note' => 'nullable|string',
                'buffer_time_minutes' => 'nullable|integer|min:5|max:60',
            ]);

            try {
                $formData = session()->get('form_data');

                // Debug: Log the form data to see what we're working with
                Log::info("Form data from session", [
                    'form_data' => $formData
                ]);

                if (!$formData) {
                    throw new \Exception('Session data is missing. Please start the booking process again.');
                }

                $requiredFields = ['shop_id', 'staff_id', 'date', 'time', 'service_id', 'total_price'];
                foreach ($requiredFields as $field) {
                    if (!isset($formData[$field])) {
                        throw new \Exception("Required field '$field' is missing from session data.");
                    }
                }

                // Ensure consistent buffer time throughout the booking process
                $bufferTimeMinutes = $validatedData['buffer_time_minutes'] ?? $formData['buffer_time_minutes'] ?? self::BUFFER_TIME_MINUTES;

                DB::beginTransaction();

                // Add a better error handling and catch potential DB transaction issues
                try {
                    // Create the main appointment record with the recalculated price
                    $appointment = Appointments::create([
                        'user_id' => Auth::id(),
                        'shop_id' => $formData['shop_id'],
                        'staff_id' => $formData['staff_id'],
                        'date' => $formData['date'],
                        'time' => $formData['time'],
                        'total_price' => $formData['total_price'],
                        'note' => $request->note ?? ($formData['note'] ?? null),
                        'status' => 'pending',
                        'is_successful' => true,
                    ]);

                    // Create the user appointment link
                    UserAppointments::create([
                        'user_id' => Auth::id(),
                        'appointment_id' => $appointment->id,
                    ]);

                    // Create appointment services
                    foreach ($formData['service_id'] as $serviceId) {
                        AppointmentServices::create([
                            'appointment_id' => $appointment->id,
                            'service_id' => $serviceId,
                            'attendee_id' => null, // No specific attendee for self-booking
                            'staff_id' => $formData['staff_id'],
                            'user_id' => Auth::id()
                        ]);
                    }

                    // Send notifications
                    $this->sendNotifications($appointment, $formData);

                    // Clear session data before redirecting to avoid issues
                    $sessionData = session()->get('form_data');
                    session()->forget('form_data');

                    // Log the successful booking
                    Log::info("Booking completed successfully", [
                        'appointment_id' => $appointment->id,
                        'user_id' => Auth::id()
                    ]);

                    DB::commit();

                    // Return a redirect response explicitly
                    return redirect()->route('appointments')
                        ->with('message', 'Appointment has been booked successfully')
                        ->with('success', true);
                } catch (\Exception $dbError) {
                    DB::rollback();
                    Log::error("Booking Step 5 Database Error: " . $dbError->getMessage(), [
                        'exception' => $dbError,
                        'trace' => $dbError->getTraceAsString(),
                        'request' => $request->all()
                    ]);

                    return redirect()->back()
                        ->withInput()
                        ->with('message', 'Database error: ' . $dbError->getMessage())
                        ->with('success', false);
                }
            } catch (\Exception $sessionError) {
                Log::error("Booking Step 5 Session Error: " . $sessionError->getMessage(), [
                    'exception' => $sessionError,
                    'request' => $request->all(),
                    'form_data' => session()->get('form_data')
                ]);

                return redirect()->back()
                    ->withInput()
                    ->with('message', 'Session error: ' . $sessionError->getMessage())
                    ->with('success', false);
            }
        } catch (ValidationException $validationError) {
            Log::error("Booking Step 5 Validation Error", [
                'errors' => $validationError->validator->getMessageBag()->toArray(),
                'request' => $request->all()
            ]);

            return redirect()->back()
                ->withErrors($validationError->validator)
                ->withInput()
                ->with('message', 'Please fix the errors in your submission')
                ->with('success', false);
        } catch (\Exception $generalError) {
            Log::error("Booking Step 5 General Error: " . $generalError->getMessage(), [
                'exception' => $generalError,
                'trace' => $generalError->getTraceAsString(),
                'request' => $request->all()
            ]);

            return redirect()->back()
                ->withInput()
                ->with('message', 'An unexpected error occurred: ' . $generalError->getMessage())
                ->with('success', false);
        }
    }

    /**
     * Enhanced isStaffBusy method to accurately check availability
     */
    private function isStaffBusy($staffId, $date, $time, $duration)
    {
        if (!$staffId || !$date || !$time) return false;

        // Parse new appointment times
        $startTime = Carbon::createFromFormat('H:i:s', $time);
        $endTime = (clone $startTime)->addMinutes($duration + self::BUFFER_TIME_MINUTES);

        // Get shop hours to check if the appointment would extend beyond closing time
        $dayOfWeek = strtolower(Carbon::parse($date)->format('l'));
        $operatingHours = DB::table('shop_operation_hours')
            ->where('shop_id', DB::table('shop_staffs')->where('id', $staffId)->value('shop_id'))
            ->where('day', $dayOfWeek)
            ->first();

        if ($operatingHours && $operatingHours->is_open) {
            $closeTime = Carbon::parse($operatingHours->close_time);

            // If appointment would end after closing time, it's not available
            if ($endTime->gt($closeTime)) {
                return true; // Treat as "busy" to prevent booking
            }
        }

        // Check for existing appointments on this date for this staff
        $existingAppointments = Appointments::where('staff_id', $staffId)
            ->where('date', $date)
            ->whereIn('status', ['pending', 'upcoming', 'started']) // Only check active appointments
            ->get();

        foreach ($existingAppointments as $appointment) {
            // Calculate existing appointment duration more accurately
            $appointmentServices = AppointmentServices::where('appointment_id', $appointment->id)
                ->where('staff_id', $staffId)
                ->pluck('service_id')
                ->toArray();

            // Calculate total duration of existing appointment for this staff
            $existingTotalDuration = 0;
            $existingServices = ShopServiceCategories::whereIn('id', $appointmentServices)->get();

            foreach ($existingServices as $service) {
                $existingTotalDuration += ($service->duration_hour * 60) + $service->duration_minute;
            }

            // Ensure minimum duration
            $existingTotalDuration = max(30, $existingTotalDuration);

            // Add buffer time
            $existingTotalDuration += self::BUFFER_TIME_MINUTES;

            // Calculate existing appointment time range
            $existingStart = Carbon::createFromFormat('H:i:s', $appointment->time);
            $existingEnd = (clone $existingStart)->addMinutes($existingTotalDuration);

            // Check for overlap
            if (
                // New appointment starts during existing one
                ($startTime >= $existingStart && $startTime < $existingEnd) ||
                // New appointment ends during existing one
                ($endTime > $existingStart && $endTime <= $existingEnd) ||
                // New appointment completely spans the existing one
                ($startTime <= $existingStart && $endTime >= $existingEnd)
            ) {
                return true; // Conflict found
            }
        }

        return false; // No conflicts
    }

    /**
     * Helper method to calculate total duration for services
     */
    private function calculateTotalDuration($serviceIds)
    {
        if (empty($serviceIds)) return 30; // Minimum duration

        $totalDuration = 0;
        $services = ShopServiceCategories::whereIn('id', $serviceIds)->get();

        foreach ($services as $service) {
            $totalDuration += ($service->duration_hour * 60) + $service->duration_minute;
        }

        return max(30, $totalDuration); // Ensure minimum duration
    }

    /**
     * Find the next available time slot for a staff member
     */
    private function getNextAvailableTime($staffId, $date, $time, $duration)
    {
        if (!$staffId || !$date || !$time) return null;

        // Start from the requested time
        $currentTime = Carbon::createFromFormat('H:i:s', $time);

        // Get all appointments for this staff on this date
        $appointments = Appointments::where('staff_id', $staffId)
            ->where('date', $date)
            ->whereIn('status', ['pending', 'upcoming', 'started'])
            ->orderBy('time')
            ->get();

        // If no appointments, the staff is free all day
        if ($appointments->isEmpty()) {
            return $time;
        }

        // Create array of busy time ranges
        $busyRanges = [];
        foreach ($appointments as $appointment) {
            // Calculate total duration for this appointment
            $appointmentServices = AppointmentServices::where('appointment_id', $appointment->id)
                ->where('staff_id', $staffId)
                ->pluck('service_id')
                ->toArray();

            $totalDuration = 0;
            $services = ShopServiceCategories::whereIn('id', $appointmentServices)->get();

            foreach ($services as $service) {
                $totalDuration += ($service->duration_hour * 60) + $service->duration_minute;
            }

            // Ensure minimum duration
            $totalDuration = max(30, $totalDuration);

            // Add buffer time
            $totalDuration += self::BUFFER_TIME_MINUTES;

            // Calculate start and end times
            $start = Carbon::createFromFormat('H:i:s', $appointment->time);
            $end = (clone $start)->addMinutes($totalDuration);

            $busyRanges[] = [
                'start' => $start,
                'end' => $end
            ];
        }

        // Sort busy ranges by start time
        usort($busyRanges, function ($a, $b) {
            return $a['start']->lt($b['start']) ? -1 : 1;
        });

        // Find the first available time slot that works
        // First check if the requested time works
        $checkTime = $currentTime;
        $checkEndTime = (clone $checkTime)->addMinutes($duration + self::BUFFER_TIME_MINUTES);

        $isAvailable = true;
        foreach ($busyRanges as $range) {
            // If our desired time slot overlaps with this busy range
            if (
                ($checkTime >= $range['start'] && $checkTime < $range['end']) ||
                ($checkEndTime > $range['start'] && $checkTime < $range['end']) ||
                ($checkTime <= $range['start'] && $checkEndTime >= $range['end'])
            ) {
                $isAvailable = false;
                // Jump to the end of this busy range and try again
                $checkTime = (clone $range['end'])->addMinutes(1);
                break;
            }
        }

        // If we found a time that works, return it
        if ($isAvailable) {
            return $checkTime->format('H:i:s');
        }

        // Otherwise look past all busy ranges
        foreach ($busyRanges as $range) {
            if ($checkTime < $range['end']) {
                $checkTime = (clone $range['end'])->addMinutes(1);
            }
        }

        // Return the earliest time after all appointments
        return $checkTime->format('H:i:s');
    }

    /**
     * Send notifications to all involved staff members
     */
    private function sendNotifications($appointment, $formData)
    {
        // First notify the primary staff
        $staffMember = ShopStaffs::with('staff')->find($formData['staff_id']);
        if ($staffMember && $staffMember->staff) {
            $appointment->loadMissing(['user', 'appointmentServices.shopService', 'attendees']);
            $staffMember->staff->notify(new NewAppointmentRequestNotification($appointment));
        }

        // Then notify other staff members if different services are assigned to different staff
        if (!empty($formData['attendee_services'])) {
            // Get unique staff IDs except the primary one
            $staffIds = collect($formData['attendee_services'])
                ->pluck('staff_id')
                ->filter(function ($id) use ($formData) {
                    return $id != $formData['staff_id'];
                })
                ->unique()
                ->toArray();

            // Notify each additional staff
            foreach ($staffIds as $staffId) {
                $additionalStaff = ShopStaffs::with('staff')->find($staffId);
                if ($additionalStaff && $additionalStaff->staff) {
                    $additionalStaff->staff->notify(new NewAppointmentRequestNotification($appointment));
                }
            }
        }
    }

    /**
     * Get available times for the specified date and staff
     */
    public function getAvailableTimes(Request $request)
    {
        try {
            $validated = $request->validate([
                'staff_id' => 'required|exists:shop_staffs,id',
                'date' => 'required|date|after_or_equal:today',
                'shop_id' => 'required|exists:shops,id'
            ]);

            // Get shop operating hours for the selected date
            $dayOfWeek = strtolower(Carbon::parse($request->date)->format('l'));
            $operatingHours = DB::table('shop_operation_hours')
                ->where('shop_id', $request->shop_id)
                ->where('day', $dayOfWeek)
                ->first();

            // If shop is closed on this day, return empty array
            if (!$operatingHours || !$operatingHours->is_open) {
                return response()->json([
                    'times' => [],
                    'error' => 'Shop is closed on this day'
                ]);
            }

            // Get existing appointments for this staff on this date
            $existingAppointments = Appointments::where('staff_id', $request->staff_id)
                ->where('date', $request->date)
                ->whereIn('status', ['pending', 'upcoming', 'started'])
                ->get();

            // Generate time slots in 30-minute increments
            $availableTimes = [];
            $openTime = Carbon::parse($operatingHours->open_time);
            $closeTime = Carbon::parse($operatingHours->close_time);
            $currentTime = Carbon::now();

            // Check if the date is today - if so, don't show past times
            $isToday = $currentTime->toDateString() === $request->date;

            while ($openTime->lt($closeTime)) {
                // Skip times in the past if the selected date is today
                if ($isToday && $openTime->lt($currentTime)) {
                    $openTime->addMinutes(30);
                    continue;
                }

                // Format time slot
                $timeSlot = $openTime->format('H:i:s');

                // Check for conflicts with existing appointments
                $isAvailable = true;
                foreach ($existingAppointments as $appointment) {
                    // Determine service duration for this appointment
                    $appointmentServices = $appointment->appointmentServices()
                        ->where('staff_id', $request->staff_id)
                        ->with('shopService')
                        ->get();

                    $totalDuration = 0;
                    foreach ($appointmentServices as $service) {
                        if ($service->shopService) {
                            $totalDuration += ($service->shopService->duration_hour * 60) + $service->shopService->duration_minute;
                        }
                    }

                    // Add buffer time
                    $totalDuration += self::BUFFER_TIME_MINUTES;

                    // Check for overlap
                    $apptStart = Carbon::parse($appointment->time);
                    $apptEnd = (clone $apptStart)->addMinutes($totalDuration);
                    $slotEnd = (clone $openTime)->addMinutes(30);

                    if (
                        ($openTime->gte($apptStart) && $openTime->lt($apptEnd)) || // Slot starts during appointment
                        ($slotEnd->gt($apptStart) && $openTime->lt($apptEnd))     // Slot ends during appointment
                    ) {
                        $isAvailable = false;
                        break;
                    }
                }

                if ($isAvailable) {
                    $availableTimes[] = $timeSlot;
                }

                $openTime->addMinutes(30);
            }

            return response()->json([
                'times' => $availableTimes,
                'shopHours' => [
                    'openTime' => $operatingHours->open_time,
                    'closeTime' => $operatingHours->close_time
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'times' => [],
                'error' => 'Failed to fetch available times: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if a specific time slot is available for booking
     */
    public function checkTimeSlotAvailability(Request $request)
    {
        try {
            $validated = $request->validate([
                'staff_id' => 'required|exists:shop_staffs,id',
                'date' => 'required|date|after_or_equal:today',
                'time' => 'required|date_format:H:i:s',
                'service_ids' => 'required|array',
                'service_ids.*' => 'exists:shop_service_categories,id',
                'shop_id' => 'required|exists:shops,id'
            ]);

            // Calculate total duration for selected services
            $totalDuration = $this->calculateTotalDuration($request->service_ids);

            // Check if the time is within shop operating hours
            $dayOfWeek = strtolower(Carbon::parse($request->date)->format('l'));
            $operatingHours = DB::table('shop_operation_hours')
                ->where('shop_id', $request->shop_id)
                ->where('day', $dayOfWeek)
                ->first();

            $withinBusinessHours = false;
            $wouldEndAfterHours = false;

            if ($operatingHours && $operatingHours->is_open) {
                $requestedTime = Carbon::parse($request->time);
                $openTime = Carbon::parse($operatingHours->open_time);
                $closeTime = Carbon::parse($operatingHours->close_time);

                // Check if appointment starts within business hours
                $withinBusinessHours = $requestedTime->gte($openTime) && $requestedTime->lt($closeTime);

                // Check if appointment would end after closing time
                $serviceEndTime = (clone $requestedTime)->addMinutes($totalDuration);
                $bufferEndTime = (clone $serviceEndTime)->addMinutes(self::BUFFER_TIME_MINUTES);
                $wouldEndAfterHours = $bufferEndTime->gt($closeTime);
            }

            // If the appointment would end after hours, it's not available
            if ($wouldEndAfterHours) {
                return response()->json([
                    'available' => false,
                    'reason' => 'appointment_end_after_hours',
                    'message' => 'This appointment would end after the shop closing time.'
                ]);
            }

            // Check if staff is busy at the selected time
            $isAvailable = !$this->isStaffBusy(
                $request->staff_id,
                $request->date,
                $request->time,
                $totalDuration
            );

            // Time is available if it's within business hours and staff isn't busy
            $available = $isAvailable && $withinBusinessHours && !$wouldEndAfterHours;

            // Get next available time if current is not available
            $nextAvailable = null;
            if (!$available) {
                $nextAvailable = $this->getNextAvailableTime(
                    $request->staff_id,
                    $request->date,
                    $request->time,
                    $totalDuration
                );
            }

            return response()->json([
                'available' => $available,
                'next_available' => $nextAvailable ? Carbon::parse($nextAvailable)->format('g:i A') : null,
                'message' => $available ? 'Time slot is available' : 'Time slot is not available'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to check time slot availability', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'available' => false,
                'error' => 'Failed to check time slot availability: ' . $e->getMessage()
            ], 500);
        }
    }
}
