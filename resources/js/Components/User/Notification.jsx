import { Bell } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
    DrawerFooter,
} from "@/components/ui/drawerRight";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Card,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

// Helper function to format date
const formatNotificationDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
    });
};

export function Notification({ className, ...props }) {
    // Access notifications shared globally via Inertia
    const { auth } = usePage().props;
    const notifications = auth?.notifications ?? [];
    const [isOpen, setIsOpen] = useState(false);

    const handleNotificationClick = (e, notification) => {
        if (!notification || !notification.data) return;
        
        const { data } = notification;
        
        // Check if this is a completion notification that should trigger the modal
        const isCompletionNotification = 
            data.title === 'Appointment Marked as Completed' && 
            data.appointment_id;
        
        if (isCompletionNotification) {
            // Prevent default navigation
            e.preventDefault();
            
            // Close the notification drawer
            setIsOpen(false);
            
            // Store the appointment ID in sessionStorage for the Appointments component to read
            const appointmentId = parseInt(data.appointment_id, 10);
            sessionStorage.setItem('showCompletionModalForAppointment', appointmentId);
            
            // Navigate to the appointments page with completed tab active
            router.visit('/appointments?tab=completed', {
                preserveState: true,
                onSuccess: () => {
                    console.log("Navigation complete, modal should show for appointment:", appointmentId);
                }
            });
            
            // Stop event propagation
            e.stopPropagation();
            return false;
        } else if (data.link) {
            // For all other notifications with links, navigate normally
            router.visit(data.link);
            setIsOpen(false);
        }
    };

    return (
        <Drawer
            direction="right"
            size="sm"
            open={isOpen}
            onOpenChange={setIsOpen}
            {...props}
        >
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className={className}
                >
                    <Bell className="stroke-2" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Notifications</DrawerTitle>
                    <DrawerDescription>Stay up to date with the latest activity.</DrawerDescription>
                </DrawerHeader>
                <Separator />
                <ScrollArea className="h-[calc(100vh-150px)] mt-4">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => {
                            if (!notification || !notification.data) {
                                console.warn("Received incomplete notification:", notification);
                                return null;
                            }

                            const { id, data, created_at } = notification;
                            const { title = "Notification", message = "No message content.", link } = data;
                            
                            const notificationCard = (
                                <div className="p-4 rounded-lg m-4 border">
                                    <div className="mb-4">
                                        <div>{title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatNotificationDate(created_at)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="p-4 rounded-lg">
                                            <p className="text-sm">{message}</p>
                                        </div>
                                    </div>
                                </div>
                            );

                            return (
                                <div key={id}>
                              {link ? (
                                    <div 
                                        onClick={(e) => handleNotificationClick(e, notification)}
                                        className="cursor-pointer"
                                    >
                                        {notificationCard}
                                    </div>
                                ) : (
                                    notificationCard
                                )}
                                </div>
                            );
                        })
                    ) : (
                        <Card className="border-none shadow-none">
                            <CardContent>
                                <CardDescription className="text-center">
                                    No new notifications.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    )}
                </ScrollArea>
                <DrawerFooter className="mt-auto sm:hidden">
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}