import React from 'react';
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { CalendarCheck, Loader2 } from "lucide-react";
import { useForm } from "@inertiajs/react";

export default function CompleteButtonModal({ appointment }) {
    const { post, processing } = useForm({
        _method: "PATCH",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PATCH");

        post(route("shop.appointments.complete", appointment.id), {
            preserveScroll: true,
            data: formData,
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button
                    size="default"
                    variant="default"
                    className="gap-1.5"
                >
                    <CalendarCheck className="mr-2 h-4 w-4" />
                    Complete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Do you want to mark this Appointment as Completed?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will mark the appointment as Completed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form onSubmit={handleSubmit}>
                        <Button type="submit">
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {processing ? "Marking as Completed..." : "Confirm"}
                        </Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}