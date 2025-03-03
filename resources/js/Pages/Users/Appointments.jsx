import UserLayout from "@/Layouts/UserLayout";
import AppointmentCard from "@/Components/User/AppointmentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Head, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { FlashMessage } from "@/Components/FlashMessage"


export default function Appointments({
    pendingAppointments,
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    declinedAppointments,
    startedAppointments,
}) {
    const { flash } = usePage().props;
    const [flashState, setFlashState] = useState({ message: flash.message, success: flash.success });
    const [activeTab, setActiveTab] = useState("upcoming");

    // Handle flash message display
    useEffect(() => {
        if (flash.message) {
            setFlashState({ message: flash.message, success: flash.success });
            const timer = setTimeout(() => setFlashState({ message: "", success: flash.success }), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash.message, flash.success]);

    // Handle tab change on successful booking
    useEffect(() => {
        if (flash.message === "Appointment has been booked successfully") {
            setActiveTab("pending");
        }
    }, [flash.message]);

    const appointmentTypes = [
        "pending",
        "upcoming",
        "completed",
        "cancelled",
        "no-show",
        "declined",
        "started",
    ];

    const appointmentData = {
        pending: pendingAppointments,
        upcoming: upcomingAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
        "no-show": noShowAppointments,
        declined: declinedAppointments,
        started: startedAppointments,
    };

    const getAppointmentContent = (type) => {
        const appointments = appointmentData[type];

        return (
            <TabsContent value={type} className="grid gap-5 mt-0 w-full">
                {appointments && appointments.length > 0 ? (
                    appointments
                        .filter(
                            (appointment) =>
                                new Date(appointment.created_at) <= new Date()
                        )
                        .map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))
                ) : (
                    <div>
                        <ApplicationLogo className="size-48 mx-auto mb-1 opacity-40 dark:invert" />
                        <p className="text-center font-bold text-2xl opacity-40">
                            No {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                            appointments
                        </p>
                    </div>
                )}
            </TabsContent>
        );
    };

    return (
        <UserLayout>
            <FlashMessage message={flashState.message} success={flashState.success} />

            <Head title="Appointments" />
            <h1 className="text-2xl figtree-semibold mt-2 lg:mb-3 lg:mt-0 uppercase">
                My Appointments
            </h1>
            <Tabs
                defaultValue={activeTab}
                value={activeTab}
                onValueChange={setActiveTab}
                className="overflow-x-auto whitespace-nowrap  min-h-screen"
            >
                {/* Mobile View - Select Dropdown */}
                <div className="sm:hidden w-full">
                    <Select
                        value={activeTab}
                        qqq
                        onValueChange={setActiveTab}
                        className="w-full "
                    >
                        <SelectTrigger className="mb-5 mt-2">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {appointmentTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() +
                                        type.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Desktop View - Tabs */}
                <div className="hidden sm:block">
                    <TabsList className="mb-5 block md:inline-flex w-min mx-auto lg:mx-0">
                        {appointmentTypes.map((type) => (
                            <TabsTrigger key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {appointmentTypes.map((type) => (
                    <div key={type}>{getAppointmentContent(type)}</div>
                ))}
            </Tabs>
        </UserLayout>
    );
}
