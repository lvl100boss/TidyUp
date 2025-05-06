import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState, useEffect, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock } from "lucide-react"

export default function AvailableTimeSlots({
    shop,
    shopStaff,
    selectedDate,
    shopServiceCategories,
    selectedStaff,
    setSelectedStaff,
    setSelectedTime,
    selectedTime,
    setData
}) {
    // Initialize selectedStaff if not set but shopStaff exists
    useEffect(() => {
        if (selectedStaff === null && shopStaff?.length > 0) {
            setSelectedStaff(0);
        }
    }, [shopStaff, selectedStaff, setSelectedStaff]);

    // Only update form data when we have valid values
    useEffect(() => {
        if (typeof setData === 'function') {
            const staffId = shopStaff && selectedStaff !== null && shopStaff[selectedStaff] 
                ? shopStaff[selectedStaff].id 
                : "";
                
            setData("staff_id", staffId);
            setData("staff_index", selectedStaff !== null ? selectedStaff : "");
            setData("time", selectedTime || "");
        }
    }, [selectedStaff, selectedTime, shopStaff, setData]);

    // Store a reference to the current staff for safe access
    const currentStaff = useMemo(() => {
        return shopStaff && selectedStaff !== null ? shopStaff[selectedStaff] : null;
    }, [shopStaff, selectedStaff]);

    const businessHours = shop?.shop_operation_hours || [];
    const timeSlots = [
        "00:00:00", "00:30:00", "01:00:00", "01:30:00", "02:00:00", "02:30:00", "03:00:00", "03:30:00", "04:00:00", "04:30:00", "05:00:00", "05:30:00", "06:00:00", "06:30:00", "07:00:00", "07:30:00", "08:00:00", "08:30:00", "09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00", "11:30:00", "12:00:00", "12:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00", "15:00:00", "15:30:00", "16:00:00", "16:30:00", "17:00:00", "17:30:00", "18:00:00", "18:30:00", "19:00:00", "19:30:00", "20:00:00", "20:30:00", "21:00:00", "21:30:00", "22:00:00", "22:30:00", "23:00:00", "23:30:00"
    ];

    // Helper to parse "HH:MM:SS" into total minutes
    function parseTimeToMinutes(time) {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    }

    // Helper to format minutes back to HH:MM:SS format
    function formatMinutesToTime(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
        const minutes = (totalMinutes % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:00`;
    }

    const selectedDay = selectedDate
        ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        : null;

    const daySchedule = businessHours.find(hour => hour.day === selectedDay);
    const openingTime = daySchedule?.open_time || null;
    const closingTime = daySchedule?.close_time || null; 
    const isOpen = daySchedule?.is_open || 0;

    const service_ids = currentStaff?.appointments
        ? currentStaff.appointments.map(({ appointment }) =>
            appointment.appointment_services.map(service => service.service_id)
          )
        : [];

    const flattenedServiceIds = service_ids.flat();

    // Calculate the total duration of selected services
    const getTotalServiceDuration = () => {
        // Get selected service IDs from session data (passed from BookingStepOne)
        const selectedServiceIds = shop?.selected_services || [];
        
        // If no services are selected yet, return a default duration (e.g., 30 minutes)
        if (!selectedServiceIds || selectedServiceIds.length === 0) {
            return 30; // Default minimum appointment duration in minutes
        }
        
        // Calculate total duration of all selected services
        return selectedServiceIds.reduce((total, serviceId) => {
            const service = shopServiceCategories?.find(s => s.id === serviceId);
            if (service) {
                return total + (service.duration_hour * 60 + service.duration_minute);
            }
            return total;
        }, 0);
    };

    // Get the total appointment duration including selected services
    const appointmentDuration = useMemo(() => getTotalServiceDuration(), [shopServiceCategories]);

    // Buffer time in minutes (30 minutes)
    const BUFFER_TIME = 30;

    // Calculate total time needed (service duration + buffer)
    const totalTimeNeeded = appointmentDuration + BUFFER_TIME;

    // Format duration for display
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (hours > 0 && remainingMinutes > 0) {
            return `${hours}h ${remainingMinutes}m`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${remainingMinutes}m`;
        }
    };

    // Get the current time for real-time validation
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    
    // Update current time every minute to keep validation accurate
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60000); // Update every minute
        
        return () => clearInterval(timer);
    }, []);

    const businessHourTimeSlots = isOpen && openingTime && closingTime && selectedDate
        ? timeSlots.filter(time => {
            // Check if time is within business hours
            const isWithinBusinessHours = time >= openingTime && time <= closingTime;
            
            // Check if selected date is today
            const today = new Date(currentDateTime);
            const isToday = new Date(selectedDate).toDateString() === today.toDateString();
            
            // Always filter out past time slots for today
            if (isToday) {
                // Get current hours and minutes for precise time comparison
                const currentHour = today.getHours();
                const currentMinute = today.getMinutes();
                
                // Add 30 minutes minimum advance booking time
                const bookingThresholdMinutes = currentHour * 60 + currentMinute + 30;
                const bookingThresholdHour = Math.floor(bookingThresholdMinutes / 60);
                const bookingThresholdMin = bookingThresholdMinutes % 60;
                
                const thresholdTimeString = `${bookingThresholdHour.toString().padStart(2, '0')}:${bookingThresholdMin.toString().padStart(2, '0')}:00`;
                
                // Return false for time slots that are in the past or within the 30-minute threshold
                if (time <= thresholdTimeString) {
                    return false;
                }
            }
            
            // Calculate end time to ensure it doesn't go past closing time
            const slotMinutes = parseTimeToMinutes(time);
            const slotEndMinutes = slotMinutes + totalTimeNeeded;
            const closingMinutes = parseTimeToMinutes(closingTime);
            
            // Only show slots that end before closing time (including service duration and buffer)
            return isWithinBusinessHours && slotEndMinutes <= closingMinutes;
        })
        : [];

    // Check if a specific time slot is available
    const isTimeSlotAvailable = (time) => {
        if (!selectedDate || !currentStaff) return false;
        
        // Real-time check for current day and time
        const today = new Date(currentDateTime);
        const isToday = new Date(selectedDate).toDateString() === today.toDateString();
        
        if (isToday) {
            // Get time values
            const [slotHour, slotMinute] = time.split(':').map(Number);
            
            // Create a Date object for the time slot
            const slotTime = new Date(selectedDate);
            slotTime.setHours(slotHour, slotMinute, 0, 0);
            
            // Add 30 minute minimum advance booking
            const minimumBookingTime = new Date(today);
            minimumBookingTime.setMinutes(today.getMinutes() + 30);
            
            // Check if slot is in the past or within 30 minutes from now
            if (slotTime <= minimumBookingTime) {
                return false;
            }
        }
        
        // Calculate the start and end times for the potential new appointment
        const slotStartMinutes = parseTimeToMinutes(time);
        const slotEndMinutes = slotStartMinutes + totalTimeNeeded;
        const closingMinutes = parseTimeToMinutes(closingTime);
        
        // Check if the appointment would run past closing time
        if (slotEndMinutes > closingMinutes) return false;
        
        // Check conflicts with existing appointments
        const staffAppointments = currentStaff.appointments || [];
        
        // Check for overlaps with existing appointments, including buffer times
        return !staffAppointments.some(appointment => {
            if (!appointment.appointment) return false;
            
            // Only consider appointments on the same day and with upcoming status
            const isSameDay = new Date(appointment.appointment.date).toLocaleDateString() === 
                            new Date(selectedDate).toLocaleDateString();
            const isUpcoming = appointment.appointment.status === "upcoming";
            
            if (!isSameDay || !isUpcoming) return false;
            
            // Calculate the duration of this existing appointment
            const existingApptDuration = appointment.appointment.appointment_services.reduce(
                (sum, svc) => {
                    const serviceInfo = shopServiceCategories?.find(s => s.id === svc.service_id);
                    if (!serviceInfo) return sum;
                    return sum + (serviceInfo.duration_hour * 60 + serviceInfo.duration_minute);
                }, 0
            );
            
            // Calculate existing appointment start and end times with buffer
            const existingStartMinutes = parseTimeToMinutes(appointment.appointment.time);
            const existingEndMinutes = existingStartMinutes + existingApptDuration;
            
            // Add buffer to both existing appointment's start and end times
            const existingStartWithBuffer = existingStartMinutes - BUFFER_TIME;
            const existingEndWithBuffer = existingEndMinutes + BUFFER_TIME;
            
            // Check for overlap with buffers
            // Overlap occurs if:
            // - New slot starts during an existing appointment (with buffer)
            // - New slot ends during an existing appointment (with buffer)
            // - New slot completely contains an existing appointment (with buffer)
            return (
                (slotStartMinutes >= existingStartWithBuffer && slotStartMinutes < existingEndWithBuffer) ||
                (slotEndMinutes > existingStartWithBuffer && slotEndMinutes <= existingEndWithBuffer) ||
                (slotStartMinutes <= existingStartWithBuffer && slotEndMinutes >= existingEndWithBuffer)
            );
        });
    };
    
    // Get the closing time in human-readable format
    const formattedClosingTime = closingTime 
        ? new Date(`2021-01-01T${closingTime}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : '';

    // Determine if we can show staff details
    const canShowStaffDetails = Boolean(currentStaff?.staff);

    return (
        <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">Select Stylist/Barber</h2>
            
            {canShowStaffDetails && (
                <div className="max-w-full mb-5">
                    <Card className="border-primary/15 bg-card shadow-sm">
                        <CardHeader className="p-4 sm:p-5">
                            <div className="flex items-start gap-4 sm:gap-6">
                                <div className="overflow-hidden rounded-full aspect-square size-20 sm:size-28 border-2 border-primary/25 shadow-sm">
                                    {currentStaff.staff.profile_photo_path ? (
                                        <img
                                            src={`/storage/${currentStaff.staff.profile_photo_path}`}
                                            className="size-full object-cover"
                                            alt={currentStaff.staff.first_name}
                                        />
                                    ) : (
                                        <div className="size-full bg-primary/10 grid place-items-center uppercase text-xl sm:text-3xl text-primary">
                                            {currentStaff.staff.first_name[0] + currentStaff.staff.last_name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="pt-2 sm:pt-3">
                                    <CardTitle className="text-xl sm:text-2xl mb-1">
                                        {currentStaff.staff.first_name + ' ' + currentStaff.staff.last_name}
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        {currentStaff.role[0].toUpperCase() + currentStaff.role.slice(1)}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            )}
            
            {shopStaff?.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-base font-medium mb-3">Choose a staff member:</h3>
                    <ToggleGroup
                        type="single"
                        variant="outline"
                        value={currentStaff?.id?.toString()}
                        className="flex flex-wrap justify-start gap-2 sm:gap-3"
                    >
                        {shopStaff.map((staff, index) => (
                            <ToggleGroupItem
                                key={staff.id}
                                value={staff.id.toString()}
                                aria-label={`Select ${staff.staff.first_name} ${staff.staff.last_name}`}
                                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-sm sm:text-base px-3 sm:px-5 py-2 sm:py-3"
                                onClick={() => setSelectedStaff(index)}
                                data-state={selectedStaff === index ? "on" : "off"}
                            >
                                <h3 className="font-medium sm:font-bold">
                                    {`${staff.staff.first_name} ${staff.staff.last_name}`}
                                </h3>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>
            )}
            
            <div className="my-8">
                <div className="mb-5">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Select Time</h2>
                    <p className="text-sm text-muted-foreground">Unavailable time slots are shown in gray</p>
                    <p className="text-sm text-muted-foreground">All appointments include a 30-minute buffer time</p>
                    
                    {isOpen && closingTime && (
                        <Alert variant="outline" className="mt-4 mb-4 border-amber-200 bg-amber-50 text-amber-900">
                            <Clock className="h-5 w-5" />
                            <AlertDescription className="text-sm">
                                Your appointment requires {formatDuration(totalTimeNeeded)} total (including buffer). 
                                Bookings must be made at least 30 minutes in advance and cannot continue after {formattedClosingTime}.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                
                <ScrollArea className="h-80 sm:h-96 w-full rounded-md border shadow-inner pr-2">
                    {businessHourTimeSlots.length > 0 ? (
                        <ToggleGroup
                            type="single"
                            variant="outline"
                            value={selectedTime || undefined}
                            className="block space-y-2 sm:space-y-3 p-1"
                        >
                            {businessHourTimeSlots.map((time, index) => {
                                const isAvailable = isTimeSlotAvailable(time);
                                
                                // Calculate end time of this appointment
                                const startMinutes = parseTimeToMinutes(time);
                                const endMinutes = startMinutes + appointmentDuration;
                                const endTime = formatMinutesToTime(endMinutes);
                                
                                return (
                                    <ToggleGroupItem
                                        key={index}
                                        value={time}
                                        aria-label={`Select ${time}`}
                                        className={`block w-full text-left pl-5 sm:pl-6 h-14 sm:h-16 text-sm sm:text-base font-medium 
                                                  data-[state=on]:bg-primary data-[state=on]:text-primary-foreground
                                                  ${!isAvailable ? 'bg-secondary text-muted-foreground' : ''}`}
                                        onClick={() => { 
                                            // Force re-check availability in case time elapsed during selection
                                            if (isTimeSlotAvailable(time)) {
                                                setSelectedTime(time); 
                                            }
                                        }}
                                        disabled={selectedStaff === null || !isAvailable}
                                    >
                                        <div className="flex justify-between w-full pr-4 sm:pr-5">
                                            <div className="flex items-center">
                                                <span className="text-base sm:text-lg">
                                                    {new Date(`2021-01-01T${time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {!isAvailable && <span className="ml-3 text-sm sm:text-base opacity-70">(Unavailable)</span>}
                                            </div>
                                            {isAvailable && (
                                                <span className="text-sm text-muted-foreground">
                                                    ends at {new Date(`2021-01-01T${endTime}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                    </ToggleGroupItem>
                                );
                            })}
                        </ToggleGroup>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-base text-muted-foreground p-6">
                                {selectedDate && new Date(selectedDate).toDateString() === new Date().toDateString() 
                                    ? "No available time slots for today" 
                                    : "No available time slots for this date"}
                            </p>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}