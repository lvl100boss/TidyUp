import ShopsLayout from "@/Layouts/ShopsLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Head, usePage } from "@inertiajs/react";
import MyAppointments from "@/Components/Appointments/MyAppointments";
import AllAppointments from "@/Components/Appointments/AllAppointments";
import { Toaster } from "@/Components/ui/sonner"
import { toast } from "sonner"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

export default function Appointments({ myAppointments, upcomingSchedules, shopBusinessSchedules, shopAppointments, rescheduleRequests }) {

    const { flash } = usePage().props;

    // Initialize state with value from localStorage or default to "myAppointments"
    const [activeTab, setActiveTab] = useState(() =>
        localStorage.getItem("appointmentsActiveTab") || "myAppointments"
    );

    // Function to handle tab change
    const handleTabChange = (value) => {
        setActiveTab(value);
        localStorage.setItem("appointmentsActiveTab", value);
    };

    // Helper function to parse time strings to minutes
    const parseTimeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Helper to check if two appointments overlap
    const checkAppointmentOverlap = (appointment1, appointment2) => {
        // Check if they're on the same date
        if (appointment1.date !== appointment2.date) {
            return false;
        }

        // Convert times to minutes for easier comparison
        const start1 = parseTimeToMinutes(appointment1.time);
        const start2 = parseTimeToMinutes(appointment2.time);
        
        // Calculate end times (use end_time if available, otherwise estimate 30 minutes)
        let end1 = appointment1.end_time 
            ? parseTimeToMinutes(appointment1.end_time) 
            : start1 + 30;
        
        let end2 = appointment2.end_time 
            ? parseTimeToMinutes(appointment2.end_time) 
            : start2 + 30;
            
        // Check for overlap: appointment1 starts before appointment2 ends AND appointment1 ends after appointment2 starts
        return start1 < end2 && end1 > start2;
    };

    // Helper to format time for debugging display
    const formatTimeForDisplay = (date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        });
    };

    // Enhanced helper to check if current time is within business hours (with debug info)
    const isWithinBusinessHours = () => {
        console.log("*** DEBUG: Checking if current time is within business hours ***");
        
        if (!shopBusinessSchedules || shopBusinessSchedules.length === 0) {
            console.log("DEBUG: No business schedules found");
            return { isOpen: false, reason: "No business schedule information available" };
        }
        
        const currentDate = new Date();
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDay = dayNames[currentDate.getDay()];
        
        console.log(`DEBUG: Current day: ${currentDay} (${currentDate.toDateString()})`);
        console.log(`DEBUG: Current time: ${formatTimeForDisplay(currentDate)}`);
        
        // Find today's business schedule
        const todaySchedule = shopBusinessSchedules.find(schedule => 
            schedule.day.toLowerCase() === currentDay
        );
        
        // Log all business schedules for debugging
        console.log("DEBUG: All business schedules:", shopBusinessSchedules);
        
        // If no schedule found or shop is closed today
        if (!todaySchedule) {
            console.log("DEBUG: No schedule found for today");
            return { isOpen: false, reason: `Shop is closed on ${currentDay}` };
        }
        
        if (!todaySchedule.is_open) {
            console.log("DEBUG: Shop is closed today according to schedule");
            return { isOpen: false, reason: `Shop is closed on ${currentDay}` };
        }
        
        console.log(`DEBUG: Today's schedule: Open: ${todaySchedule.open_time}, Close: ${todaySchedule.close_time}`);
        
        // Get current time in minutes
        const currentHour = currentDate.getHours();
        const currentMinute = currentDate.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        
        // Convert business hours to minutes
        const openingTimeInMinutes = parseTimeToMinutes(todaySchedule.open_time);
        const closingTimeInMinutes = parseTimeToMinutes(todaySchedule.close_time);
        
        console.log(`DEBUG: Current time in minutes: ${currentTimeInMinutes} (${currentHour}:${currentMinute.toString().padStart(2, '0')})`);
        console.log(`DEBUG: Opening time in minutes: ${openingTimeInMinutes}`);
        console.log(`DEBUG: Closing time in minutes: ${closingTimeInMinutes}`);
        
        // Check if current time is within business hours
        const isWithinHours = currentTimeInMinutes >= openingTimeInMinutes && 
                              currentTimeInMinutes <= closingTimeInMinutes;
        
        console.log(`DEBUG: Is within business hours? ${isWithinHours ? 'YES' : 'NO'}`);
        
        if (!isWithinHours) {
            if (currentTimeInMinutes < openingTimeInMinutes) {
                const minutesUntilOpening = openingTimeInMinutes - currentTimeInMinutes;
                const hours = Math.floor(minutesUntilOpening / 60);
                const minutes = minutesUntilOpening % 60;
                const timeMessage = hours > 0 
                    ? `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}` 
                    : `${minutes} minute${minutes > 1 ? 's' : ''}`;
                return { 
                    isOpen: false, 
                    reason: `Shop is not open yet. Opens in ${timeMessage}`,
                    openTime: todaySchedule.open_time
                };
            } else {
                return { 
                    isOpen: false, 
                    reason: `Shop is already closed for today. Closed at ${todaySchedule.close_time}`,
                    closeTime: todaySchedule.close_time
                };
            }
        }
        
        return { 
            isOpen: true,
            schedule: todaySchedule
        };
    };

    // Function to check appointment start constraints and return error reasons if any
    const getAppointmentStartConstraints = (appointment) => {
        // Skip constraint checks for non-upcoming appointments
        if (appointment.status !== 'upcoming') {
            return { canStart: true };
        }
        
        // 1. Check if Current Time ≥ Scheduled Time
        const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
        const currentDateTime = new Date();
        
        if (appointmentDateTime > currentDateTime) {
            // Calculate time remaining until the appointment
            const timeUntilAppointment = appointmentDateTime - currentDateTime;
            const minutesRemaining = Math.ceil(timeUntilAppointment / (1000 * 60));
            
            let timeMessage;
            if (minutesRemaining >= 60) {
                const hoursRemaining = Math.floor(minutesRemaining / 60);
                const mins = minutesRemaining % 60;
                timeMessage = `${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''}${mins > 0 ? ` and ${mins} minute${mins > 1 ? 's' : ''}` : ''}`;
            } else {
                timeMessage = `${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''}`;
            }
            
            return { 
                canStart: false, 
                reason: `Appointment cannot start yet. Scheduled to start in ${timeMessage}`,
                type: 'time',
                details: {
                    scheduledTime: appointmentDateTime,
                    minutesRemaining: minutesRemaining
                }
            };
        }
        
        // 2. Check for business hours
        const businessHoursCheck = isWithinBusinessHours();
        if (!businessHoursCheck.isOpen) {
            return { 
                canStart: false, 
                reason: businessHoursCheck.reason,
                type: 'business-hours',
                details: businessHoursCheck
            };
        }
        
        // 3. Check for conflicts with other appointments
        if (upcomingSchedules && upcomingSchedules.length > 0) {
            // Get current date and time
            const currentTime = new Date();
            const currentHour = currentTime.getHours().toString().padStart(2, '0');
            const currentMinute = currentTime.getMinutes().toString().padStart(2, '0');
            const currentTimeString = `${currentHour}:${currentMinute}:00`;
            const todayDate = currentTime.toISOString().split('T')[0];
            
            // Create a proxy for current "appointment" with current time
            const currentAppointment = {
                date: todayDate,
                time: currentTimeString,
                end_time: appointment.end_time
            };
            
            // Check if there's any ongoing appointment
            const ongoingAppointment = upcomingSchedules.find(schedule => 
                schedule.appointment_data.appointment.status === 'started'
            );
            
            if (ongoingAppointment) {
                // Get the end time of the ongoing appointment
                const ongoingEndTime = ongoingAppointment.end_time 
                    ? new Date(`${ongoingAppointment.date}T${ongoingAppointment.end_time}`)
                    : null;
                
                // Format the end time for display
                let endTimeDisplay = 'unknown time';
                if (ongoingEndTime) {
                    endTimeDisplay = ongoingEndTime.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
                
                return { 
                    canStart: false, 
                    reason: `Cannot start: There is already an ongoing appointment (ends at ${endTimeDisplay})`,
                    type: 'conflict',
                    details: {
                        conflictType: 'ongoing',
                        appointment: ongoingAppointment,
                        endTime: endTimeDisplay
                    }
                };
            }
            
            // Check for any upcoming appointment conflict
            const conflictingAppointment = upcomingSchedules.find(schedule => {
                // Don't compare with itself
                if (schedule.id === appointment.id) {
                    return false;
                }
                
                // Check upcoming appointments that start soon
                if (schedule.appointment_data.appointment.status === 'upcoming') {
                    const scheduledTime = new Date(`${schedule.date}T${schedule.time}`);
                    const timeDiff = (scheduledTime - currentTime) / (1000 * 60); // difference in minutes
                    
                    // Only consider appointments starting within 30 minutes or that would overlap
                    if (timeDiff > 30 && !checkAppointmentOverlap(currentAppointment, schedule)) {
                        return false;
                    }
                    
                    return checkAppointmentOverlap(currentAppointment, schedule);
                }
                
                return false;
            });
            
            if (conflictingAppointment) {
                const conflictTime = new Date(`${conflictingAppointment.date}T${conflictingAppointment.time}`);
                const formattedTime = conflictTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                return { 
                    canStart: false, 
                    reason: `Would conflict with appointment at ${formattedTime}`,
                    type: 'conflict',
                    details: {
                        conflictType: 'upcoming',
                        appointment: conflictingAppointment,
                        time: formattedTime
                    }
                };
            }
        }

        // All conditions met - can start the appointment
        return { 
            canStart: true,
            message: "All conditions met. You can start this appointment now."
        };
    };

    // Keep the original function but now it provides constraint information rather than true/false
    const shouldHideActionModals = (appointment) => {
        // We no longer hide the button - we will display errors instead
        // Just return false to always show the buttons
        return false;
    };

    // Get appointment constraints to pass to child components
    const getAppointmentConstraints = (appointment) => {
        return getAppointmentStartConstraints(appointment);
    };

    // Function to navigate to the walk-in booking page for guest customers
    const handleBookWalkIn = () => {
        const { staffData } = usePage().props;
        try {
            // Get shop ID directly from staffData
            const shopId = staffData?.shop_id;
            
            if (shopId) {
                // Navigate directly to booking step one with walkin and guest parameters
                window.location.href = `/${shopId}/booking/1?walkin=true&guest=true`;
            } else {
                console.error("Could not find shop ID in staff data");
                toast.error("Could not determine shop ID. Please try again.");
            }
        } catch (error) {
            console.error("Error navigating to walk-in booking:", error);
            toast.error("An error occurred when trying to book a walk-in appointment.");
        }
    };

    useEffect(() => {
        if (flash.message) {
            if (flash.success) {
                toast("Heads up!", {
                    description: flash.message,
                    duration: 5000,
                });
            } else {
                toast.error("Uh oh! Something went wrong.", {
                    description: flash.message,
                    duration: 5000,
                });
            }
        }
    }, [flash.message]);

    return (
        <ShopsLayout>
            <Head title="Appointments" />

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="myAppointments">My Appointments</TabsTrigger>
                    <TabsTrigger value="allAppointments">All Appointments</TabsTrigger>
                </TabsList>
                <TabsContent value="myAppointments">
                    <MyAppointments
                        appointments={myAppointments}
                        upcomingSchedules={upcomingSchedules}
                        shopBusinessSchedules={shopBusinessSchedules}
                        rescheduleRequests={rescheduleRequests}
                        shouldHideActionModals={shouldHideActionModals}
                        getAppointmentConstraints={getAppointmentConstraints}
                    />
                </TabsContent>
                <TabsContent value="allAppointments">
                    <AllAppointments 
                        appointments={shopAppointments} 
                        shouldHideActionModals={shouldHideActionModals}
                        getAppointmentConstraints={getAppointmentConstraints}
                    />
                </TabsContent>
            </Tabs>
            <Toaster />
        </ShopsLayout>
    );
}
