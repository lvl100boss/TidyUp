import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, LogOut } from "lucide-react";
import StepsIndicator from "@/Components/User/BookingPages/StepsIndicator";
import UserLayout from "@/Layouts/UserLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useForm } from "@inertiajs/react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/Components/ui/alert';

export default function BookingStepFive({ shop, shopStaff, data }) {
    const BUFFER_TIME_MINUTES = data.buffer_time_minutes || shop?.settings?.buffer_time_minutes || 30;
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [serverResponse, setServerResponse] = useState(null);
    
    // Check for flash messages from the server
    const { flash } = usePage().props;

    const { data: formData, setData, post, processing, errors } = useForm({
        note: data.note || '',
        buffer_time_minutes: BUFFER_TIME_MINUTES
    });

    useEffect(() => {
        const requiredFields = ['date', 'time', 'staff_id', 'service_id'];
        const hasMissingFields = requiredFields.some(field => !data[field]);
        
        if (hasMissingFields) {
            console.error('Missing required session data', 
                requiredFields.filter(field => !data[field]));
            setSubmitError('Missing required booking information. Please try starting over.');
        }
    }, [data]);

    // Monitor flash messages from server
    useEffect(() => {
        if (flash && flash.message) {
            setServerResponse({
                message: flash.message,
                success: flash.success
            });
        }
    }, [flash]);

    // Reset loading state when processing state changes to false
    useEffect(() => {
        if (!processing && loading) {
            setLoading(false);
        }
    }, [processing]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (processing || loading) {
            return;
        }
        
        setLoading(true);
        setSubmitError(null);
        
        // Include all necessary data in the submission
        const bookingData = {
            note: formData.note,
            buffer_time_minutes: BUFFER_TIME_MINUTES,
            date: data.date,
            time: data.time,
            staff_id: data.staff_id,
            shop_id: shop.id,
            service_id: data.service_id,
            total_price: data.total_price || calculateTotalCost(),
            attendee_services: data.attendee_services || []
        };
        
        post(`/${shop.id}/booking/5`, bookingData, {
            onSuccess: () => {
                console.log("Booking submission successful");
            },
            onError: (errors) => {
                setLoading(false);
                const errorMessage = errors.message || 'An error occurred while processing your booking. Please try again.';
                setSubmitError(errorMessage);
                console.error('Booking submission error:', errors);
            },
            onFinish: () => {
                setLoading(false);
            },
            preserveScroll: true
        });
    };

    const getAttendeeServices = (attendeeIndex) => {
        if (!data.attendee_services || 
            !data.attendee_services[attendeeIndex] ||
            !Array.isArray(data.attendee_services[attendeeIndex].services)) {
            return [];
        }
        
        const serviceIds = data.attendee_services[attendeeIndex].services || [];
        const staffId = data.attendee_services[attendeeIndex].staff_id;
        const staffMember = shopStaff.find(s => s.id.toString() === staffId?.toString());
        
        return serviceIds.map(id => {
            const service = shop.shop_service_categories.find(service => service.id === id);
            return {
                service: service,
                staff: staffMember
            };
        }).filter(item => item.service);
    };

    const calculateTotalCost = () => {
        let total = 0;
        
        if (!data.attendee_services || !data.attendee_services.length) {
            (data.service_id || []).forEach(serviceId => {
                const service = shop.shop_service_categories.find(s => s.id === serviceId);
                if (service) {
                    total += parseFloat(service.cost);
                }
            });
            return total.toFixed(2);
        }
        
        data.attendee_services.forEach(attendeeService => {
            if (!attendeeService || !Array.isArray(attendeeService.services)) {
                return;
            }
            
            attendeeService.services.forEach(serviceId => {
                const service = shop.shop_service_categories.find(s => s.id === serviceId);
                if (service) {
                    total += parseFloat(service.cost);
                }
            });
        });
        
        return total.toFixed(2);
    };

    const calculateTotalDurationForStaff = (staffId, serviceIds) => {
        if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) return 0;
        if (!shop?.shop_service_categories) return 0;
        
        return serviceIds.reduce((totalDuration, serviceId) => {
            const service = shop.shop_service_categories.find(s => s.id === serviceId);
            if (!service) return totalDuration;
            
            const serviceDuration = (service.duration_hour * 60) + service.duration_minute;
            return totalDuration + serviceDuration;
        }, 0);
    };

    const calculateEndTimeForStaff = (staffId) => {
        if (!data.time || !staffId) return null;
        
        // Get services specifically assigned to this staff member
        const staffServices = [];
        
        // For group bookings with attendee_services
        if (data.attendee_services && Array.isArray(data.attendee_services)) {
            // Only add services for this specific staff
            data.attendee_services.forEach(attendeeService => {
                if (attendeeService.staff_id === staffId && Array.isArray(attendeeService.services)) {
                    staffServices.push(...attendeeService.services);
                }
            });
        } 
        // For simple bookings (just one person)
        else if (staffId === data.staff_id) {
            staffServices.push(...(data.service_id || []));
        }
        
        const totalMinutes = calculateTotalDurationForStaff(staffId, staffServices);
        if (totalMinutes === 0) return null;
        
        try {
            // Parse the time string properly
            const timeString = data.time.includes(':') ? data.time : `${data.time}:00`;
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            
            const startTime = new Date();
            startTime.setHours(hours, minutes, seconds || 0);
            
            // Calculate service end time (start time + service duration)
            const endTime = new Date(startTime.getTime() + totalMinutes * 60000);
            
            // Add buffer time to get the final end time
            const bufferEndTime = new Date(endTime.getTime() + BUFFER_TIME_MINUTES * 60000);
            
            return {
                serviceEnd: endTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true
                }),
                bufferEnd: bufferEndTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true
                })
            };
        } catch (e) {
            console.error("Error calculating end time:", e);
            return { serviceEnd: "Error", bufferEnd: "Error" };
        }
    };

    return (
        <>
            <Head title="Confirm Appointment" />
            <UserLayout>
                <div className="min-h-screen">
                    <header className="flex justify-center relative">
                        <Button className="absolute rounded-none border-b border-foreground left-0" variant="ghost" asChild>
                            <Link href={`/${shop.id}/booking/4`}>
                                <span>
                                    <ChevronLeft className="mr-2" />
                                </span>
                                Back
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold">Appointment Processing</h1>
                        <Button className="absolute rounded-none border-b border-foreground right-0" variant="ghost" asChild>
                            <Link href={`/${shop.id}/shop`}>
                                Exit
                                <LogOut className="ml-2" />
                            </Link>
                        </Button>
                    </header>
                    
                    <div className="mt-8 max-w-xl mx-auto">
                        <StepsIndicator step={5} />
                    </div>

                    {submitError && (
                        <Alert variant="destructive" className="max-w-4xl mx-auto my-4">
                            <AlertTitle>Submission Error</AlertTitle>
                            <AlertDescription>{submitError}</AlertDescription>
                        </Alert>
                    )}
                    
                    {errors.message && (
                        <Alert variant="destructive" className="max-w-4xl mx-auto my-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{errors.message}</AlertDescription>
                        </Alert>
                    )}
                    
                    {serverResponse && (
                        <Alert 
                            variant={serverResponse.success ? "default" : "destructive"} 
                            className="max-w-4xl mx-auto my-4"
                        >
                            <AlertTitle>{serverResponse.success ? "Success" : "Error"}</AlertTitle>
                            <AlertDescription>{serverResponse.message}</AlertDescription>
                        </Alert>
                    )}

                    <section>
                        <h1 className="text-2xl font-bold mb-5">Confirm your Appointment</h1>
                        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <Card className="overflow-hidden">
                                    <img className="w-full aspect-video mb-5 object-cover" src={`/${shop.shop_gallery[0].url}`} />
                                    <CardContent>
                                        <CardTitle>Shop Name</CardTitle>
                                        <CardDescription>
                                            {shop.shop_name}
                                        </CardDescription>
                                    </CardContent>
                                    <CardContent>
                                        <CardTitle>Location</CardTitle>
                                        <CardDescription>
                                            {shop.detailed_address}
                                        </CardDescription>
                                    </CardContent>
                                    <CardContent>
                                        <CardTitle>Schedule</CardTitle>
                                        <CardDescription>
                                            {new Date(data.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </CardDescription>
                                        <div className="space-y-1">
                                            {data.time && (
                                                <CardDescription>
                                                    {new Date(`2024-01-01T${data.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                    {" - "}
                                                    {(() => {
                                                        const staffId = data.attendee_services?.[0]?.staff_id || data.staff_id;
                                                        const endTimes = calculateEndTimeForStaff(staffId);
                                                        return endTimes?.serviceEnd || "";
                                                    })()}
                                                </CardDescription>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                                <p className="text-xs text-muted-foreground">
                                                    {BUFFER_TIME_MINUTES}-minute buffer until{" "}
                                                    {(() => {
                                                        const staffId = data.attendee_services?.[0]?.staff_id || data.staff_id;
                                                        const endTimes = calculateEndTimeForStaff(staffId);
                                                        return endTimes?.bufferEnd || "";
                                                    })()}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <Card className="mt-4">
                                    <CardHeader>
                                        <CardTitle>About Buffer Time</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            A {BUFFER_TIME_MINUTES}-minute buffer is added after your appointment to accommodate any delays 
                                            or unexpected circumstances. This helps ensure a smooth experience for all customers.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                            <div>
                                <Card>
                                    <CardHeader>
                                        <h1 className="font-bold text-xl">Services Summary</h1>
                                    </CardHeader>
                                    <CardContent className="pb-3">
                                        <CardTitle>Primary Stylist</CardTitle>
                                        {shopStaff && data.staff_index !== undefined && shopStaff[data.staff_index] ? (
                                            <div className="py-3 inline-flex items-center gap-3">
                                                <Avatar className="size-16">
                                                    <AvatarImage 
                                                        src={'/storage/' + shopStaff[data.staff_index]?.staff.profile_photo_path} 
                                                        alt={`${shopStaff[data.staff_index]?.staff.first_name} ${shopStaff[data.staff_index]?.staff.last_name}`}
                                                    />
                                                    <AvatarFallback>
                                                        {shopStaff[data.staff_index]?.staff.first_name[0] + shopStaff[data.staff_index]?.staff.last_name[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-medium">
                                                        {shopStaff[data.staff_index]?.staff.first_name} {shopStaff[data.staff_index]?.staff.last_name}
                                                    </h3>
                                                    <h4 className="text-sm text-muted-foreground">
                                                     {shopStaff[data.staff_index]?.role}
                                                    </h4>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-3">
                                                <p className="text-muted-foreground">No stylist selected</p>
                                            </div>
                                        )}
                                    </CardContent>
                                    
                                    {(!data.attendees || data.attendees.length === 0) && data.service_id && (
                                        <CardContent>
                                            <CardTitle className="mb-2">Your Services</CardTitle>
                                            <div className="pl-2">
                                                {data.service_id.map(serviceId => {
                                                    const service = shop.shop_service_categories.find(s => s.id === serviceId);
                                                    return service ? (
                                                        <div key={service.id} className="flex items-center justify-between">
                                                            <span className="text-sm">• {service.service_name}</span>
                                                            <span className="text-sm">₱{service.cost}</span>
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                        </CardContent>
                                    )}
                                    
                                    {data.attendees && data.attendees.length > 0 && data.attendee_services && (
                                        <CardContent>
                                            <CardTitle className="mb-2">Attendees</CardTitle>
                                            {data.attendees.map((attendee, index) => {
                                                const servicesWithStaff = getAttendeeServices(index);
                                                const attendeeStaffId = data.attendee_services[index]?.staff_id;
                                                const assignedStaff = shopStaff.find(s => s.id.toString() === attendeeStaffId?.toString());
                                                
                                                return (
                                                    <div key={index} className="mb-4">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h3 className="font-medium">
                                                                {attendee.name}
                                                            </h3>
                                                        </div>
                                                        
                                                        {assignedStaff && (
                                                            <div className="mb-2 text-sm text-muted-foreground">
                                                                Assigned to: {assignedStaff.staff.first_name} {assignedStaff.staff.last_name}
                                                            </div>
                                                        )}
                                                        
                                                        <div className="pl-2">
                                                            {servicesWithStaff.length > 0 ? (
                                                                servicesWithStaff.map(({service}) => (
                                                                    <div key={service.id} className="flex items-center justify-between">
                                                                        <span className="text-sm">• {service.service_name}</span>
                                                                        <span className="text-sm">₱{service.cost}</span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <span className="text-sm text-muted-foreground">No services selected</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </CardContent>
                                    )}

                                    <CardContent>
                                        <CardTitle>Note</CardTitle>
                                        <CardDescription className="mb-3">
                                            Leave a note (optional)
                                        </CardDescription>
                                        <Textarea
                                            placeholder="Type your message here."
                                            value={formData.note}
                                            onChange={(e) => setData('note', e.target.value)}
                                            rows={5}
                                        />
                                    </CardContent>

                                    <div className="mx-6">
                                        <Separator />
                                    </div>

                                    <CardFooter className="w-full pt-3">
                                        <div className="flex justify-between items-center w-full">
                                            <CardTitle className="text-2xl">Total Cost</CardTitle>
                                            <CardTitle className="text-2xl">
                                                ₱{calculateTotalCost()}
                                            </CardTitle>
                                        </div>
                                    </CardFooter>
                                    <CardContent>
                                        <Button 
                                            type="submit" 
                                            className="w-full font-bold"
                                            disabled={processing || loading}
                                        >
                                            {(processing || loading) ? (
                                                <>
                                                    <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    Processing...
                                                </>
                                            ) : "Confirm Appointment"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </form>
                    </section>
                </div>
            </UserLayout>
        </>
    );
}
