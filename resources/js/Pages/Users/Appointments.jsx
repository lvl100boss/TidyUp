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
import { Calendar, CheckCircle, Clock, Scissors, Star, LoaderCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/Components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/Components/ui/checkbox"
import { Label } from "@/Components/ui/label"
import { Head, Link, useForm, usePage } from "@inertiajs/react"
import { useEffect, useState, useRef } from "react"
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
import CompletionConfirmationModal from "@/Components/Appointments/CompletionConfirmationModal"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Pagination } from "@/Components/ui/pagination"
import { 
    PaginationContent, 
    PaginationItem, 
    PaginationNext, 
    PaginationPrevious 
} from "@/Components/ui/pagination"
import AppointmentDetailDialog from "@/Components/User/AppointmentDetailDialog";

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

    // Added states for completion confirmation modal
    const [completionModalOpen, setCompletionModalOpen] = useState(false);
    const [appointmentToConfirm, setAppointmentToConfirm] = useState(null);

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

    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
    
    const [appointmentData, setAppointmentData] = useState({
        pending: pendingAppointments || [],
        upcoming: upcomingAppointments || [],
        completed: completedAppointments || [],
        started: startedAppointments || [],
        cancelled: cancelledAppointments || [],
        declined: declinedAppointments || [],
        "no-show": noShowAppointments || [],
    });
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [error, setError] = useState(null);
    const pollingIntervalRef = useRef(null);

    const appointmentTypes = ["pending", "upcoming", "started", "completed", "cancelled", "declined", "no-show"];


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
            setFlashState({ 
                message: flash.message, 
                success: flash.success 
            });
            const timer = setTimeout(() => {
                setFlashState({ message: null, success: null });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash.message, flash.success]);

    useEffect(() => {
        if (flash.message === "Appointment has been booked successfully") {
            setActiveTab("pending");
        } else if (flash.message === "Appointment has been confirmed as completed") {
            setActiveTab("completed");
        } else if (flash.message && flash.message.includes("review")) {
            setActiveTab("completed");
        }
    }, [flash.message]);


    // Add effect to check for appointments needing confirmation
    useEffect(() => {
        // Find the first appointment that needs confirmation
        const needsConfirmation = completedAppointments?.find(
            app => app.status === 'completed' && !app.is_user_confirmed
        );
        
        if (needsConfirmation) {
            setAppointmentToConfirm(needsConfirmation);
            setCompletionModalOpen(true);
        }
    }, [completedAppointments]);

