import React from 'react'
import { CalendarSync, Loader2 } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from "@/Components/ui/alert-dialog";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Calendar } from '@/Components/ui/calendar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useForm } from '@inertiajs/react'
import { useState } from 'react'

export default function ReschedReqButton({ appointment, upcomingSchedules, shopBusinessSchedules }) {
    console.log("appointment", appointment);
    console.log("upcomingSchedules", upcomingSchedules);
    console.log("shopBusinessSchedules", shopBusinessSchedules);
    // This is to get the appointment date of the appointment being rescheduled and set it as the default date in the calendar
    const [date, setDate] = useState(new Date(appointment.date));

    // this function is to filter out dates that are not available for rescheduling
    const isDateDisabled = (date) => {
        // Disable dates before today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
            return true;
        }
        // Check if shop is closed on this day
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[date.getDay()];
        const daySchedule = shopBusinessSchedules?.find(schedule => schedule.day === dayName);
        return daySchedule && !daySchedule.is_open;
    };


    const getAvailableTimeSlots = () => {
        // 1. Early return if no schedule data
        if (!shopBusinessSchedules || !date) {
            return [];
        }

        // Get day of week for the selected date
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[date.getDay()];

        // Find the schedule for this day
        const daySchedule = shopBusinessSchedules.find(schedule => schedule.day === dayName);

        // If shop is closed or no schedule found, return empty array
        if (!daySchedule || !daySchedule.is_open) {
            return [];
        }

        // 2. Check if current day - don't show past time slots
        const isToday = new Date().toDateString() === date.toDateString();
        const currentHour = isToday ? new Date().getHours() : 0;
        const currentMinute = isToday ? new Date().getMinutes() : 0;

        // Parse open and close times (with safer parsing)
        const [openHour, openMinute] = daySchedule.open_time
            .split(':')
            .map(num => parseInt(num, 10));

        const [closeHour, closeMinute] = daySchedule.close_time
            .split(':')
            .map(num => parseInt(num, 10));

        // 3. Calculate slots more clearly
        const slots = [];

        // Starting slot calculation (considering current time if it's today)
        let startSlot;
        if (isToday && (currentHour > openHour || (currentHour === openHour && currentMinute >= openMinute))) {
            // If current time is after opening time, start from next available slot
            startSlot = currentHour * 2 + (currentMinute >= 30 ? 1 : 0) + 1; // Add 1 to start from next slot
        } else {
            startSlot = openHour * 2 + (openMinute >= 30 ? 1 : 0);
        }

        const endSlot = closeHour * 2 + (closeMinute > 0 ? 1 : 0);

        // 4. Generate slots only if we have valid start/end time range
        if (startSlot < endSlot) {
            for (let i = startSlot; i < endSlot; i++) {
                const hours = Math.floor(i / 2).toString().padStart(2, '0');
                const minutes = (i % 2) * 30;
                slots.push(`${hours}:${minutes.toString().padStart(2, '0')}:00`);
            }
        }

        return slots;
    };

    // 5. Memoize time slots to avoid recalculations
    const availableTimeSlots = React.useMemo(() =>
        getAvailableTimeSlots(), [date, shopBusinessSchedules]
    );

    // 6. Improved time slot checker with fixed date comparison
    // bu
    const isTimeSlotBooked = React.useCallback((timeSlot) => {
        if (!upcomingSchedules?.length) return false;

        const selectedDateStr = new Date(date).toLocaleDateString('en-CA'); // Ensure consistent date format

        const [slotHour, slotMinute] = timeSlot.split(':').map(num => parseInt(num, 10));
        const slotTimeInMinutes = slotHour * 60 + slotMinute;
        const slotEndTimeInMinutes = slotTimeInMinutes + 30;

        return upcomingSchedules.some(schedule => {
            if (schedule.date !== selectedDateStr) return false;

            const [apptHour, apptMinute] = schedule.time.split(':').map(num => parseInt(num, 10));
            const apptStartTimeInMinutes = apptHour * 60 + apptMinute;

            let apptEndTimeInMinutes = apptStartTimeInMinutes + 30;
            if (schedule.end_time) {
                const [endHour, endMinute] = schedule.end_time.split(':').map(num => parseInt(num, 10));
                apptEndTimeInMinutes = endHour * 60 + endMinute;
            }

            // Fix the overlap logic to properly handle the endpoint case
            // A slot is booked if it starts before the appointment ends AND ends after the appointment starts
            return (
                slotTimeInMinutes < apptEndTimeInMinutes && slotEndTimeInMinutes > apptStartTimeInMinutes
            );
        });
    }, [date, upcomingSchedules]);




    // 7. Simplify formatTime function with a more efficient approach
    const formatTime = timeStr => {
        if (!timeStr) return '';

        const [hourStr, minuteStr] = timeStr.split(':');
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);

        return new Intl.DateTimeFormat('default', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(new Date(0, 0, 0, hour, minute));
    };

    const handleDateChange = (newDate) => {
        setDate(newDate);
        // Format the date as YYYY-MM-DD for the form data
        if (newDate) {
            const formattedDate = newDate.toISOString().split('T')[0];
            setData('date', formattedDate);
            // Clear the time selection when date changes
            setData('time', '');
        } else {
            setData('date', '');
        }
    };

    // Form Handling
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH',
        date: new Date(appointment.date).toISOString().split('T')[0],
        time: appointment.time || '',
        reason: ''
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('date', data.date);
        formData.append('time', data.time);
        formData.append('reason', data.reason);

        post(route('shop.appointments.reschedule', appointment.id), {
            preserveScroll: true,
            data: formData,
        });
    }


    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button
                    variant="outline"
                    size="default"
                    className="gap-1.5"
                >
                    <CalendarSync className="mr-2 h-4 w-4" />
                    Reschedule
                </Button>
            </AlertDialogTrigger >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Reschedule Request</AlertDialogTitle>
                    <AlertDialogDescription>
                        Requesting a reschedule will notify the user. They can accept or decline the request. If declined, the appointment will be canceled.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <Label htmlFor="date">Date</Label>
                    <div className='w-full grid justify-center'>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateChange}
                            className="rounded-md border"
                            disabled={isDateDisabled}
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="time">Time</Label>
                    <Select
                        onValueChange={(value) => setData('time', value)}
                        value={data.time}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={availableTimeSlots.length ? "Select Time" : "No times available"} />
                        </SelectTrigger>
                        <SelectContent>
                            {availableTimeSlots.length ? (
                                availableTimeSlots.map((slot, index) => (
                                    <SelectItem
                                        key={index}
                                        value={slot}
                                        disabled={isTimeSlotBooked(slot)}
                                    >
                                        {formatTime(slot)}
                                        {isTimeSlotBooked(slot) && " (Booked)"}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="none" disabled>
                                    No available times for this date
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    <div>
                        {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                    </div>
                </div>
                <div>
                    <Label htmlFor="reason">Reason for Reschedule</Label>
                    <Textarea
                        id="reason"
                        type="text"
                        name="reason"
                        className="mt-1 block w-full"
                        placeholder="Please provide a reason for rescheduling the appointment"
                        onChange={(e) => setData('reason', e.target.value)}
                    />
                    <div>
                        {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form onSubmit={handleSubmit}>
                        <Button type="submit">
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {processing ? "Processing..." : "Confirm"}
                        </Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    )
}