import React from 'react'
import { CalendarSync } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from "@/Components/ui/alert-dialog";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Calendar } from '@/Components/ui/calendar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useForm } from '@inertiajs/react'
import { useState } from 'react'

export default function ReschedReqButton({ appointment, upcomingSchedules, shopBusinessSchedules }) {
    const [date, setDate] = useState(new Date())

    const timeSlots = Array.from({ length: 48 }, (_, i) => {
        const hours = Math.floor(i / 2).toString().padStart(2, '0');
        const minutes = (i % 2) * 30;
        return `${hours}:${minutes.toString().padStart(2, '0')}:00`;
    });

    const formatTime = (time) => {
        const [hour, minute] = time.split(':');
        const date = new Date();
        date.setHours(hour, minute);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Form Handling
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH',
        date: '',
        time: '',
        reason: ''
    });



    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('date', data.date);
        formData.append('time', data.time);
        formData.append('reason', data.reason);

        post(route('shop.appointments.reschedule', appointment.id), {
            preserveScroll: true,
            data: formData,
        });
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 rounded-lg px-4 font-medium hover:bg-primary/10 hover:text-primary"
                >
                    <CalendarSync className="h-4 w-4" />
                    Reschedule
                </Button>
            </AlertDialogTrigger >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Reschedule Request</AlertDialogTitle>
                    <AlertDialogDescription>
                        Requesting a reschedule will notify the user. They can accept or decline the request. If declined, the appointment will be canceled.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                    <Label htmlFor="date">Date</Label>
                    <div className='w-full grid justify-center'>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="time">Time</Label>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Time" />
                        </SelectTrigger>
                        <SelectContent>
                            {timeSlots.map((slot, index) => (
                                <SelectItem key={index} value={slot}>
                                    {formatTime(slot)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="reason">Reason for Reschedule</Label>
                    <Textarea
                        id="reason"
                        type="text"
                        name="reason"
                        className="mt-1 block w-full"
                        placeholder="Please provide a reason for rescheduling the appointment"
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <form onSubmit={handleSubmit}>
                        <Button>Confirm</Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    )
}