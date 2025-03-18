import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    CircleUser,
    Store,
    Wallet,
    BookOpenCheck,
    Users,
    TrendingUp,
    Calendar,
    Bell,
    Clock,
    Star,
    MessageSquare,
    Activity,
    DollarSign,
    CheckCircle2,
    Coins,
    Settings,
} from "lucide-react";
import ShopsLayout from "@/Layouts/ShopsLayout";
import { Head, Link } from "@inertiajs/react";
import { ScrollArea } from "@/components/ui/scroll-area"
import ShopStatusWarning from "@/Components/Shop/ShopStatusWarning";
import { Button } from "@/components/ui/button";

const Dashboard = ({
    shop,
    user,
    pendingAppointments = [],
    upcomingAppointments = [],
    popularServices = [],
    completedBookingsCount = 0,
    completedBookingsChange = 0,
    totalRevenue = 0,
    revenueChange = 0,
    shopStatusMessage,
    error,
    isOwner
}) => {
    // Handle any potential errors from the backend
    if (error) {
        return (
            <ShopsLayout>
                <Head title="Error" />
                <div className="flex-1 flex items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-red-600">Error Loading Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{error}</p>
                            <Button asChild className="mt-4">
                                <Link href="/">Return to Home</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </ShopsLayout>
        );
    }

    const stats = [
        {
            title: "Total Revenue",
            value: "₱" + parseFloat(totalRevenue).toFixed(2),
            icon: <Wallet className="h-4 w-4 text-muted-foreground" />,
            change: `${(revenueChange ?? 0) >= 0 ? '+' : ''}${(revenueChange ?? 0).toFixed(1)}% from last month`,
            trend: (revenueChange ?? 0) >= 0 ? "positive" : "negative",
        },
        {
            title: "Active Employees",
            value: "5",
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
            change: "2 new employees",
            trend: "positive",
        },
        {
            title: "Completed Bookings",
            value: completedBookingsCount,
            icon: <BookOpenCheck className="h-4 w-4 text-muted-foreground" />,

            change: `${(completedBookingsChange ?? 0) >= 0 ? '+' : ''}${(completedBookingsChange ?? 0).toFixed(1)}% from last month`,
            trend: (completedBookingsChange ?? 0) >= 0 ? "positive" : "negative",
        },
        {
            title: "Subscription Status",
            value: "Active",
            icon: <Coins className="h-4 w-4 text-muted-foreground" />,
            change: "Renewal due in 2 weeks",
            trend: "neutral",
        },
    ];



    const recentActivity = [
        {
            id: 1,
            type: "review",
            customer: "Maria Garcia",
            action: "left a 5-star review",
            time: "10 minutes ago",
            icon: <Star className="h-4 w-4" />,
        },
        {
            id: 2,
            type: "booking",
            customer: "Alex Wong",
            action: "booked a haircut",
            time: "25 minutes ago",
            icon: <Calendar className="h-4 w-4" />,
        },
        {
            id: 3,
            type: "message",
            customer: "Lisa Chen",
            action: "sent a message",
            time: "1 hour ago",
            icon: <MessageSquare className="h-4 w-4" />,
        },
        {
            id: 4,
            type: "completion",
            customer: "Tom Wilson",
            action: "completed their appointment",
            time: "2 hours ago",
            icon: <CheckCircle2 className="h-4 w-4" />,
        },
    ];


    const AppointmentCard = ({ title, appointments, icon, emptyMessage }) => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {icon}
                    {title} ({appointments.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {appointments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-6">
                        {emptyMessage}
                    </p>
                ) : (
                    <ScrollArea className="h-72 -m-2 p-2">
                        <div className="space-y-4">
                            {appointments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar className="border size-14">
                                            <AvatarImage
                                                src={`/storage/${apt.user.profile_photo_path}`}
                                                alt={apt.user.first_name}
                                            />
                                            <AvatarFallback>
                                                <CircleUser className="h-6 w-6" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {apt.user.first_name} {apt.user.last_name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {apt.user.appointment_services
                                                    .filter(
                                                        (service) => service.appointment_id === apt.id
                                                    ).map(
                                                        (service) => service.shop_service.service_name
                                                    ).join(", ")}
                                            </p>
                                            <p className="text-sm text-green-600 font-bold">
                                                ₱{apt.total_price}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className="flex gap-1">
                                            <p className="text-sm text-muted-foreground">Stylist:</p>
                                            <p className="text-sm font-medium text-nowrap">
                                                {apt.user_appointments?.[0]?.staff?.staff?.first_name || "Unassigned"}
                                                {apt.user_appointments?.[0]?.staff?.staff?.last_name ?
                                                    ` ${apt.user_appointments[0].staff.staff.last_name}` : ""}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                apt.status === "confirmed"
                                                    ? "success"
                                                    : "secondary"
                                            }
                                        >
                                            {apt.status[0].toUpperCase() + apt.status.slice(1)}
                                        </Badge>
                                        <p className="text-sm font-medium">
                                            {new Date(`2000-01-01T${apt.time}`).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                        {apt.date && (
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(apt.date).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
    return (
        <ShopsLayout>
            <Head title="Dashboard" />
            <div className="flex-1 space-y-4">
                {/* Show status warning if applicable */}
                {shopStatusMessage && (
                    <ShopStatusWarning statusMessage={shopStatusMessage} />
                )}
                
                {isOwner && (
                    <div className="flex justify-end">
                        <Link href="/shop/profile">
                            <Button variant="outline">
                                <Settings className="w-4 h-4 mr-2" />
                                Edit Shop Profile
                            </Button>
                        </Link>
                    </div>
                )}
                
                {/* Rest of the dashboard */}
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight">
                            {shop.shop_name}
                        </h2>
                        <p className="text-muted-foreground">
                            Welcome back, {user.first_name}!
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                {stat.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stat.value}
                                </div>
                                <p
                                    className={`text-xs ${stat.trend === "positive"
                                        ? "text-green-600"
                                        : stat.trend === "negative"
                                            ? "text-red-600"
                                            : "text-muted-foreground"
                                        }`}
                                >
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <AppointmentCard
                        title="Pending Appointments"
                        appointments={pendingAppointments}
                        icon={<Clock className="h-4 w-4" />}
                        emptyMessage="No pending appointments"
                    />

                    <AppointmentCard
                        title="Upcoming Appointments"
                        appointments={upcomingAppointments}
                        icon={<Calendar className="h-4 w-4" />}
                        emptyMessage="No upcoming appointments"
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-3 border-b pb-3 last:border-0"
                                    >
                                        <div className="mt-1">
                                            {activity.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm">
                                                <span className="font-medium">
                                                    {activity.customer}
                                                </span>{" "}
                                                {activity.action}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Popular Services Section */}
                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Popular Services</CardTitle>
                            <CardDescription>
                                Top booked services
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {popularServices.length === 0 ? (
                                <p className="text-center text-muted-foreground py-6">
                                    No service booking data available yet
                                </p>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    {popularServices.slice(0, 4).map((item, index) => (
                                        <div key={index} className="border rounded-lg p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium line-clamp-1 text-sm">
                                                    {item.service.service_name}
                                                </h3>
                                                <Badge variant="secondary">
                                                    #{index + 1}
                                                </Badge>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        Bookings
                                                    </span>
                                                    <span className="font-medium">
                                                        {item.count}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        Price
                                                    </span>
                                                    <span className="font-medium text-green-600">
                                                        ₱{parseFloat(item.service.cost).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        Total Revenue
                                                    </span>
                                                    <span className="font-semibold text-green-600">
                                                        ₱{parseFloat(item.service.cost * item.count).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ShopsLayout>
    );
};

export default Dashboard;
