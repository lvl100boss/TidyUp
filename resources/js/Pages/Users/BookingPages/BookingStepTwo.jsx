import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { ChevronLeft, LogOut, AlertCircle, Calendar as CalendarIcon, Clock } from "lucide-react";
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

    const parseTimeToMinutes = (time) => {
        if (!time) return 0;
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
    };

    const getTotalServiceDuration = () => {
        const selectedServiceIds = data?.service_id || [];
        if (!selectedServiceIds || selectedServiceIds.length === 0) {
            return 30;
        }
        return selectedServiceIds.reduce((total, serviceId) => {
            const service = shopServiceCategories?.find(s => s.id === serviceId);
            if (service) {
                return total + (service.duration_hour * 60 + service.duration_minute);
            }
            return total;
        }, 0);
    };

    const appointmentDuration = useMemo(() => getTotalServiceDuration(), [data?.service_id, shopServiceCategories]);
    const BUFFER_TIME = 30;

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
        if (exceedsClosingTime) {
            return;
        }
        if (isPreview) {
            post(`/${shop.id}/preview/booking/2`);
        } else {
            post(`/${shop.id}/booking/2`);
        }
    }

    const selectedServices = data && data.service_id ? data.service_id : [];

    const formatTime = (time) => {
        if (!time) return '';
        return new Date(`2021-01-01T${time}`).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

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
                <div className="min-h-screen max-w-7xl mx-auto px-4 pb-10 sm:pb-12">
                    <header className="border-b mb-6 sm:mb-8">
                        <div className="py-4 sm:py-5 flex items-center justify-between">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={isPreview ? `/${shop.id}/preview/booking/1` : `/${shop.id}/booking/1`} className="flex items-center">
                                    <ChevronLeft className="mr-2 h-5 w-5" />
                                    <span className="text-base">Back to Services</span>
                                </Link>
                            </Button>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Book an Appointment</h1>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/${shop.id}/shop`} className="flex items-center">
                                    <span className="hidden sm:inline-block mr-2">Cancel</span>
                                    <LogOut className="h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </header>
                    
                    <div className="max-w-xl mx-auto mb-8 sm:mb-10">
                        <StepsIndicator step={2} />
                    </div>
                    
                    {exceedsClosingTime && (
                        <Alert variant="destructive" className="mb-8 max-w-3xl mx-auto">
                            <AlertCircle className="h-5 w-5" />
                            <AlertTitle className="text-base font-semibold">Booking Not Available</AlertTitle>
                            <AlertDescription className="text-sm">
                                Your selected appointment would end after the shop's closing time ({getClosingTime()}).
                                Please select an earlier time slot or a different service.
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
                        <div className="lg:col-span-3 order-2 lg:order-1">
                            <div className="bg-card rounded-lg p-5 sm:p-6 shadow border mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <CalendarIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold">Select Date</h2>
                                </div>
                                <p className="text-sm sm:text-base text-muted-foreground mb-5">
                                    Choose a date for your appointment. Only available dates are shown.
                                </p>
                                <AvailableDays
                                    shop={shop}
                                    businessDays={businessDays}
                                    setSelectedDate={setSelectedDate}
                                    setData={setData}
                                />
                            </div>
                            
                            <div className="bg-card rounded-lg p-5 sm:p-6 shadow border">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        <Clock className="h-6 w-6 text-primary" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold">Select Time & Stylist</h2>
                                </div>
                                <p className="text-sm sm:text-base text-muted-foreground mb-5">
                                    Choose your preferred time and stylist for the appointment.
                                </p>
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
                        
                        <div className="lg:col-span-2 order-1 lg:order-2">
                            <div className="sticky top-6">
                                <div className="bg-card rounded-lg p-5 sm:p-6 shadow border mb-5">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-4">Appointment Summary</h2>
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
                                        className="w-full py-6 text-base sm:text-lg font-medium"
                                        type="submit"
                                        size="lg"
                                        variant="default"
                                        disabled={!selectedTime || exceedsClosingTime}
                                    >
                                        {processing ? "Processing..." : "Continue to Confirmation"}
                                    </Button>
                                    {!selectedTime && (
                                        <p className="text-center text-sm text-muted-foreground mt-3">
                                            Please select a date, time and stylist to continue
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </UserLayout>
        </>
    );
}