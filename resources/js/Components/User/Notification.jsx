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
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Link, usePage } from "@inertiajs/react";

// Helper function to format date (optional, adjust as needed)
const formatNotificationDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Example format: "Apr 23, 2025, 10:30 AM" - adjust format as desired
    return date.toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true
    });
};

export function Notification({ className, ...props }) {
    // Access notifications shared globally via Inertia
    const { auth } = usePage().props;
    const notifications = auth?.notifications ?? [];


    return (
        <Drawer
            direction="right"
            size="sm"
            {...props} // Pass down any other props
        >
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    radius="round"
                    size="icon"
                    className={className} // Allow styling the trigger container
                >
                    <Bell className="stroke-2" />
                    {/* Optional: Add badge for unread count */}
                    {/* {unreadCount > 0 && <span className="..."></span>} */}
                </Button>
            </DrawerTrigger>
            <DrawerContent> {/* Apply padding here if needed for the whole content area */}
                <DrawerHeader> {/* Removed relative class, assuming not needed */}
                    <DrawerTitle>Notifications</DrawerTitle>
                    <DrawerDescription>Stay up to date with the latest activity.</DrawerDescription>
                </DrawerHeader>
                <Separator />
                {/* ScrollArea takes full height minus header/footer */}
                <ScrollArea className="h-[calc(100vh-150px)] mt-4">
                    {/* Removed the div with p-4. Padding can be added to DrawerContent or individual items if necessary */}
                    {notifications.length > 0 ? (
                        notifications.map((notification) => {
                            // Add checks for notification and data integrity
                            if (!notification || !notification.data) {
                                console.warn("Received incomplete notification:", notification);
                                return null; // Skip rendering malformed notification
                            }

                            const { id, data, created_at } = notification;
                            // Provide default values for potentially missing data fields
                            const { title = "Notification", message = "No message content.", link } = data;
                            // Define the Card structure once
                            const notificationCard = (
                                <div className="p-4 bg-background/50 rounded-lg m-4 border" > {/* Use mb-2 for spacing between cards */}
                                    <div className="mb-4">
                                        <div>{title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatNotificationDate(created_at)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="p-4 bg-muted/50 rounded-lg">
                                            <p className="text-sm">{message}</p>
                                        </div>
                                    </div>
                                </div>
                            );

                            // Render Link conditionally wrapping the Card
                            return (
                                <div key={id}> {/* Use a simple div or fragment as the key holder */}
                                    {link ? (
                                        <Link href={link}>
                                            {notificationCard}
                                        </Link>
                                    ) : (
                                        notificationCard
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        // Use Card components for the empty state message for consistent styling
                        <Card className="border-none shadow-none">
                            <CardContent>
                                <CardDescription className="text-center"> {/* Use text-center utility if absolutely needed, or structure differently */}
                                    No new notifications.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    )}
                </ScrollArea>
                <DrawerFooter className="mt-auto sm:hidden">
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
