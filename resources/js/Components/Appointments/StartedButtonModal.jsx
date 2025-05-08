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
import { Play, AlertCircle, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function StartedButtonModal({ appointment, constraints }) {
    const [open, setOpen] = useState(false);
    
    const { post, processing } = useForm({
        appointment_id: appointment.id,
    });

    // Handle click on the Start button
    const handleStartClick = () => {
        // Check if there are any constraints that would prevent starting
        if (constraints && !constraints.canStart) {
            // Show toast notification instead of in-page alert
            const icon = getToastIcon();
            
            // Format the message if it's a time constraint
            let message = constraints.reason;
            
            if (constraints.type === 'time' && constraints.details?.minutesRemaining) {
                message = formatTimeConstraintMessage(constraints.details.minutesRemaining);
            }
            
            toast.error("Cannot Start Appointment", {
                description: message,
                icon,
                duration: 5000,
            });
        } else {
            setOpen(true);
        }
    };

    // Handle confirm action in dialog
    const handleConfirm = () => {
        post(route('shop.appointments.started', appointment.id), {
            onSuccess: () => {
                setOpen(false);
                toast.success("Appointment started", {
                    description: "The appointment has been marked as started."
                });
            },
            onError: (errors) => {
                setOpen(false);
                toast.error("Error starting appointment", {
                    description: errors.message || "There was a problem starting the appointment."
                });
            }
        });
    };
    
    // Format time constraint message in a more readable way
    const formatTimeConstraintMessage = (minutesRemaining) => {
        if (minutesRemaining < 60) {
            return `This appointment is scheduled to start in ${minutesRemaining} ${minutesRemaining === 1 ? 'minute' : 'minutes'}.`;
        } else {
            const hours = Math.floor(minutesRemaining / 60);
            const minutes = minutesRemaining % 60;
            
            let message = `This appointment is scheduled to start in ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
            
            if (minutes > 0) {
                message += ` and ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
            }
            
            return message + '.';
        }
    };

    // Helper to get appropriate icon for toast based on constraint type
    const getToastIcon = () => {
        if (!constraints) return <AlertCircle className="h-5 w-5" />;
        
        switch(constraints.type) {
            case 'time':
                return <Clock className="h-5 w-5" />;
            case 'business-hours':
                return <AlertCircle className="h-5 w-5" />;
            case 'conflict':
                return <AlertCircle className="h-5 w-5" />;
            default:
                return <AlertCircle className="h-5 w-5" />;
        }
    };

    return (
        <>
            <Button onClick={handleStartClick} variant="default" size="default">
                <Play className="mr-2 h-4 w-4" /> Start
            </Button>
            
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Start Appointment</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to start this appointment for {appointment.nickname}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {processing ? "Starting..." : "Start Appointment"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}