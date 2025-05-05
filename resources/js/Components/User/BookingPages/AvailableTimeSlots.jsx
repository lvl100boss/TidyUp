import React, { useState, useEffect, useMemo } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AvailableTimeSlots({
    shop,
    shopStaff,
    selectedDate,
    shopServiceCategories,
    selectedStaff,
    setSelectedStaff,
    setSelectedTime,
    selectedTime,
    setData,
    bufferTimeMinutes // Accept buffer time from parent
}) {
    // Use buffer time from props or fallback to shop settings or default value
    const BUFFER_TIME_MINUTES = bufferTimeMinutes || 
                                shop?.settings?.buffer_time_minutes || 
                                30;

    // Calculate total duration for selected services - SUM not MAX
    const calculateTotalDuration = (serviceIds) => {
        // Use shop's minimum duration setting or fall back to 30 minutes
        const minimumDuration = shop?.settings?.minimum_duration_minutes || 30;
        
        if (!Array.isArray(serviceIds) || serviceIds.length === 0) return minimumDuration;

        const calculatedDuration = serviceIds.reduce((total, id) => {
            const service = shopServiceCategories.find(s => s.id === id);
            if (!service) return total;
            return total + ((service.duration_hour * 60) + service.duration_minute);
        }, 0);
        
        // Ensure the duration is at least the minimum
        return Math.max(minimumDuration, calculatedDuration);
    };

    // State for service duration explanation
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);

    useEffect(() => {
        // Get service ids from session if available
        if (shop?.shop_service_categories) {
            const serviceIds = sessionStorage.getItem('selectedServiceIds');
            if (serviceIds) {
                try {
                    setSelectedServiceIds(JSON.parse(serviceIds));
                } catch (e) {
                    setSelectedServiceIds([]);
                }
            }
        }
    }, [shop]);

    useEffect(() => {
        setData("staff_id", shopStaff[selectedStaff]?.id);
        setData("staff_index", selectedStaff);
        setData("time", selectedTime);
        // Also pass buffer time in the data to ensure consistency
        setData("buffer_time_minutes", BUFFER_TIME_MINUTES);
    }, [selectedStaff, selectedTime]);

    const businessHours = shop.shop_operation_hours;

    // Helper functions for time manipulation
    const parseTimeToMinutes = (time) => {
        if (!time) return 0;
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    };

    const formatMinutesToTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
    };

    // Generate time slots dynamically based on business hours with smaller intervals
    const generateTimeSlots = (openTime, closeTime, intervalMinutes = 10) => {
        if (!openTime || !closeTime) return [];

        const slots = [];
        let currentMinutes = parseTimeToMinutes(openTime);
        const closingMinutes = parseTimeToMinutes(closeTime);

        while (currentMinutes < closingMinutes) {
            slots.push(formatMinutesToTime(currentMinutes));
            currentMinutes += intervalMinutes;
        }

        return slots;
    };

    const selectedDay = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const openingTime = businessHours.find(hour => hour.day === selectedDay)?.open_time || null;
    const closingTime = businessHours.find(hour => hour.day === selectedDay)?.close_time || null;
    const isOpen = businessHours.find(hour => hour.day === selectedDay)?.is_open || 0;

    // Calculate total service duration for selected services (sum, not max)
    const totalServiceDuration = calculateTotalDuration(selectedServiceIds);

    // Generate business hour time slots dynamically with improved caching
    const businessHourTimeSlots = useMemo(() => {
        if (!isOpen || !openingTime || !closingTime) return [];
        // Use smaller intervals (10 minutes) for more flexible booking options
        return generateTimeSlots(openingTime, closingTime, 10);
    }, [isOpen, openingTime, closingTime]);

    // Check if current time is greater than slot time when date is today
    const isTimeSlotInPast = (timeSlot) => {
        const today = new Date();
        const selectedDateObj = new Date(selectedDate);

        if (selectedDateObj.toDateString() !== today.toDateString()) {
            return false;
        }

    // Filter time slots to only show those within business hours
    const businessHourTimeSlots = isOpen ? timeSlots.filter(time => {
          // Check if time is within business hours
    const isWithinBusinessHours = time >= openingTime && time <= closingTime;
    
    // Check if selected date is today
    const today = new Date();
    const isToday = new Date(selectedDate).toDateString() === today.toDateString();
    
    // If today, also filter out times that have already passed
    if (isToday) {
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();
        const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;
        return isWithinBusinessHours && time > currentTimeString;
    }
    
    // For future dates, just use the business hours filter
    return isWithinBusinessHours;
}) : [];

    // Check if a specific time slot is available (not booked)
    const isTimeSlotAvailable = (time) => {
// requires user to book 1 hr from now on to prevent oraorada
const today = new Date();
const isToday = new Date(selectedDate).toDateString() === today.toDateString();

if (isToday) {
    // Create a buffer time 1 hour from now
    const bufferTime = new Date(today);
    bufferTime.setHours(bufferTime.getHours() + 1);
    
    // Convert the time slot to a Date object for comparison
    const [slotHour, slotMinute] = time.split(':').map(Number);
    const slotTime = new Date(selectedDate);
    slotTime.setHours(slotHour, slotMinute, 0, 0);
    
    // If the slot is within the next hour, mark as unavailable
    if (slotTime <= bufferTime) {
        return false;
    }
}
        
        const staffAppointments = shopStaff[selectedStaff]?.appointments || [];
        const [hours, minutes] = timeSlot.split(':');
        const slotTime = new Date();
        slotTime.setHours(parseInt(hours), parseInt(minutes), 0);

        return today > slotTime;
    };

    // Check if a specific time slot is available (not booked)
    const isTimeSlotAvailable = (time, staffIndex) => {
        // First check if the time is in the past
        if (isTimeSlotInPast(time)) return false;
        
        const currentMinutes = parseTimeToMinutes(time);
        const serviceEndMinutes = currentMinutes + totalServiceDuration;
        const bufferEndMinutes = serviceEndMinutes + BUFFER_TIME_MINUTES;
        
        // Get closing time in minutes
        const closingTimeMinutes = parseTimeToMinutes(closingTime);
        
        // If the service would end after closing time, mark as unavailable
        if (bufferEndMinutes > closingTimeMinutes) return false;

        // Check existing appointments (including pending)
        const staffAppointments = shopStaff[staffIndex]?.appointments || [];
        
        // Check ALL types of active appointments - including pending ones
        const bookedRanges = staffAppointments
            .filter(appointment =>
                new Date(appointment.appointment.date).toLocaleDateString() ===
                new Date(selectedDate).toLocaleDateString() &&
                ['pending', 'upcoming', 'started'].includes(appointment.appointment.status)
            )
            .map(appointment => {
                const serviceDurations = appointment.appointment.appointment_services.map(svc => {
                    const serviceInfo = shopServiceCategories.find(s => s.id === svc.service_id);
                    if (!serviceInfo) return 0;
                    return serviceInfo.duration_hour * 60 + serviceInfo.duration_minute;
                });

                const totalDuration = serviceDurations.reduce((sum, duration) => sum + duration, 0);
                const durationWithBuffer = totalDuration + BUFFER_TIME_MINUTES;
                const startMinutes = parseTimeToMinutes(appointment.appointment.time);
                const endMinutes = startMinutes + durationWithBuffer;
                
                // Include appointment status for potential UI differentiation
                return {
                    startMinutes,
                    endMinutes,
                    status: appointment.appointment.status
                };
            });

        // Check if the current time slot overlaps with any booked range
        return !bookedRanges.some(range => 
            (currentMinutes >= range.startMinutes && currentMinutes < range.endMinutes) ||
            (bufferEndMinutes > range.startMinutes && currentMinutes < range.endMinutes) ||
            (currentMinutes <= range.startMinutes && bufferEndMinutes >= range.endMinutes)
        );
    };

    // New helper function to determine if a slot has a pending appointment
    const getPendingAppointmentInfo = (time, staffIndex) => {
        if (!shopStaff[staffIndex]?.appointments) return null;
        
        const currentMinutes = parseTimeToMinutes(time);
        const serviceEndMinutes = currentMinutes + totalServiceDuration;
        const bufferEndMinutes = serviceEndMinutes + BUFFER_TIME_MINUTES;
        
        const staffAppointments = shopStaff[staffIndex].appointments;
        
        // Find pending appointments that overlap with this time slot
        const pendingAppointments = staffAppointments
            .filter(appointment => 
                new Date(appointment.appointment.date).toLocaleDateString() === 
                new Date(selectedDate).toLocaleDateString() && 
                appointment.appointment.status === 'pending'
            )
            .map(appointment => {
                const serviceDurations = appointment.appointment.appointment_services.map(svc => {
                    const serviceInfo = shopServiceCategories.find(s => s.id === svc.service_id);
                    if (!serviceInfo) return 0;
                    return serviceInfo.duration_hour * 60 + serviceInfo.duration_minute;
                });

                const totalDuration = serviceDurations.reduce((sum, duration) => sum + duration, 0);
                const durationWithBuffer = totalDuration + BUFFER_TIME_MINUTES;
                const startMinutes = parseTimeToMinutes(appointment.appointment.time);
                const endMinutes = startMinutes + durationWithBuffer;
                
                return {
                    startMinutes,
                    endMinutes,
                    id: appointment.appointment.id
                };
            })
            .filter(appt => 
                (currentMinutes >= appt.startMinutes && currentMinutes < appt.endMinutes) ||
                (bufferEndMinutes > appt.startMinutes && currentMinutes < appt.endMinutes) ||
                (currentMinutes <= appt.startMinutes && bufferEndMinutes >= appt.endMinutes)
            );
            
        return pendingAppointments.length > 0 ? pendingAppointments[0] : null;
    };

    // Get the next available time for a staff
    const getNextAvailableTime = (staffIndex) => {
        if (businessHourTimeSlots.length === 0) return null;

        // Start from the first time slot and find the earliest available
        for (const timeSlot of businessHourTimeSlots) {
            if (isTimeSlotAvailable(timeSlot, staffIndex)) {
                // Format time for display
                const date = new Date(`2021-01-01T${timeSlot}`);
                return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }
        }

        return "No availability today";
    };

    // Calculate real end time (without buffer) and buffer end time
    const calculateEndTimes = (timeSlot) => {
        if (!timeSlot) return { serviceEnd: "", bufferEnd: "" };

        const [hours, minutes, seconds] = timeSlot.split(':').map(Number);

        const startTime = new Date();
        startTime.setHours(hours, minutes, seconds);

        // Calculate when service ends (start time + service duration)
        const endTime = new Date(startTime.getTime() + totalServiceDuration * 60000);
        
        // Calculate when buffer ends (service end time + buffer time)
        const bufferEndTime = new Date(endTime.getTime() + BUFFER_TIME_MINUTES * 60000);

        return {
            serviceEnd: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            bufferEnd: bufferEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        };
    };

    // Get the availability percentage calculation by considering closing time
    const getStaffAvailabilityPercentage = (staffIndex) => {
        const availableSlots = businessHourTimeSlots.filter(time =>
            isTimeSlotAvailable(time, staffIndex)
        );
        
        // Only count slots that would be valid for the current service duration
        const validTimeSlots = businessHourTimeSlots.filter(time => {
            const currentMinutes = parseTimeToMinutes(time);
            const endMinutes = currentMinutes + totalServiceDuration + BUFFER_TIME_MINUTES;
            const closingMinutes = parseTimeToMinutes(closingTime);
            
            // Exclude slots that would end after closing time
            return endMinutes <= closingMinutes;
        });

        return validTimeSlots.length
            ? Math.round((availableSlots.length / validTimeSlots.length) * 100)
            : 0;
    };

    // Optimize time slot rendering for performance
    const renderTimeSlots = () => {
        // Split time slots into chunks for better performance
        const chunks = [];
        for (let i = 0; i < businessHourTimeSlots.length; i += 20) {
            chunks.push(businessHourTimeSlots.slice(i, i + 20));
        }

        return (
            <ToggleGroup
                type="single"
                variant="outline"
                className="block space-y-2"
                value={selectedTime}
                onValueChange={(value) => value && setSelectedTime(value)}
            >
                {chunks.map((chunk, chunkIndex) => (
                    <React.Fragment key={`chunk-${chunkIndex}`}>
                        {chunk.map((time, index) => {
                            const isAvailable = selectedStaff !== null && isTimeSlotAvailable(time, selectedStaff);
                            const pendingInfo = selectedStaff !== null ? getPendingAppointmentInfo(time, selectedStaff) : null;
                            const formattedTime = new Date(`2021-01-01T${time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                            const { serviceEnd, bufferEnd } = calculateEndTimes(time);
                            
                            // Check if this appointment would end after hours
                            const currentMinutes = parseTimeToMinutes(time);
                            const endMinutes = currentMinutes + totalServiceDuration + BUFFER_TIME_MINUTES;
                            const closingMinutes = parseTimeToMinutes(closingTime);
                            const wouldEndAfterHours = endMinutes > closingMinutes;
                            
                            const unavailableReason = wouldEndAfterHours 
                                ? 'Would end after closing time' 
                                : pendingInfo 
                                    ? 'Has pending appointment'
                                    : '(Unavailable)';

                            return (
                                <div key={`${chunkIndex}-${index}`} className="space-y-1">
                                    <ToggleGroupItem
                                        value={time}
                                        aria-label={`Select ${formattedTime}`}
                                        className={`block w-full text-left pl-6 h-auto py-2 font-bold 
                                                data-[state=on]:bg-foreground data-[state=on]:text-background
                                                ${!isAvailable ? 'bg-secondary text-muted-foreground' : ''}
                                                ${pendingInfo ? 'bg-amber-100 text-amber-800 border-amber-300' : ''}`}
                                        disabled={selectedStaff === null || !isAvailable || !!pendingInfo}
                                    >
                                        <div className="flex flex-col">
                                            <div className="flex items-center justify-between px-2">
                                                <span>{formattedTime}</span>
                                                <span>
                                                    {isAvailable && !pendingInfo ? serviceEnd : unavailableReason}
                                                </span>
                                            </div>
                                            {pendingInfo && (
                                                <div className="text-xs text-amber-700 px-2 mt-1">
                                                    <span className="font-medium">Pending Appointment</span>
                                                </div>
                                            )}
                                            {isAvailable && !pendingInfo && (
                                                <div className="flex items-center text-xs mt-1 text-muted-foreground">
                                                    <div className="w-full px-2">
                                                        <div className="flex justify-between">
                                                            <span>Service</span>
                                                            <span>Buffer ({BUFFER_TIME_MINUTES}m)</span>
                                                        </div>
                                                        <div className="mt-1 flex">
                                                            <div className="h-1 bg-foreground rounded-l flex-1"></div>
                                                            <div className="h-1 bg-amber-400 rounded-r w-2/5"></div>
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <span>{bufferEnd}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </ToggleGroupItem>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </ToggleGroup>
        );
    };

    return (
        <div>
            <h1 className="font-bold text-2xl mb-4">Select Stylist/Barber</h1>

            <Tabs defaultValue="grid" className="mb-6">
                <TabsList className="mb-4">
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {shopStaff.map((staff, index) => {
                        const availabilityPercentage = getStaffAvailabilityPercentage(index);
                        const nextAvailable = getNextAvailableTime(index);

                        return (
                            <Card
                                key={staff.id}
                                className={`hover:border-primary cursor-pointer transition-colors ${
                                    selectedStaff === index ? 'border-primary' : ''
                                }`}
                                onClick={() => setSelectedStaff(index)}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex items-start gap-3">
                                        <Avatar className="size-12">
                                            {staff.staff.profile_photo_path ? (
                                                <AvatarImage src={`/storage/${staff.staff.profile_photo_path}`} />
                                            ) : (
                                                <AvatarFallback>
                                                    {staff.staff.first_name[0] + staff.staff.last_name[0]}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{staff.staff.first_name} {staff.staff.last_name}</CardTitle>
                                            <CardDescription>{staff.role}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-medium">Availability</span>
                                        <Badge variant={availabilityPercentage > 50 ? "outline" : "secondary"}>
                                            {availabilityPercentage}% Available
                                        </Badge>
                                    </div>

                                    <div className="mb-2">
                                        <span className="text-xs text-muted-foreground">
                                            Next available: {nextAvailable}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-4 gap-1">
                                        {[...Array(8)].map((_, i) => {
                                            const segment = i / 8;
                                            const segmentStart = Math.floor(segment * businessHourTimeSlots.length);
                                            const segmentEnd = Math.floor((segment + 0.125) * businessHourTimeSlots.length);
                                            const segmentSlots = businessHourTimeSlots.slice(segmentStart, segmentEnd);

                                            const segmentAvailable = segmentSlots.some(time => isTimeSlotAvailable(time, index));

                                            return (
                                                <div 
                                                    key={i}
                                                    className={`h-1.5 rounded-full ${
                                                        segmentAvailable ? 'bg-primary' : 'bg-muted'
                                                    }`}
                                                ></div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </TabsContent>

                <TabsContent value="list">
                    <div className="space-y-2">
                        {shopStaff.map((staff, index) => {
                            const nextAvailable = getNextAvailableTime(index);
                            const availableSlots = businessHourTimeSlots.filter(time => 
                                isTimeSlotAvailable(time, index)
                            ).length;

                            return (
                                <Button
                                    key={staff.id}
                                    variant={selectedStaff === index ? "default" : "outline"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedStaff(index)}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <Avatar className="size-8">
                                            {staff.staff.profile_photo_path ? (
                                                <AvatarImage src={`/storage/${staff.staff.profile_photo_path}`} />
                                            ) : (
                                                <AvatarFallback>
                                                    {staff.staff.first_name[0] + staff.staff.last_name[0]}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="font-medium">{staff.staff.first_name} {staff.staff.last_name}</div>
                                            <div className="text-xs text-muted-foreground">{staff.role}</div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={availableSlots > 0 ? "outline" : "secondary"}>
                                                {nextAvailable}
                                            </Badge>
                                        </div>
                                    </div>
                                </Button>
                            );
                        })}
                    </div>
                </TabsContent>
            </Tabs>

            {selectedStaff !== null && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {shopStaff[selectedStaff]?.staff.first_name} {shopStaff[selectedStaff]?.staff.last_name}
                        </CardTitle>
                        <CardDescription>{shopStaff[selectedStaff]?.role}</CardDescription>
                    </CardHeader>
                </Card>
            )}

            <div className="my-10">
                <div className="my-4">
                    <h1 className="font-bold text-2xl">Select Time</h1>
                    <p className="text-sm text-muted-foreground">
                        Total service duration: {Math.floor(totalServiceDuration / 60)}h {totalServiceDuration % 60}m
                        <span className="ml-2 text-amber-600">(+ {BUFFER_TIME_MINUTES}m buffer)</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Buffer time is added between appointments to accommodate early arrivals or delays.
                    </p>
                </div>
                <ScrollArea className="h-72 w-full rounded-md border pr-2">
                    {renderTimeSlots()}
                </ScrollArea>
            </div>
        </div>
    );
}
