import ShopsLayout from "@/Layouts/ShopsLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Head, usePage } from "@inertiajs/react";
import MyAppointments from "@/Components/Appointments/MyAppointments";
import AllAppointments from "@/Components/Appointments/AllAppointments";
import { Toaster } from "@/Components/ui/sonner"
import { toast } from "sonner"
import { useEffect, useState } from "react";

export default function Appointments({ myAppointments, upcomingSchedules, shopBusinessSchedules, shopAppointments, rescheduleRequests }) {

    const { flash } = usePage().props;

    // Initialize state with value from localStorage or default to "myAppointments"
    const [activeTab, setActiveTab] = useState(() =>
        localStorage.getItem("appointmentsActiveTab") || "myAppointments"
    );

    // Function to handle tab change
    const handleTabChange = (value) => {
        setActiveTab(value);
        localStorage.setItem("appointmentsActiveTab", value);
    };

    useEffect(() => {
        if (flash.message) {
            if (flash.success) {
                toast("Heads up!", {
                    description: flash.message,
                    duration: 5000,
                });
            } else {
                toast.error("Uh oh! Something went wrong.", {
                    description: flash.message,
                    duration: 5000,
                });
            }
        }
    }, [flash.message]);

    return (
        <ShopsLayout>
            <Head title="Appointments" />
            <div className="mb-6">
                <h1 className="text-3xl font-semibold tracking-tight">Appointments</h1>
            </div>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="myAppointments">My Appointments</TabsTrigger>
                    <TabsTrigger value="allAppointments">All Appointments</TabsTrigger>
                </TabsList>
                <TabsContent value="myAppointments">
                    <MyAppointments
                        appointments={myAppointments}
                        upcomingSchedules={upcomingSchedules}
                        shopBusinessSchedules={shopBusinessSchedules}
                        rescheduleRequests={rescheduleRequests}
                    />
                </TabsContent>
                <TabsContent value="allAppointments">
                    <AllAppointments appointments={shopAppointments} />
                </TabsContent>
            </Tabs>
        </ShopsLayout>
    );
}
