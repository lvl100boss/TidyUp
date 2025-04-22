import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import ResceduleAppointmentCard from "@/Pages/Users/AppointmentPartial/RescheduleAppointmentCard";
import { Separator } from "@/components/ui/separator"
import { Calendar, CheckCircle, Clock, Scissors, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Head, useForm, usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"
import UserLayout from "@/Layouts/UserLayout"
import AppointmentCard from "@/Components/User/AppointmentCard"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import FlashMessageWrapper from "@/Components/FlashMessageWrapper"

export default function Appointments({
    pendingAppointments,
    upcomingAppointments,
    completedAppointments,
    startedAppointments,
    cancelledAppointments,
    noShowAppointments,
    declinedAppointments,
}) {
    const { flash, auth } = usePage().props;
    const [flashState, setFlashState] = useState({ message: flash.message, success: flash.success });
    const [activeTab, setActiveTab] = useState("upcoming");
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [appointmentToReview, setAppointmentToReview] = useState(null);
    const [serviceRating, setServiceRating] = useState(0);
    const [staffRating, setStaffRating] = useState(0);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    const appointmentTypes = ["pending", "upcoming", "started", "completed", "cancelled", "declined", "no-show"];

    const appointmentData = {
        pending: pendingAppointments,
        upcoming: upcomingAppointments,
        completed: completedAppointments,
        started: startedAppointments,

    };

    const { data, setData, post, processing, errors, reset } = useForm({
        appointment_id: '',
        user_id: '',
        shop_id: '',
        service_rating: 0,
        staff_rating: 0,
        comment: '',
        confirm_completion: false
    });

    const confirmCompletionForm = useForm({
        appointment_id: '',
        _method: 'POST'
    });

    useEffect(() => {
        if (flash.message) {
            setFlashState({ message: flash.message, success: flash.success });
        }
    }, [flash.message, flash.success]);

    useEffect(() => {
        if (flash.message === "Appointment has been booked successfully") {
            setActiveTab("pending");
        }
    }, [flash.message]);

    const handleReviewClick = (appointment) => {
        setAppointmentToReview(appointment);
        setIsReviewDialogOpen(true);
        setData({
            appointment_id: appointment.id,
            user_id: auth.user.id,
            shop_id: appointment.shop_id,
            service_rating: 0,
            staff_rating: 0,
            comment: '',
            confirm_completion: false
        });
        setServiceRating(0);
        setStaffRating(0);
    };

    const submitReview = (e) => {
        e.preventDefault();
        post(route('appointments.review'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsReviewDialogOpen(false);
                if (!data.confirm_completion) {
                    setShowConfirmationDialog(true);
                    confirmCompletionForm.setData('appointment_id', appointmentToReview.id);
                }
                reset();
                setServiceRating(0);
                setStaffRating(0);
            }
        });
    };

    const confirmCompletion = (e) => {
        e.preventDefault();
        confirmCompletionForm.post(route('appointments.confirm-completion'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowConfirmationDialog(false);
                if (flash.message === "Appointment has been confirmed as completed") {
                    setActiveTab("completed");
                }
            }
        });
    };

    const viewReview = (appointment) => {
        if (appointment.review) {
            setAppointmentToReview(appointment);
            setData({
                appointment_id: appointment.id,
                user_id: auth.user.id,
                shop_id: appointment.shop_id,
                service_rating: appointment.review.service_rating,
                staff_rating: appointment.review.staff_rating,
                comment: appointment.review.comment || '',
            });
            setServiceRating(appointment.review.service_rating);
            setStaffRating(appointment.review.staff_rating);
            setIsReviewDialogOpen(true);
        }
    };

    const getAppointmentContent = (type) => {
        const appointments = appointmentData[type];
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
                                        {type === "started" && !appointment.has_review ? (
                                            <Button
                                                onClick={() => handleReviewClick(appointment)}
                                                className="bg-primary"
                                            >
                                                Rate & Review
                                            </Button>
                                        ) : type === "completed" && appointment.has_review ? (
                                            <Button
                                                onClick={() => viewReview(appointment)}
                                                variant="outline"
                                                className="flex gap-2"
                                            >
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                View Your Review
                                            </Button>
                                        ) : type === "completed" && !appointment.has_review ? (
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
                    <p>No appointments available.</p>
                )}
            </TabsContent>
        );
    };

    return (
        <UserLayout>
            <FlashMessageWrapper message={flashState.message} success={flashState.success} />

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
                <div className="sm:hidden w-full">
                    <Select value={activeTab} onValueChange={setActiveTab}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a tab" />
                        </SelectTrigger>
                        <SelectContent>
                            {appointmentTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="hidden sm:block">
                    <TabsList className="mb-5 block md:inline-flex w-min mx-autolg:mx-0 ">
                        {appointmentTypes.map((type) => (
                            <TabsTrigger key={type} value={type} className="capitalize">{type}</TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="tab-content-wrapper">
                    {appointmentTypes.map((type) => getAppointmentContent(type))}
                </div>
            </Tabs>

            <Dialog open={isReviewDialogOpen} onOpenChange={(open) => {
                if (!open && appointmentToReview?.review) {
                    setIsReviewDialogOpen(false);
                }
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Rate Your Experience</DialogTitle>
                        <DialogDescription>
                            {appointmentToReview?.review
                                ? "Your review for this appointment"
                                : "Share your feedback about the service you received"}
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
                                                className={`${appointmentToReview?.review ? "" : "cursor-pointer"} h-8 w-8 ${star <= serviceRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                onClick={() => {
                                                    if (!appointmentToReview?.review) {
                                                        setServiceRating(star);
                                                        setData('service_rating', star);
                                                    }
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
                                                className={`${appointmentToReview?.review ? "" : "cursor-pointer"} h-8 w-8 ${star <= staffRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                onClick={() => {
                                                    if (!appointmentToReview?.review) {
                                                        setStaffRating(star);
                                                        setData('staff_rating', star);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {errors.staff_rating && <p className="text-red-500 text-sm text-center">{errors.staff_rating}</p>}
                                </div>
                            </div>

                            <div>
                                <Label>Comment</Label>
                                <Textarea
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    rows={4}
                                    disabled={appointmentToReview?.review}
                                />
                                {errors.comment && <p className="text-red-500 text-sm">{errors.comment}</p>}
                            </div>

                            {!appointmentToReview?.review && appointmentToReview?.status === "started" && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="confirm_completion"
                                        checked={data.confirm_completion}
                                        onCheckedChange={(checked) => setData('confirm_completion', checked)}
                                    />
                                    <Label htmlFor="confirm_completion">
                                        Confirm appointment was completed successfully
                                    </Label>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            {appointmentToReview?.review ? (
                                <Button
                                    type="button"
                                    onClick={() => setIsReviewDialogOpen(false)}
                                >
                                    Close
                                </Button>
                            ) : (
                                <>
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
                                </>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Appointment Completion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Thank you for your review! Please confirm that your appointment was completed successfully.
                            This helps us maintain accurate records of service delivery.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Not Now</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmCompletion} className="bg-primary">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Completion
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </UserLayout>
    );
}
