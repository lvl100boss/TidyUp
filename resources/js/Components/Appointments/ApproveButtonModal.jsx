import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { Check, Loader2, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ApproveButtonModal({ appointment }) {
    const [open, setOpen] = useState(false);
    
    const { patch, processing } = useForm({
        appointment_id: appointment.id,
    });

    const handleConfirm = () => {
        patch(route('shop.appointments.approve', appointment.id), {
            preserveState: false, // Don't preserve state to ensure fresh data is loaded
            preserveScroll: true, // Keep scroll position
            onSuccess: () => {
                setOpen(false);
                toast.success("Appointment Approved", {
                    description: `The appointment has been successfully approved and the customer has been notified.`,
                    duration: 5000,
                });
                // Force reload page after a short delay to ensure updated data
                setTimeout(() => window.location.reload(), 500);
            },
            onError: (errors) => {
                setOpen(false);
                // Display error toast if there's a conflict or other error
                if (errors.message) {
                    // Check if the error is a scheduling conflict
                    if (errors.message.includes("conflict")) {
                        toast.error("Scheduling Conflict Detected", {
                            description: errors.message,
                            duration: 8000,
                            icon: <Clock className="h-5 w-5 text-destructive" />,
                        });
                    } else {
                        toast.error("Approval Error", {
                            description: errors.message,
                            duration: 5000,
                            icon: <AlertCircle className="h-5 w-5 text-destructive" />,
                        });
                    }
                } else {
                    toast.error("System Error", {
                        description: "There was a problem processing this appointment. Please try again or contact support.",
                        duration: 5000,
                        icon: <AlertCircle className="h-5 w-5 text-destructive" />,
                    });
                }
            }
        });
    };

    return (
        <>
            <Button onClick={() => setOpen(true)} variant="default" size="default">
                <Check className="mr-2 h-4 w-4" /> Approve
            </Button>
            
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Appointment Approval</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to approve this appointment? This will update the status from "pending" to "upcoming" and notify the customer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {processing ? "Approving..." : "Approve Appointment"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}