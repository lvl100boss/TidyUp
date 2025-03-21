import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/Components/ui/Button";
import AppointmentCard from "@/Components/User/AppointmentCard";
import DeclineButton from './DeclineButton';
import AcceptButton from './AcceptButton';


export default function ResceduleAppointmentCard(props) {
    function formatDate(date) {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    }
    function formatTime(time) {
        return new Date(`1970-01-01T${time}Z`).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }
    return (
        <Dialog>
            <DialogTrigger className="w-full">
                <AppointmentCard appointment={props.appointment} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Reschedule Request
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        DISCLAIMER: Declining this request will automatically cancel the appointment.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="rounded-lg border p-4 shadow-sm bg-card">
                        <h3 className="mb-2 font-semibold text-card-foreground">Current Appointment</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">{formatDate(props.appointment.date)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">{formatTime(props.appointment.time)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border p-4 shadow-sm bg-card">
                        <h3 className="mb-2 font-semibold text-primary">Requested Change</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <p className="text-sm">{formatDate(props.reschedData.date)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                <p className="text-sm">{formatTime(props.reschedData.time)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border p-4">
                        <h3 className="mb-2 font-semibold">Reason</h3>
                        <p className="text-sm text-muted-foreground">{props.reschedData.reason}</p>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <DeclineButton appointment={props.appointment} />
                        <AcceptButton appointment={props.appointment} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}