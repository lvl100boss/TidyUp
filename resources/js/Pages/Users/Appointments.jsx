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
import { Head, usePage, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { FlashMessage } from "@/Components/FlashMessage"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import ResceduleAppointmentCard from "@/Pages/Users/AppointmentPartial/RescheduleAppointmentCard";
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Scissors, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function Appointments({
    pendingAppointments,
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    noShowAppointments,
    declinedAppointments,
    startedAppointments,
    requestRescheduleAppointments
}) {
    const { flash } = usePage().props;
    const [flashState, setFlashState] = useState({ message: flash.message, success: flash.success });
    const [activeTab, setActiveTab] = useState("upcoming");
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [appointmentToReview, setAppointmentToReview] = useState(null);
    const [serviceRating, setServiceRating] = useState(0);
    const [staffRating, setStaffRating] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        appointment_id: '',
        user_id: '',
        shop_id: '',
        service_rating: 0,
        staff_rating: 0,
        comment: ''
    });

    // Handle flash message display
    useEffect(() => {
        if (flash.message) {
            setFlashState({ message: flash.message, success: flash.success });
            const timer = setTimeout(() => setFlashState({ message: "", success: flash.success }), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash.message, flash.success]);

    // Handle tab change on successful booking
    useEffect(() => {
        if (flash.message === "Appointment has been booked successfully") {
            setActiveTab("pending");
        }
    }, [flash.message]);

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

    const handleReviewClick = (appointment) => {
        setAppointmentToReview(appointment);
        setIsReviewDialogOpen(true);
        setData({
            appointment_id: appointment.id,
            user_id: appointment.user_id,
            shop_id: appointment.shop_id,
            service_rating: 0,
            staff_rating: 0,
            comment: ''
        });
        setServiceRating(0);
        setStaffRating(0);
    };

    const submitReview = (e) => {
        e.preventDefault();
        post(route('reviews.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsReviewDialogOpen(false);
                reset();
                setServiceRating(0);
                setStaffRating(0);
            }
        });
    };

    const getAppointmentContent = (type) => {
        const appointments = appointmentData[type];
        console.log(appointments);
        return (
            <TabsContent value={type} className="grid gap-5 mt-0 w-full">
                {appointments && appointments.length > 0 ? (
                    appointments
                        .filter(
                            (appointment) =>
                                new Date(appointment.created_at) <= new Date()
                        )
                        .map((appointment) => (
                            <Dialog key={appointment.id}>
                                <DialogTrigger className="w-full">
                                    <AppointmentCard
                                        key={appointment.id}
                                        appointment={appointment}
                                    />
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Appointment Details</DialogTitle>
                                        <div className="flex items-center gap-4 pt-8 pb-4">
                                            <div className="size-20 overflow-hidden rounded-full">
                                                <img className="size-full object-cover" src={`/${appointment.shop.shop_photo}`} />
                                            </div>
                                            <div>
                                                <h1 className="text-xl font-semibold">
                                                    {appointment.shop.shop_name}
                                                </h1>
                                                <p className="text-sm text-muted-foreground">
                                                    {appointment.shop.detailed_address}
                                                </p>
                                            </div>
                                        </div>
                                        <Separator />
                                        <ScrollArea className="max-h-96 pr-2 -mr-2">
                                            <div className="pt-4 space-y-2 mb-5">
                                                <div className="flex items-center gap-2">
                                                    <Scissors className="size-4" />
                                                    <p>
                                                        Stylist: {appointment.user_appointments[0].staff.staff.first_name + ' ' + appointment.user_appointments[0].staff.staff.last_name}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="size-4" />
                                                    <p>Date: {new Date(appointment.date).toLocaleDateString("en-US", {
                                                        weekday: "short",
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "2-digit",
                                                    })}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="size-4" />
                                                    <p>Time: {new Date(`1970-01-01T${appointment.time}Z`).toLocaleTimeString(
                                                        "en-US",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        }
                                                    )}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h1 className="text-xl font-semibold mb-2">Services:</h1>
                                                <ul className="space-y-2">
                                                    {appointment.appointment_services.map((service) => (
                                                        <li key={service.shop_service.id}>
                                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                                <p>{service.shop_service.service_name} ({service.shop_service.duration_hour}h {service.shop_service.duration_minute}m)</p>
                                                                <p>Php {service.shop_service.cost}</p>
                                                            </div>
                                                            <Separator />
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="flex items-center justify-between mt-2">
                                                    <h1 className="text-xl font-semibold">Total:</h1>
                                                    <h1 className="text-xl font-semibold">Php {appointment.total_price}</h1>
                                                </div>
                                            </div>
                                        </ScrollArea>
                                        <Separator />
                                        {type === "completed" && !appointment.has_review ? (
                                            <Button 
                                                onClick={() => handleReviewClick(appointment)} 
                                                className="bg-primary"
                                            >
                                                Rate & Review
                                            </Button>
                                        ) : !["completed", "cancelled", "declined", "no-show"].includes(appointment.status) && (
                                            <>
                                                <Button variant="secondary">Request Reschedule</Button>
                                                <Button variant="destructive">Cancel Appointment</Button>
                                            </>
                                        )}
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        ))
                ) : (
                    <div>
                        <ApplicationLogo className="size-48 mx-auto mb-1 opacity-40 dark:invert" />
                        <p className="text-center font-bold text-2xl opacity-40">
                            No {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                            appointments
                        </p>
                    </div>
                )}
            </TabsContent>
        );
    };

    return (
        <UserLayout>
            <FlashMessage message={flashState.message} success={flashState.success} />

            <Head title="Appointments" />
            <h1 className="text-3xl font-semibold mt-2 lg:mb-3 lg:mt-0 uppercase">
                My Appointments
            </h1>
            <Tabs
                defaultValue={activeTab}
                value={activeTab}
                onValueChange={setActiveTab}
                className="overflow-x-auto whitespace-nowrap mb-20"
            >
                {/* Mobile View - Select Dropdown */}
                <div className="sm:hidden w-full">
                    <Select
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <SelectTrigger className="mb-5 mt-2">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {appointmentTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                                    {appointmentData[type]?.length > 0 && (
                                        <span>
                                            ({appointmentData[type]?.length})
                                        </span>
                                    )}
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
                                <div className="flex items-center gap-1">
                                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}{" "}</span>
                                    {appointmentData[type]?.length > 0 && (
                                        <div className="ml-1 bg-primary text-background font text-xs size-4 rounded-sm grid place-items-center">
                                            {appointmentData[type]?.length}
                                        </div>
                                    )}
                                </div>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {appointmentTypes.map((type) => (
                    <div key={type}>{getAppointmentContent(type)}</div>
                ))}
            </Tabs>

            <div className="pb-20">
                <h1 className="text-xl mt-2 lg:mb-3 lg:mt-0 ">
                    Reschedule Requests
                </h1>
                <div>
                    {requestRescheduleAppointments.length > 0 ? (
                        requestRescheduleAppointments.map((appointment) => {
                            const reschedData = JSON.parse(appointment.resched_data);
                            return (
                                <ResceduleAppointmentCard key={appointment.id} reschedData={reschedData} appointment={appointment}></ResceduleAppointmentCard>
                            );
                        })
                    ) : (
                        <div>
                            <ApplicationLogo className="size-48 mx-auto mb-1 opacity-40 dark:invert" />
                            <p className="text-center font-bold text-2xl opacity-40">
                                No reschedule requests
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Dialog */}
            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Rate Your Experience</DialogTitle>
                        <DialogDescription>
                            Share your feedback about the service you received
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitReview}>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Service Quality</h3>
                                    <div className="flex items-center justify-center space-x-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`cursor-pointer h-8 w-8 ${star <= serviceRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                onClick={() => {
                                                    setServiceRating(star);
                                                    setData('service_rating', star);
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {errors.service_rating && <p className="text-red-500 text-sm text-center">{errors.service_rating}</p>}
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium mb-2">Staff Performance</h3>
                                    <div className="flex items-center justify-center space-x-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`cursor-pointer h-8 w-8 ${star <= staffRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                onClick={() => {
                                                    setStaffRating(star);
                                                    setData('staff_rating', star);
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {errors.staff_rating && <p className="text-red-500 text-sm text-center">{errors.staff_rating}</p>}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Share details of your experience with this service..."
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    rows={4}
                                />
                                {errors.comment && <p className="text-red-500 text-sm">{errors.comment}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsReviewDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing || !serviceRating || !staffRating}
                            >
                                Submit Review
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </UserLayout>
    );
}
