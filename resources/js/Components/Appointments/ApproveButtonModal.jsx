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
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ApproveButtonModal({ appointment }) {
    const [open, setOpen] = useState(false);
    
    const { patch, processing } = useForm({
        appointment_id: appointment.id,
    });

    const handleConfirm = () => {
        patch(route('shop.appointments.approve', appointment.id), {
            onSuccess: () => {
                setOpen(false);
                toast.success("Appointment approved", {
                    description: "The customer has been notified about the approval."
                });
            },
            onError: (errors) => {
                setOpen(false);
                // Display error toast if there's a conflict
                if (errors.message) {
                    toast.error("Scheduling Conflict", {
                        description: errors.message,
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