import React from 'react';
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { BadgeCheck } from "lucide-react";
import { useForm } from "@inertiajs/react";

export default function ApproveButtonModal({ appointment }) {
    const { post, processing } = useForm({
        _method: "PATCH",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PATCH");

        post(route("shop.appointments.approve", appointment.id), {
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
                    <BadgeCheck className="h-4 w-4" />
                    Approve
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Do you want to Approve this Appointment?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will mark the appointment as Upcoming.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form onSubmit={handleSubmit}>
                        <Button >{processing ? "Approving..." : "Confirm"}</Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}