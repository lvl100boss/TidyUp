import React from 'react';
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { CheckCircle, Calendar, Clock, User } from "lucide-react";
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
                    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="rounded-full bg-primary/10 p-2 sm:p-3">
                                        <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
                                    </div>
                                </div>
                                <CardTitle className="text-2xl sm:text-3xl">Booking Confirmed!</CardTitle>
                                <CardDescription className="text-base sm:text-lg">
                                    Thank you for booking with {shop.shop_name}
                                </CardDescription>
                            </CardHeader>
                            
                            <CardContent>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="rounded-md border p-3 sm:p-4">
                                        <div className="mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                            <span className="font-medium">{formattedDate}</span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                            <span className="font-medium">{formattedTime}</span>
                                        </div>
                                        {appointment.nickname && (
                                            <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3">
                                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                                <span className="font-medium">
                                                    {appointment.booking_for_other 
                                                        ? `Service for: ${appointment.nickname}` 
                                                        : `Booking name: ${appointment.nickname}`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="rounded-md border p-3 sm:p-4">
                                        <h3 className="mb-2 font-medium">Services:</h3>
                                        <ul className="space-y-2">
                                            {appointment.appointment_services.map(service => (
                                                <li key={service.id} className="flex justify-between">
                                                    <span>{service.shop_service.service_name}</span>
                                                    <span>₱{parseFloat(service.shop_service.cost).toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Separator className="my-3 sm:my-4" />
                                        <div className="flex justify-between font-medium">
                                            <span>Total</span>
                                            <span>₱{parseFloat(appointment.total_price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="rounded-md border p-3 sm:p-4">
                                        <h3 className="mb-2 font-medium">Staff Member:</h3>
                                        <p>{appointment.staff.staff.first_name} {appointment.staff.staff.last_name}</p>
                                    </div>
                                    
                                    <div className="rounded-md bg-muted/30 p-3 sm:p-4 text-xs sm:text-sm">
                                        <p>A confirmation with details has been sent to your email. This appointment is pending approval from the shop. You will receive a notification once it's approved.</p>
                                    </div>
                                </div>
                            </CardContent>
                            
                            <CardFooter>
                                <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-between sm:gap-4">
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
