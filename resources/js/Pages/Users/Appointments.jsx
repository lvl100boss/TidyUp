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

    return (
        <UserLayout>
            <Head title="Appointments" />
            <h1 className="text-2xl figtree-semibold mt-2 lg:mb-3 lg:mt-0 uppercase">
                My Appointments
            </h1>
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="overflow-x-auto whitespace-nowrap"
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
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="no-show">No-Show</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                            <SelectItem value="started">Started</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Desktop View - Tabs */}
                <div className="hidden sm:block">
                    <TabsList className="mb-5 block md:inline-flex w-min mx-auto lg:mx-0">
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                        <TabsTrigger value="no-show">No-Show</TabsTrigger>
                        <TabsTrigger value="declined">Declined</TabsTrigger>
                        <TabsTrigger value="started">Started</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent
                    value="pending"
                    className="grid 2xl:grid-cols-2 gap-5 mt-0"
                >
                    {pendingAppointments.length > 0 ? (
                        pendingAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))
                    ) : (
                        <p>No Pending appointments</p>
                    )}
                </TabsContent>

                <TabsContent
                    value="upcoming"
                    className="grid grid-cols-1 2xl:grid-cols-2 gap-5 mt-0"
                >
                    {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))
                    ) : (
                        <p>No Upcoming appointments</p>
                    )}
                </TabsContent>

                <TabsContent
                    value="completed"
                    className="grid 2xl:grid-cols-2 gap-5 mt-0"
                >
                    {completedAppointments.length > 0 ? (
                        completedAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))
                    ) : (
                        <p>No Completed appointments</p>
                    )}
                </TabsContent>

                <TabsContent
                    value="cancelled"
                    className="grid 2xl:grid-cols-2 gap-5 mt-0"
                >
                    {cancelledAppointments.length > 0 ? (
                        cancelledAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))
                    ) : (
                        <p>No Cancelled appointments</p>
                    )}
                </TabsContent>

                <TabsContent
                    value="no-show"
                    className="grid 2xl:grid-cols-2 gap-5 mt-0"
                >
                    {noShowAppointments.length > 0 ? (
                        noShowAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))
                    ) : (
                        <p>No No-Show appointments</p>
                    )}
                </TabsContent>

                <TabsContent
                    value="declined"
                    className="grid 2xl:grid-cols-2 gap-5 mt-0"
                >
                    {declinedAppointments.length > 0 ? (
                        declinedAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))
                    ) : (
                        <p>No Declined appointments</p>
                    )}
                </TabsContent>

                <TabsContent
                    value="started"
                    className="grid 2xl:grid-cols-2 gap-5 mt-0"
                >
                    {startedAppointments.length > 0 ? (
                        startedAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                            />
                        ))
                    ) : (
                        <p>No Started appointments</p>
                    )}
                </TabsContent>
            </Tabs>
        </UserLayout>
    );
}
