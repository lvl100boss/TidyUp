import React from 'react';
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { CalendarCheck } from "lucide-react";
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
                    size="sm"
                    className="gap-1.5 rounded-lg px-4 font-medium hover:bg-primary/10 hover:text-primary"
                >
                    <CalendarCheck className="h-4 w-4" />
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
                        <Button >{processing ? "Marking as Completed..." : "Confirm"}</Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}