import UserLayout from "@/Layouts/UserLayout";
import AppointmentCard from "@/Components/User/AppointmentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Head } from "@inertiajs/react";

export default function Appointments({
    pendingAppointments,
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    declinedAppointments,
    startedAppointments,
}) {
    console.log("appointments", pendingAppointments);
    return (
        <UserLayout>
            <Head title="Appointments" />
            <Tabs
                defaultValue="upcoming"
                className="overflow-x-auto whitespace-nowrap"
            >
                {/* For Mobile View */}
                <div className="sm:hidden">
                    <TabsList className="mb-5 block w-min mx-auto">
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    <TabsList className="mb-5 block w-min mx-auto">
                        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                        <TabsTrigger value="no-show">No-Show</TabsTrigger>
                        <TabsTrigger value="declined">Declined</TabsTrigger>
                        <TabsTrigger value="started">Started</TabsTrigger>
                    </TabsList>
                </div>
                {/* For Large Screen */}
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

                {/* TabsContent sections remain unchanged */}
                <TabsContent
                    value="pending"
                    className="grid lg:grid-cols-2 gap-5 mt-0"
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
                    className="grid lg:grid-cols-2 gap-5 mt-0"
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
                    className="grid lg:grid-cols-2 gap-5 mt-0"
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
                    className="grid lg:grid-cols-2 gap-5 mt-0"
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
                    className="grid lg:grid-cols-2 gap-5 mt-0"
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
                    className="grid lg:grid-cols-2 gap-5 mt-0"
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
