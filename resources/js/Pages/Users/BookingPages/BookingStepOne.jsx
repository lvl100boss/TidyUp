import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, LogOut } from "lucide-react";
import AppointmentSummaryCard from "@/Components/User/BookingPages/AppointmentSummaryCard";
import StepsIndicator from "@/Components/User/BookingPages/StepsIndicator";
import AvailableDays from "@/Components/User/BookingPages/AvailableDays";
import { useState } from "react";
import AvailableTimeSlots from "@/Components/User/BookingPages/AvailableTimeSlots";

export default function Booking({ shop, businessDays, shopStaff }) {
    const [selectedDate, setSelectedDate] = useState(null);
    return (
        <>
            <Head title="Booking" />
            <UserLayout>
                <div className="">
                    <header className="flex justify-center relative ">
                        <Button className="absolute rounded-none border-b border-foreground left-0" variant="ghost" asChild>
                            <Link href={`/${shop.id}/shop`}>
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
                        <StepsIndicator step={1} />
                    </div>
                    <section className="mt-4 flex gap-5">
                        <div className="flex-1">
                            <AvailableDays shop={shop} businessDays={businessDays} setSelectedDate={setSelectedDate} />
                            <AvailableTimeSlots shop={shop} businessDays={businessDays} shopStaff={shopStaff} selectedDate={selectedDate} />
                        </div>
                        <div>
                            <AppointmentSummaryCard shop={shop} businessDays={businessDays} shopStaff={shopStaff} />
                        </div>
                    </section>
                </div>

            </UserLayout>
        </>
    );
}