// Update the useEffect hook that handles sessionStorage
useEffect(() => {
    // Check if there's a stored appointment ID from notification click
    const storedAppointmentId = sessionStorage.getItem('showCompletionModalForAppointment');
    
    if (storedAppointmentId) {
        // Clear the storage so it doesn't trigger again on refresh
        sessionStorage.removeItem('showCompletionModalForAppointment');
        
        // Find the appointment in completed appointments
        // Add check for is_user_confirmed to prevent showing the modal if already confirmed
        const appointmentToShow = completedAppointments?.find(
            app => app.id === parseInt(storedAppointmentId, 10) && 
                  app.status === 'completed' && 
                  !app.is_user_confirmed
        );
        
        if (appointmentToShow) {
            setAppointmentToConfirm(appointmentToShow);
            setCompletionModalOpen(true);
            setActiveTab("completed");
        }
    }
}, [completedAppointments]);
    useEffect(() => {
        setAppointmentData({
            pending: pendingAppointments || [],
            upcoming: upcomingAppointments || [],
            completed: completedAppointments || [],
            started: startedAppointments || [],
            cancelled: cancelledAppointments || [],
            declined: declinedAppointments || [],
            "no-show": noShowAppointments || [],
        });
    }, [
        pendingAppointments,
        upcomingAppointments,
        completedAppointments,
        startedAppointments,
        cancelledAppointments,
        noShowAppointments,
        declinedAppointments
    ]);

    useEffect(() => {
        pollingIntervalRef.current = setInterval(() => {
            fetch('/api/appointments/status')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setAppointmentData(prevData => ({
                        ...prevData,
                        ...data
                    }));
                })
                .catch(error => {
                    console.error('Failed to fetch appointment updates:', error);
                });
        }, 60000);
        
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    const canLeaveReview = (appointment) => {
        return appointment && 
            (appointment.status === 'completed' || appointment.status === 'started') && 
            !appointment.review;
    };


    const handleReviewClick = (appointment) => {
        if (!canLeaveReview(appointment) && !appointment.review) {
            setError(`You can only review completed or started appointments.`);
            return;
        }
        
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
        setError(null);
    };

    const handleAppointmentClick = (appointment) => {
        setSelectedAppointment(appointment);
        setIsAppointmentDialogOpen(true);
    };

    const submitReview = (e) => {
        e.preventDefault();
        
        if (!data.service_rating || !data.staff_rating) {
            setError('Please rate both service and staff before submitting');
            return;
        }
        
        post(route('appointments.review'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsReviewDialogOpen(false);
                if (!data.confirm_completion && appointmentToReview?.status === 'started') {
                    setShowConfirmationDialog(true);
                    confirmCompletionForm.setData('appointment_id', appointmentToReview.id);
                }
                reset();
                setServiceRating(0);
                setStaffRating(0);
                setError(null);
            },
            onError: (errors) => {
                if (errors.message) {
                    setError(errors.message);
                } else {
                    setError('An error occurred while submitting your review. Please try again.');
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
            },
            onError: () => {
                setError('Failed to confirm appointment completion. Please try again.');
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
            setError(null);
        }
    };

    const getCurrentPageItems = (items) => {
        if (!items || !Array.isArray(items)) return [];
        
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return items.slice(indexOfFirstItem, indexOfLastItem);
    };

    const totalPages = (items) => {
        if (!items || !Array.isArray(items)) return 0;
        return Math.ceil(items.length / itemsPerPage);
    };

    const getAppointmentContent = (type) => {
        const appointments = appointmentData[type] || [];
        const paginatedAppointments = getCurrentPageItems(appointments);
        const pages = totalPages(appointments);
        
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

            <TabsContent value={type} className="mt-0 w-full">
                <div className="grid gap-5">
                    {appointments.length > 0 ? (
                        <>
                            {paginatedAppointments
                                .filter(appointment => appointment && new Date(appointment.created_at) <= new Date())
                                .map(appointment => (
                                    <div 
                                        key={appointment.id} 
                                        onClick={() => handleAppointmentClick(appointment)}
                                        className="cursor-pointer"
                                    >
                                        <AppointmentCard
                                            appointment={appointment}
                                        />
                                    </div>
                                ))
                            }
                            
                            {pages > 1 && (
                                <Pagination className="mt-4">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious 
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                                disabled={currentPage === 1}
                                                aria-label="Go to previous page"
                                            />
                                        </PaginationItem>
                                        
                                        <PaginationItem>
                                            Page {currentPage} of {pages}
                                        </PaginationItem>
                                        
                                        <PaginationItem>
                                            <PaginationNext 
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pages))}
                                                disabled={currentPage === pages}
                                                aria-label="Go to next page"
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No {type.replace('-', ' ')} appointments found.</p>
                        </div>
                    )}
                </div>
            </TabsContent>
        );
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    return (
        <UserLayout>
            <FlashMessageWrapper message={flashState.message} success={flashState.success} />

            <Head title="Appointments" />
            <h1 className="text-3xl font-semibold mt-2 lg:mb-3 lg:mt-0 uppercase">
                My Appointments
            </h1>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Tabs
                defaultValue={activeTab}
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <div className="sm:hidden">
                    <Select value={activeTab} onValueChange={setActiveTab}>
                        <SelectTrigger aria-label="Select appointment status tab">
                            <SelectValue placeholder="Select a tab" />
                        </SelectTrigger>
                        <SelectContent>
                            {appointmentTypes.map((type) => (
                                <SelectItem key={type} value={type}>

                                    {type.charAt(0).toUpperCase() + type.slice(1)}

                                    {type.replace('-', ' ')}
                                    {appointmentData[type]?.length > 0 && ` (${appointmentData[type].length})`}
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

                    <TabsList className="mb-5 block md:inline-flex w-min mx-auto lg:mx-0">
                        {appointmentTypes.map((type) => (
                            <TabsTrigger 
                                key={type} 
                                value={type} 
                                className="capitalize"
                                aria-label={`View ${type.replace('-', ' ')} appointments`}
                            >
                                {type.replace('-', ' ')}
                                {appointmentData[type]?.length > 0 && ` (${appointmentData[type].length})`}

                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="tab-content-wrapper">
                    {appointmentTypes.map((type) => getAppointmentContent(type))}
                </div>
            </Tabs>


            {/* Appointment Completion Confirmation Modal */}
            {appointmentToConfirm && (
                <CompletionConfirmationModal
                    appointment={appointmentToConfirm}
                    open={completionModalOpen}
                    onOpenChange={setCompletionModalOpen}
                />
            )}

            <AppointmentDetailDialog
                appointment={selectedAppointment}
                open={isAppointmentDialogOpen}
                onOpenChange={setIsAppointmentDialogOpen}
                onReviewClick={handleReviewClick}
                onViewReview={viewReview}
                disabled={processing}
            />

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
                    
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    
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
                                                aria-label={`Rate service ${star} out of 5 stars`}
                                                role="button"
                                                tabIndex={appointmentToReview?.review ? -1 : 0}
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
                                                aria-label={`Rate staff ${star} out of 5 stars`}
                                                role="button"
                                                tabIndex={appointmentToReview?.review ? -1 : 0}
                                            />
                                        ))}
                                    </div>
                                    {errors.staff_rating && <p>{errors.staff_rating}</p>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="review-comment">Comment</Label>
                                <Textarea
                                    id="review-comment"
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    rows={4}
                                    disabled={appointmentToReview?.review}
                                    placeholder="Share your experience with this service (optional)"
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
                                    aria-label="Close review dialog"
                                >
                                    Close
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsReviewDialogOpen(false)}
                                        aria-label="Cancel review submission"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing || !serviceRating || !staffRating}
                                        aria-label="Submit your review"
                                    >
                                        {processing ? (
                                            <>
                                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Review"
                                        )}
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
                            {confirmCompletionForm.processing ? "Processing..." : "Confirm Completion"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </UserLayout>
    );
}