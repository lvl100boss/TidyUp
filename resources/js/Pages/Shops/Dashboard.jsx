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
} from "lucide-react";
import ShopsLayout from "@/Layouts/ShopsLayout";
import { Head } from "@inertiajs/react";
import { ScrollArea } from "@/components/ui/scroll-area"

const Dashboard = ({ shop, user, pendingAppointments, upcomingAppointments }) => {

    console.log(pendingAppointments);
    const stats = [
        {
            title: "Total Revenue",
            value: "₱45,231.89",
            icon: <Wallet className="h-4 w-4 text-muted-foreground" />,
            change: "+20.1% from last month",
            trend: "positive",
        },
        {
            title: "Active Customers",
            value: "2,350",
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
            change: "+180 this week",
            trend: "positive",
        },
        {
            title: "Commpleted Bookings",
            value: "1,429",
            icon: <BookOpenCheck className="h-4 w-4 text-muted-foreground" />,

            change: "+19% from last month",
            trend: "positive",
        },
        {
            title: "Available Tokens",
            value: "20",
            icon: <Coins className="h-4 w-4 text-muted-foreground" />,
            change: "5 used this month",
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

    const popularServices = [
        { name: "Haircut", bookings: 45, revenue: "₱22,500" },
        { name: "Hair Color", bookings: 32, revenue: "₱80,000" },
        { name: "Manicure", bookings: 28, revenue: "₱9,800" },
        { name: "Facial", bookings: 25, revenue: "₱30,000" },
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

                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Popular Services</CardTitle>
                            <CardDescription>
                                Top performing services this month
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {popularServices.map((service, index) => (
                                    <div key={index} className="space-y-2">
                                        <h3 className="font-medium">
                                            {service.name}
                                        </h3>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Bookings
                                                </span>
                                                <span className="font-medium">
                                                    {service.bookings}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Revenue
                                                </span>
                                                <span className="font-medium text-green-600">
                                                    {service.revenue}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ShopsLayout>
    );
};

export default Dashboard;
