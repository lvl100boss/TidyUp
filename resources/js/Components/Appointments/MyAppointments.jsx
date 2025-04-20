import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCard from "./AppointmentCard";
import { Button } from "@/components/ui/button";
import AddAppointmentModal from "./AddAppointmentModal";
import { Separator } from "@/components/ui/separator"


export default function MyAppointments({ appointments, upcomingSchedules, shopBusinessSchedules, rescheduleRequests, shouldHideActionModals }) {
    console.log("rescheduleRequests", rescheduleRequests);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const statuses = [
        { value: "pending", label: "Pending" },
        { value: "upcoming", label: "Upcoming" },
        { value: "started", label: "Started" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "no-show", label: "No Show" },
        { value: "declined", label: "Rejected" },
    ];

    // Find the first status that has appointments and use it as default tab
    const defaultTab = statuses.find(status =>
        appointments[status.value] && appointments[status.value].length > 0
    )?.value || "upcoming";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Appointments</h2>
                <Button onClick={() => setIsAddModalOpen(true)}>Add Appointment</Button>
            </div>

            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="mb-4">
                    {statuses.map(status => (
                        <TabsTrigger
                            key={status.value}
                            value={status.value}
                        >
                            {status.label}
                            {appointments[status.value] && appointments[status.value].length > 0 &&
                                ` (${appointments[status.value].length})`
                            }
                        </TabsTrigger>
                    ))}
                </TabsList>

                {statuses.map(status => (
                    <TabsContent key={status.value} value={status.value} className="space-y-4">
                        {appointments[status.value]?.length > 0 ? (
                            appointments[status.value].map(appointment => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    upcomingSchedules={upcomingSchedules}
                                    shopBusinessSchedules={shopBusinessSchedules}
                                    hideActionModals={shouldHideActionModals ? shouldHideActionModals(appointment) : false}
                                />
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                No {status.label.toLowerCase()} appointments found.
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>

            <Separator />

            <div>
                <h2 className="text-xl font-semibold mb-5">Pending Rescedule</h2>
                {rescheduleRequests.length > 0 ? (
                    rescheduleRequests.map(appointment => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            upcomingSchedules={upcomingSchedules}
                            shopBusinessSchedules={shopBusinessSchedules}
                            hideActionModals={shouldHideActionModals ? shouldHideActionModals(appointment) : false}
                        />
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        No pending reschedule requests found.
                    </div>
                )}
            </div>

            <AddAppointmentModal isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} />
        </div>
    );
}
