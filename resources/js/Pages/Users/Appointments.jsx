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
import { Head } from "@inertiajs/react";
import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Appointments({
    pendingAppointments,
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    declinedAppointments,
    startedAppointments,
}) {
    const [activeTab, setActiveTab] = useState("upcoming");

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
                    appointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                        />
                    ))
                ) : (
                    <>
                        <div>
                            <ApplicationLogo className="size-48 mx-auto mb-1 opacity-40" />
                            <p className="text-center font-bold text-2xl opacity-40">
                                No{" "}
                                {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                                appointments
                            </p>
                        </div>
                    </>
                )}
            </TabsContent>
        );
    };

    return (
        <UserLayout>
            <Head title="Appointments" />
            <h1 className="text-2xl figtree-semibold mt-2 lg:mb-3 lg:mt-0 uppercase">
                My Appointments
            </h1>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="overflow-x-auto whitespace-nowrap  min-h-screen"
            >
                {/* Mobile View - Select Dropdown */}
                <div className="sm:hidden w-full">
                    <Select
                        value={activeTab}
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

                {appointmentTypes.map((type) => getAppointmentContent(type))}
            </Tabs>
        </UserLayout>
    );
}
