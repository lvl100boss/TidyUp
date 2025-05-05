import React from 'react';
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";

export default function CompletionConfirmationPrompt({ appointment }) {
    const { post, processing } = useForm({
        appointment_id: appointment.id,
    });

    const handleConfirm = () => {
        post(route('appointments.confirm-completion'));
    };

    // Only show for appointments marked as completed but not confirmed by the user
    if (appointment.status !== 'completed' || appointment.is_user_confirmed) {
        return null;
    }

    return (
        <Alert className="mb-4">
            <AlertTriangle />
            <AlertTitle>
                Appointment Completion Verification
            </AlertTitle>
            <AlertDescription>
                <p className="mb-4">
                    {appointment.shop.shop_name} has marked this appointment as completed. 
                    Please confirm if this service was actually completed to your satisfaction.
                </p>
                <div className="flex gap-3 mt-2">
                    <Button 
                        onClick={handleConfirm}
                        disabled={processing}
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm Completion
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => window.location.href = route('user.feedback')}
                    >
                        Report Issue
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
    );
}