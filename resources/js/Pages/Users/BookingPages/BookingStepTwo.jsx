import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { ChevronLeft, LogOut, AlertCircle } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useState, useEffect, useMemo } from "react";
import AppointmentSummaryCard from "@/Components/User/BookingPages/AppointmentSummaryCard";
import StepsIndicator from "@/Components/User/BookingPages/StepsIndicator";
import AvailableDays from "@/Components/User/BookingPages/AvailableDays";
import AvailableTimeSlots from "@/Components/User/BookingPages/AvailableTimeSlots";
import { Button } from "@/Components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BookingStepTwo({ shop, businessDays, shopStaff, shopServiceCategories, data, isPreview = false }) {
    const [selectedDate, setSelectedDate] = useState(data.date || null);
    const [selectedStaff, setSelectedStaff] = useState(data.staff_id || null);
    const [selectedTime, setSelectedTime] = useState(data.time || null);
    const [exceedsClosingTime, setExceedsClosingTime] = useState(false);

    const { data: formData, setData, post, processing, errors } = useForm({
        shop_id: shop.id,
        staff_id: data.staff_id || "",
        staff_index: data.staff_index || "",
        date: data.date || "",
        time: data.time || "",
    });

    // Helper functions to check if appointment exceeds closing time
    const parseTimeToMinutes = (time) => {
        if (!time) return 0;
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    };

    // Calculate the total service duration
    const getTotalServiceDuration = () => {
        // Get selected service IDs from session data
        const selectedServiceIds = data?.service_id || [];
        
        // If no services are selected, return a default duration
        if (!selectedServiceIds || selectedServiceIds.length === 0) {
            return 30; // Default minimum duration in minutes
        }
        
        // Calculate total duration
        return selectedServiceIds.reduce((total, serviceId) => {
            const service = shopServiceCategories?.find(s => s.id === serviceId);
            if (service) {
                return total + (service.duration_hour * 60 + service.duration_minute);
            }
            return total;
        }, 0);
    };
    
    const appointmentDuration = useMemo(() => getTotalServiceDuration(), [data?.service_id, shopServiceCategories]);
    const BUFFER_TIME = 30; // 30-minute buffer
    
    // Check if appointment would exceed closing time
    useEffect(() => {
        if (selectedDate && selectedTime) {
            const selectedDay = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            const daySchedule = shop?.shop_operation_hours?.find(hour => hour.day === selectedDay);
            
            if (daySchedule?.close_time) {
                const startMinutes = parseTimeToMinutes(selectedTime);
                const endMinutes = startMinutes + appointmentDuration + BUFFER_TIME;
                const closingMinutes = parseTimeToMinutes(daySchedule.close_time);
                
                setExceedsClosingTime(endMinutes > closingMinutes);
            }
        }
    }, [selectedDate, selectedTime, appointmentDuration, shop?.shop_operation_hours]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Prevent submission if appointment would exceed closing time
        if (exceedsClosingTime) {
            return;
        }
        
        // Use the appropriate route based on preview status
        if (isPreview) {
            post(`/${shop.id}/preview/booking/2`);
        } else {
            post(`/${shop.id}/booking/2`);
        }
    }

    const selectedServices = data && data.service_id ? data.service_id : [];

    // Format time for display
    const formatTime = (time) => {
        if (!time) return '';
        return new Date(`2021-01-01T${time}`).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    // Get the closing time in formatted display
    const getClosingTime = () => {
        if (!selectedDate) return '';
        
        const selectedDay = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const daySchedule = shop?.shop_operation_hours?.find(hour => hour.day === selectedDay);
        
        return formatTime(daySchedule?.close_time);
    };

    return (
        <>
            <Head title="Choose Date & Time" />
            <UserLayout>
                <div className="min-h-screen container mx-auto px-4 pb-10">
                    <header className="flex justify-center relative py-6 border-b mb-8">
                        <Button className="absolute left-0" variant="ghost" asChild>
                            <Link href={isPreview ? `/${shop.id}/preview/booking/1` : `/${shop.id}/booking/1`}>
                                <ChevronLeft className="mr-2" />
                                Back
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold">Book Your Appointment</h1>
                        <Button className="absolute right-0" variant="ghost" asChild>
                            <Link href={`/${shop.id}/shop`}>
                                Exit
                                <LogOut className="ml-2" />
                            </Link>
                        </Button>
                    </header>
                    
                    <div className="max-w-3xl mx-auto mb-12">
                        <StepsIndicator step={2} />
                    </div>
                    
                    {/* Warning alert if appointment exceeds closing time */}
                    {exceedsClosingTime && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Booking Not Available</AlertTitle>
                            <AlertDescription>
                                Your selected appointment would end after the shop's closing time ({getClosingTime()}).
                                Please select an earlier time slot or a different service.
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Left side: Calendar and Time selection */}
                        <div className="lg:col-span-3">
                            <div className="bg-card rounded-xl p-6 shadow-sm border mb-8">
                                <h2 className="text-2xl font-bold mb-6">Select Date</h2>
                                <AvailableDays
                                    shop={shop}
                                    businessDays={businessDays}
                                    setSelectedDate={setSelectedDate}
                                    setData={setData}
                                />
                            </div>
                            
                            <div className="bg-card rounded-xl p-6 shadow-sm border">
                                <AvailableTimeSlots
                                    shop={shop}
                                    shopStaff={shopStaff}
                                    selectedDate={selectedDate}
                                    shopServiceCategories={shopServiceCategories}
                                    setSelectedStaff={setSelectedStaff}
                                    selectedStaff={selectedStaff}
                                    setSelectedTime={setSelectedTime}
                                    selectedTime={selectedTime}
                                    setData={setData}
                                />
                            </div>
                        </div>
                        
                        {/* Right side: Appointment Summary */}
                        <div className="lg:col-span-2">
                            <div className="sticky top-8">
                                <div className="bg-card rounded-xl p-6 shadow border mb-4">
                                    <h2 className="text-2xl font-bold mb-6">Appointment Summary</h2>
                                    <AppointmentSummaryCard
                                        shop={shop}
                                        shopStaff={shopStaff}
                                        selectedDate={selectedDate}
                                        selectedStaff={selectedStaff}
                                        selectedTime={selectedTime}
                                        selectedServices={selectedServices}
                                    />
                                </div>
                                
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="shop_id" value={formData.shop_id} />
                                    <input type="hidden" name="staff_id" value={formData.staff_id} />
                                    <input type="hidden" name="staff_index" value={formData.staff_index} />
                                    <input type="hidden" name="date" value={formData.date} />
                                    <input type="hidden" name="time" value={formData.time} />
                                    <Button
                                        className="w-full py-6 text-lg font-bold"
                                        type="submit"
                                        size="lg"
                                        variant="default"
                                        disabled={!selectedTime || exceedsClosingTime}
                                    >
                                        {processing ? "Processing..." : "Continue to Confirmation"}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </UserLayout>
        </>
    );
}