import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { ChevronLeft, LogOut, CalendarIcon } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AppointmentSummaryCard from "@/Components/User/BookingPages/AppointmentSummaryCard";
import StepsIndicator from "@/Components/User/BookingPages/StepsIndicator";
import AvailableDays from "@/Components/User/BookingPages/AvailableDays";
import AvailableTimeSlots from "@/Components/User/BookingPages/AvailableTimeSlots";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function BookingStepTwo({ shop, businessDays, shopStaff, shopServiceCategories, data }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [error, setError] = useState(null);
    const [availabilityChecked, setAvailabilityChecked] = useState(false);
    
    // Use the buffer time from data or fallback to shop settings or default value
    const BUFFER_TIME_MINUTES = data.buffer_time_minutes || shop?.settings?.buffer_time_minutes || 30;

    const { data: formData, setData, post, processing, errors } = useForm({
        shop_id: shop.id,
        staff_id: "",
        staff_index: "",
        date: "",
        time: "",
        service_id: data.service_id || [],
        total_price: data.total_price || 0,
        attendees: data.attendees || [],
        buffer_time_minutes: BUFFER_TIME_MINUTES
    });

    // Validate that we have the required data from step 1
    useEffect(() => {
        if (!data.service_id || data.service_id.length === 0) {
            setError("No services selected. Please go back to step 1 and select services.");
        } else {
            setError(null);
        }
    }, [data.service_id]);

    // Check staff availability when date and time are selected
    useEffect(() => {
        if (selectedDate && selectedTime && formData.staff_id) {
            setAvailabilityChecked(true);
        } else {
            setAvailabilityChecked(false);
        }
    }, [selectedDate, selectedTime, formData.staff_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Additional validation before submission
        if (!formData.staff_id || !formData.date || !formData.time) {
            setError("Please select a staff member, date, and time before continuing.");
            return;
        }
        
        post(`/${shop.id}/booking/2`);
    }

    return (
        <>
            <Head title="Choose Date & Time" />
            <UserLayout>
                <div className="min-h-screen">
                    <header className="flex justify-center relative">
                        <Button className="absolute rounded-none border-b border-foreground left-0" variant="ghost" asChild>
                            <Link href={`/${shop.id}/booking/1`}>
                                <span><ChevronLeft className="mr-2" /></span>
                                Back
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">Appointment Processing</h1>
                        <Button className="absolute rounded-none border-b border-foreground right-0" variant="ghost" asChild>
                            <Link href={`/${shop.id}/shop`}>
                                Exit
                                <LogOut className="ml-2" />
                            </Link>
                        </Button>
                    </header>
                    <div className="mt-8 max-w-xl mx-auto">
                        <StepsIndicator step={2} />
                    </div>
                    
                    {/* Display error if any */}
                    {(error || errors.message) && (
                        <Alert variant="destructive" className="max-w-4xl mx-auto my-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {error || errors.message}
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    {/* Buffer time alert */}
                    <Alert variant="outline" className="max-w-4xl mx-auto my-4 border-amber-200 bg-amber-50 text-amber-800">
                        <CalendarIcon className="h-4 w-4" />
                        <AlertTitle>Buffer Time Included</AlertTitle>
                        <AlertDescription>
                            A {BUFFER_TIME_MINUTES}-minute buffer is added after each appointment to accommodate early arrivals 
                            or delays. This ensures a smooth experience for all customers.
                        </AlertDescription>
                    </Alert>
                    
                    <section className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Select Date & Time</CardTitle>
                                    <CardDescription>
                                        Choose your preferred appointment date and time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <AvailableDays
                                        shop={shop}
                                        businessDays={businessDays}
                                        setSelectedDate={setSelectedDate}
                                        setData={setData}
                                    />
                                    {selectedDate && (
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
                                            bufferTimeMinutes={BUFFER_TIME_MINUTES}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                            
                            <div className="w-full md:w-80">
                                <div className="sticky top-20 space-y-4">
                                    <AppointmentSummaryCard
                                        shop={shop}
                                        shopStaff={shopStaff}
                                        selectedDate={selectedDate}
                                        selectedStaff={selectedStaff}
                                        selectedTime={selectedTime}
                                        bookingMembers={data.booking_members}
                                    />
                                    
                                    <form onSubmit={handleSubmit}>
                                        <Button
                                            className="w-full"
                                            type="submit"
                                            disabled={processing || !selectedTime || !formData.staff_id || !formData.date}
                                        >
                                            Continue to Add Attendees
                                        </Button>
                                        
                                        {!selectedTime && (
                                            <p className="text-xs text-muted-foreground text-center mt-2">
                                                Please select a date, stylist, and time to continue
                                            </p>
                                        )}
                                        
                                        {availabilityChecked && (
                                            <p className="text-xs text-green-500 text-center mt-2">
                                                ✓ Staff member is available at this time
                                            </p>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </UserLayout>
        </>
    );
}