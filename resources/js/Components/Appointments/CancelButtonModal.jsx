import React from 'react';
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from "@/Components/ui/alert-dialog";
import { Ban } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

export default function CancelButtonModal({ appointment }) {

    const { data, setData, post, processing, errors } = useForm({
        _method: "PATCH",
        reason: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PATCH");
        formData.append("reason", data.reason);

        post(route("shop.appointments.cancel", appointment.id), {
            preserveScroll: true,
            data: formData,
        });
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1.5 rounded-lg px-4 font-medium hover:bg-primary/10 hover:text-primary"
                >
                    <Ban className="h-4 w-4" />

                    Cancel
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This appointment will be permanently cancelled.
                    </AlertDialogDescription>
                    <div>
                        <Label htmlFor="reason">Cancel Reason</Label>

                        <Textarea
                            id="reason"
                            type="text"
                            name="reason"
                            className="mt-1 block w-full"
                            placeholder="Please provide a reason for rejecting the appointment"
                            value={data.reason}
                            onChange={(e) => setData("reason", e.target.value)}
                        />
                        {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form onSubmit={handleSubmit}>
                        <Button type="submit" variant="destructive">{processing ? "Cancelling..." : "Confirm"}</Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}