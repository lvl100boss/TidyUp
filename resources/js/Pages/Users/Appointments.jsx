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
import { Head, Link, useForm, usePage } from "@inertiajs/react"
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
        cancelled: cancelledAppointments,
        "no-show": noShowAppointments,
        declined: declinedAppointments
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
        
        const formData = new FormData();
        formData.append('appointment_id', appointmentToReview.id);
        formData.append('user_id', auth.user.id);
        formData.append('shop_id', appointmentToReview.shop_id);
        formData.append('service_rating', serviceRating);
        formData.append('staff_rating', staffRating);
        formData.append('comment', data.comment || '');
        formData.append('confirm_completion', data.confirm_completion ? '1' : '0');
        
        post(route('appointments.review'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsReviewDialogOpen(false);
                if (!data.confirm_completion) {
                    setShowConfirmationDialog(true);
                    confirmCompletionForm.setData('appointment_id', appointmentToReview.id);
                } else {
                    window.location.reload();
                }
                reset();
                setServiceRating(0);
                setStaffRating(0);
            },
            onError: (errors) => {
                // Alert the user if there's an error
                if (errors.message) {
                    alert(errors.message);
                } else {
                    alert('There was an error submitting your review. Please try again later.');
                }
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
            <TabsContent value={type}
            className="grid gap-5 mt-0 w-full">
                {appointments && appointments.length > 0 ? (
                    appointments
                        .filter(
                            (appointment) =>
                                new Date(appointment.created_at) <= new Date()
                        )
                        .map((appointment) => (
                            <Link href={`/appointments/${appointment.id}`} key={appointment.id}>
                                <AppointmentCard
                                    appointment={appointment}
                                />
                            </Link>
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
            >
                <div className="sm:hidden">
                    <Select value={activeTab} onValueChange={setActiveTab}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a tab" />
                        </SelectTrigger>
                        <SelectContent>
                            {appointmentTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="hidden sm:block">
                <TabsList 
                className="mb-5 block md:inline-flex w-min mx-autolg:mx-0 ">
                        {appointmentTypes.map((type) => (
                            <TabsTrigger key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </TabsTrigger>
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
                                    <div 
                                    className="flex items-center justify-center space-x-1 mb-2">
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
        
                                    {errors.service_rating &&
                                    <p className="text-red-500 text-sm text-center">
                                        {errors.service_rating}</p>}
                                </div>

                                <div>
                                    <h3>Staff Performance</h3>
                                    <div>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                onClick={() => {
                                                    if (!appointmentToReview?.review) {
                                                        setStaffRating(star);
                                                        setData('staff_rating', star);
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {errors.staff_rating && <p>{errors.staff_rating}</p>}
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
                                {errors.comment && <p>{errors.comment}</p>}
                            </div>

                            {!appointmentToReview?.review && appointmentToReview?.status === "started" && (
                                <div>
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
                        <AlertDialogAction onClick={confirmCompletion}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Completion
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </UserLayout>
    );
}