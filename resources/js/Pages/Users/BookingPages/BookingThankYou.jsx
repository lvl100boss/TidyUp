import React from 'react';
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { CheckCircle, Calendar, Clock } from "lucide-react";
import UserLayout from "@/Layouts/UserLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Separator } from "@/Components/ui/separator";

export default function BookingThankYou({ shop, appointment }) {
    const formattedDate = format(new Date(appointment.date), "EEEE, MMMM dd, yyyy");
    const formattedTime = format(new Date(`2023-01-01T${appointment.time}`), "h:mm a");
    
    return (
        <>
            <Head title="Booking Confirmed" />
            <UserLayout>
                <div>
                    <div className="max-w-2xl mx-auto py-12">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="rounded-full bg-primary/10 p-3">
                                        <CheckCircle className="h-12 w-12 text-primary" />
                                    </div>
                                </div>
                                <CardTitle className="text-3xl">Booking Confirmed!</CardTitle>
                                <CardDescription className="text-lg">
                                    Thank you for booking with {shop.shop_name}
                                </CardDescription>
                            </CardHeader>
                            
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="rounded-md border p-4">
                                        <div className="mb-3 flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-primary" />
                                            <span className="font-medium">{formattedDate}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-primary" />
                                            <span className="font-medium">{formattedTime}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="rounded-md border p-4">
                                        <h3 className="mb-2 font-medium">Services:</h3>
                                        <ul className="space-y-2">
                                            {appointment.appointment_services.map(service => (
                                                <li key={service.id} className="flex justify-between">
                                                    <span>{service.shop_service.service_name}</span>
                                                    <span>₱{parseFloat(service.shop_service.cost).toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Separator className="my-4" />
                                        <div className="flex justify-between font-medium">
                                            <span>Total</span>
                                            <span>₱{parseFloat(appointment.total_price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="rounded-md border p-4">
                                        <h3 className="mb-2 font-medium">Staff Member:</h3>
                                        <p>{appointment.staff.staff.first_name} {appointment.staff.staff.last_name}</p>
                                    </div>
                                    
                                    <div className="rounded-md bg-muted/30 p-4 text-sm">
                                        <p>A confirmation with details has been sent to your email. This appointment is pending approval from the shop. You will receive a notification once it's approved.</p>
                                    </div>
                                </div>
                            </CardContent>
                            
                            <CardFooter>
                                <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={`/${shop.id}/booking/1`}>
                                            Book Another Appointment
                                        </Link>
                                    </Button>
                                    <Button className="w-full" asChild>
                                        <Link href={route('appointments')}>
                                            View My Appointments
                                        </Link>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </UserLayout>
        </>
    );
}
