import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCard from "./AppointmentCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarPlus } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";
import AddAppointmentModal from "./AddAppointmentModal";

export default function MyAppointments({ 
    appointments, 
    upcomingSchedules, 
    shopBusinessSchedules, 
    rescheduleRequests, 
    shouldHideActionModals,
    getAppointmentConstraints 
}) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { staffData } = usePage().props;
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
    )?.value || "pending";

    // Updated function to handle walk-in booking for guest customers
    const handleBookWalkIn = () => {
        try {
            // Get shop ID directly from staffData
            const shopId = staffData?.shop_id;
            
            if (shopId) {
                // Navigate directly to booking step one with walkin parameter for guest
                window.location.href = `/${shopId}/booking/1?walkin=true&guest=true`;
            } else {
                console.error("Could not find shop ID in staff data");
                toast.error("Could not determine shop ID. Please try again.");
            }
        } catch (error) {
            console.error("Error navigating to walk-in booking:", error);
            toast.error("An error occurred when trying to book a walk-in appointment.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Appointments</h2>
                <Button onClick={handleBookWalkIn}>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Book Walk-in
                </Button>
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
                                    constraints={getAppointmentConstraints ? getAppointmentConstraints(appointment) : null}
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
                            constraints={getAppointmentConstraints ? getAppointmentConstraints(appointment) : null}
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
