import React from 'react';
import { Button } from "@/Components/ui/Button";
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
import { useForm } from "@inertiajs/react"

export default function AcceptButton(props) {

    const { post, processing, } = useForm({
        _method: "PATCH",
        appointment_id: props.appointment.id,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PATCH");
        formData.append("appointment_id", props.appointment.id);

        post(route("appointments.accept"), {
            preserveScroll: true,
            data: formData,
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button size="default">Accept</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Accepting this request will automatically mark the appointment as Upcoming.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form onSubmit={handleSubmit}>
                        <Button variant="default">
                            {processing ? "Accepting..." : "Accept"}
                        </Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    );
}