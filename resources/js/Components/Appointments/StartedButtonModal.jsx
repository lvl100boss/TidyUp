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
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { toast } from "sonner";

export default function StartedButtonModal({ appointment, constraints }) {
    const [open, setOpen] = useState(false);
    const [showError, setShowError] = useState(false);
    
    const { post, processing } = useForm({
        appointment_id: appointment.id,
    });

    // Handle click on the Start button
    const handleStartClick = () => {
        // Check if there are any constraints that would prevent starting
        if (constraints && !constraints.canStart) {
            setShowError(true);
        } else {
            setOpen(true);
        }
    };
    
    // Dismiss error alert
    const dismissError = () => {
        setShowError(false);
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

    // Helper to determine alert variant based on constraint type
    const getAlertVariant = () => {
        if (!constraints) return "destructive";
        
        switch(constraints.type) {
            case 'time':
                return "default"; // Blue for time constraints
            case 'business-hours':
                return "destructive"; // Red for business hours constraints
            case 'conflict':
                return "destructive"; // Red for conflicts
            default:
                return "destructive";
        }
    };
    
    // Helper to get appropriate icon for constraint type
    const getAlertIcon = () => {
        if (!constraints) return <AlertCircle className="h-4 w-4" />;
        
        switch(constraints.type) {
            case 'time':
                return <Clock className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    return (
        <>
            {showError && constraints && !constraints.canStart && (
                <Alert variant={getAlertVariant()} className="mb-4">
                    {getAlertIcon()}
                    <AlertTitle>Cannot Start Appointment</AlertTitle>
                    <AlertDescription>
                        {constraints.reason}
                    </AlertDescription>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={dismissError}
                        className="mt-3"
                    >
                        Dismiss
                    </Button>
                </Alert>
            )}
            
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