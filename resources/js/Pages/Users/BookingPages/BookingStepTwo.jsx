import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { ChevronLeft, LogOut } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import AppointmentSummaryCard from "@/Components/User/BookingPages/AppointmentSummaryCard";
import StepsIndicator from "@/Components/User/BookingPages/StepsIndicator";
import AvailableDays from "@/Components/User/BookingPages/AvailableDays";
import AvailableTimeSlots from "@/Components/User/BookingPages/AvailableTimeSlots";
import { Button } from "@/Components/ui/button";

export default function BookingStepTwo({ shop, businessDays, shopStaff, shopServiceCategories, data, isPreview = false }) {
    const [selectedDate, setSelectedDate] = useState(data.date || null);
    const [selectedStaff, setSelectedStaff] = useState(data.staff_id || null);
    const [selectedTime, setSelectedTime] = useState(data.time || null);

    const { data: formData, setData, post, processing, errors } = useForm({
        shop_id: shop.id,
        staff_id: data.staff_id || "",
        staff_index: data.staff_index || "",
        date: data.date || "",
        time: data.time || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use the appropriate route based on preview status
        if (isPreview) {
            post(`/${shop.id}/preview/booking/2`);
        } else {
            post(`/${shop.id}/booking/2`);
        }
    }

    const selectedServices = data && data.service_id ? data.service_id : [];

    return (
        <>
            <Head title="Choose Date & Time" />
            <UserLayout>
                <div className="min-h-screen">
                    <header className="flex justify-center relative ">
                        <Button className="absolute rounded-none border-b border-foreground left-0" variant="ghost" asChild>
                            <Link href={isPreview ? `/${shop.id}/preview/booking/1` : `/${shop.id}/booking/1`}>
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
                    <section className="mt-4 flex gap-5">
                        <div className="flex-1">
                            <AvailableDays
                                shop={shop}
                                businessDays={businessDays}
                                setSelectedDate={setSelectedDate}
                                setData={setData}
                            />
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
                        <div>
                            <div className="sticky top-20 space-y-5">
                                <AppointmentSummaryCard
                                    shop={shop}
                                    shopStaff={shopStaff}
                                    selectedDate={selectedDate}
                                    selectedStaff={selectedStaff}
                                    selectedTime={selectedTime}
                                    selectedServices={selectedServices}
                                />
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="shop_id" value={formData.shop_id} />
                                    <input type="hidden" name="staff_id" value={formData.staff_id} />
                                    <input type="hidden" name="staff_index" value={formData.staff_index} />
                                    <input type="hidden" name="date" value={formData.date} />
                                    <input type="hidden" name="time" value={formData.time} />
                                    <Button
                                        className="w-full"
                                        type="submit"
                                        loading={processing}
                                        disabled={!selectedTime}
                                    >
                                        Next
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </UserLayout>
        </>
    );
}