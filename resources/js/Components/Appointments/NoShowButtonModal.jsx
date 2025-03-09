import React from 'react';
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { CalendarOff } from "lucide-react";
import { useForm } from "@inertiajs/react";

export default function NoShowButtonModal({ appointment }) {
    const { post, processing } = useForm({
        _method: "PATCH",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PATCH");

        post(route("shop.appointments.no-show", appointment.id), {
            preserveScroll: true,
            data: formData,
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1.5 rounded-lg px-4 font-medium hover:bg-primary/10 hover:text-primary"
                >
                    <CalendarOff className="h-4 w-4" />
                    No Show
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Do you want to mark this Appointment as No Show?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will mark the appointment as No Show.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form onSubmit={handleSubmit}>
                        <Button variant="destructive">{processing ? "Marking as No Show..." : "Confirm"}</Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}