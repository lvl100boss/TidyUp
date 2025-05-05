import React, { useEffect, useState, useMemo } from 'react';
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, LogOut, AlertCircle } from "lucide-react";
import StepsIndicator from "@/Components/User/BookingPages/StepsIndicator";
import UserLayout from "@/Layouts/UserLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useForm } from "@inertiajs/react";
import { 
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function BookingStepFour({ shop, staffList, data }) {
    const [validationStatus, setValidationStatus] = useState({ isValid: false, errors: {} });
    const [isInitializing, setIsInitializing] = useState(true);
    const [initializedData, setInitializedData] = useState(false);
    const [groupedServices, setGroupedServices] = useState({});
    
    const bufferTimeMinutes = data?.buffer_time_minutes || shop?.settings?.buffer_time_minutes || 30;
    
    const { data: formData, setData, post, processing, errors } = useForm({
        attendee_services: data?.attendee_services || [],
        buffer_time_minutes: bufferTimeMinutes
    });
    
    const BUFFER_TIME_MINUTES = formData.buffer_time_minutes;

    useEffect(() => {
        if (shop?.shop_service_categories) {
            const grouped = {};
            
            shop.shop_service_categories.forEach(service => {
                const category = service.service_categories?.name || 'Other';
                
                if (!grouped[category]) {
                    grouped[category] = [];
                }
                
                grouped[category].push(service);
            });
            
            setGroupedServices(grouped);
        }
    }, [shop]);

    function initializeAttendeeServices() {
        try {
            if (!data.attendees || data.attendees.length === 0) {
                return [{
                    attendee_index: 0,
                    services: Array.isArray(data.service_id) ? data.service_id : [],
                    staff_id: data.staff_id || null,
                    buffer_time_minutes: BUFFER_TIME_MINUTES
                }];
            }
            
            return data.attendees.map((_, index) => {
                const existingServiceData = (data.attendee_services || [])
                    .find(service => service.attendee_index === index);
                    
                return {
                    attendee_index: index,
                    services: Array.isArray(existingServiceData?.services) ? existingServiceData.services : [],
                    staff_id: existingServiceData?.staff_id || null,
                    buffer_time_minutes: BUFFER_TIME_MINUTES
                };
            });
        } catch (error) {
            console.error("Error initializing attendee services:", error);
            return [];
        }
    }

    const isStaffAssignedToOther = (staffId, currentAttendeeIndex) => {
        if (!formData.attendee_services || !Array.isArray(formData.attendee_services)) {
            return false;
        }
        
        return formData.attendee_services.some((service, index) => 
            index !== currentAttendeeIndex && service.staff_id === staffId
        );
    };

    const isStaffAssignedToMultipleAttendees = (staffId) => {
        if (!formData.attendee_services || !Array.isArray(formData.attendee_services)) {
            return false;
        }
        
        const assignedCount = formData.attendee_services.filter(service => 
            service.staff_id === staffId
        ).length;
        
        return assignedCount > 1;
    };

    const wouldStaffHaveConflicts = (staffId) => {
        if (!staffId || !formData.attendee_services || !Array.isArray(formData.attendee_services)) {
            return false;
        }
        
        const staffServices = [];
        
        formData.attendee_services.forEach(service => {
            if (service.staff_id === staffId && Array.isArray(service.services)) {
                staffServices.push(...service.services);
            }
        });
        
        const totalDuration = calculateTotalDurationForStaff(staffId, staffServices);
        
        const totalWithBuffer = totalDuration + BUFFER_TIME_MINUTES;
        
        return totalWithBuffer > 120;
    };

    const calculateTotalDurationForStaff = useMemo(() => (staffId, serviceIds) => {
        if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
            return 0;
        }
        
        if (!shop?.shop_service_categories) {
            return 0;
        }
        
        let totalDuration = 0;
        
        serviceIds.forEach(serviceId => {
            const service = shop.shop_service_categories.find(s => s.id === serviceId);
            if (service) {
                totalDuration += (service.duration_hour * 60) + service.duration_minute;
            }
        });
        
        return Math.max(30, totalDuration);
    }, [shop?.shop_service_categories]);

    const getStaffConflicts = useMemo(() => {
        const conflicts = {};
        
        if (!formData.attendee_services || !Array.isArray(formData.attendee_services)) {
            return conflicts;
        }
        
        const staffServiceMap = {};
        
        formData.attendee_services.forEach(attendeeService => {
            const staffId = attendeeService.staff_id;
            if (!staffId || !Array.isArray(attendeeService.services)) return;
            
            if (!staffServiceMap[staffId]) {
                staffServiceMap[staffId] = [];
            }
            
            staffServiceMap[staffId] = [...staffServiceMap[staffId], ...attendeeService.services];
        });
        
        Object.entries(staffServiceMap).forEach(([staffId, services]) => {
            const duration = calculateTotalDurationForStaff(staffId, services);
            const totalWithBuffer = duration + BUFFER_TIME_MINUTES;
            
            if (totalWithBuffer > 120) {
                const affectedAttendees = [];
                
                formData.attendee_services.forEach((service, index) => {
                    if (service.staff_id === staffId) {
                        affectedAttendees.push(index);
                    }
                });
                
                conflicts[staffId] = {
                    duration: totalWithBuffer,
                    attendees: affectedAttendees
                };
            }
        });
        
        return conflicts;
    }, [formData.attendee_services, calculateTotalDurationForStaff, BUFFER_TIME_MINUTES]);

    const calculateStaffDurations = () => {
        const staffServices = {};
        
        if (!formData.attendee_services || !Array.isArray(formData.attendee_services)) {
            return {};
        }
        
        formData.attendee_services.forEach(attendeeService => {
            const { staff_id, services } = attendeeService;
            if (!staff_id || !Array.isArray(services) || services.length === 0) return;
            
            if (!staffServices[staff_id]) {
                staffServices[staff_id] = [];
            }
            
            staffServices[staff_id] = [...staffServices[staff_id], ...services];
        });
        
        const staffDurations = {};
        Object.entries(staffServices).forEach(([staffId, serviceIds]) => {
            const totalDuration = calculateTotalDurationForStaff(staffId, serviceIds);
            staffDurations[staffId] = totalDuration + BUFFER_TIME_MINUTES;
        });
        
        return staffDurations;
    };

    const getAttendeeError = (attendeeIndex, field) => {
        return validationStatus.errors[`attendee_${attendeeIndex}_${field}`];
    };

    const isServiceSelected = (attendeeIndex, serviceId) => {
        if (!formData.attendee_services || !formData.attendee_services[attendeeIndex]) {
            return false;
        }
        
        return formData.attendee_services[attendeeIndex].services?.includes(serviceId);
    };

    const toggleService = (attendeeIndex, serviceId) => {
        const attendeeServices = [...formData.attendee_services];
        
        if (!attendeeServices[attendeeIndex]) {
            return;
        }
        
        let services = [...(attendeeServices[attendeeIndex].services || [])];
        
        if (services.includes(serviceId)) {
            services = services.filter(id => id !== serviceId);
        } else {
            services.push(serviceId);
        }
        
        attendeeServices[attendeeIndex] = {
            ...attendeeServices[attendeeIndex],
            services
        };
        
        setData('attendee_services', attendeeServices);
    };

    const handleStaffSelection = (attendeeIndex, staffId) => {
        const attendeeServices = [...formData.attendee_services];
        
        if (!attendeeServices[attendeeIndex]) {
            return;
        }
        
        attendeeServices[attendeeIndex] = {
            ...attendeeServices[attendeeIndex],
            staff_id: staffId
        };
        
        setData('attendee_services', attendeeServices);
    };

    useEffect(() => {
        if (isInitializing && !initializedData) {
            const initializedServices = initializeAttendeeServices();
            setData('attendee_services', initializedServices);
            setInitializedData(true);
            setIsInitializing(false);
        }
    }, [data, isInitializing]);

    useEffect(() => {
        if (!isInitializing && 
            (!data.attendees || data.attendees.length === 0) && 
            initializedData && 
            Array.isArray(data.service_id) && 
            data.service_id.length > 0 && 
            data.staff_id) {
            
            const selfBookingServices = [{
                attendee_index: 0,
                services: data.service_id,
                staff_id: data.staff_id,
                buffer_time_minutes: BUFFER_TIME_MINUTES,
                max_duration: calculateTotalDurationForStaff(data.staff_id, data.service_id)
            }];
            
            setData('attendee_services', selfBookingServices);
            
            const timer = setTimeout(() => {
                post(`/${shop.id}/booking/4`);
            }, 150);
            
            return () => clearTimeout(timer);
        }
    }, [data, initializedData, isInitializing]);

    const validateForm = () => {
        if (isInitializing || !initializedData) return false;
        
        const errors = {};
        const isValid = formData.attendee_services?.every((attendeeService, index) => {
            const hasStaff = !!attendeeService.staff_id;
            const hasServices = Array.isArray(attendeeService.services) && attendeeService.services.length > 0;
            
            if (!hasStaff) {
                errors[`attendee_${index}_staff`] = 'Please select a staff member';
            }
            
            if (!hasServices) {
                errors[`attendee_${index}_services`] = 'Please select at least one service';
            }
            
            return hasStaff && hasServices;
        }) || false;
        
        setValidationStatus({ isValid, errors });
        return isValid;
    };

    useEffect(() => {
        if (formData.attendee_services?.length > 0) {
            validateForm();
        }
    }, [formData.attendee_services]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            console.log("Form validation failed:", validationStatus.errors);
            return;
        }
        
        const staffDurations = calculateStaffDurations();
        
        const enhancedData = {
            attendee_services: formData.attendee_services.map(attendeeService => {
                const staffId = attendeeService.staff_id;
                const services = attendeeService.services || [];
                
                return {
                    ...attendeeService,
                    max_duration: staffDurations[staffId] || calculateTotalDurationForStaff(staffId, services),
                    buffer_time_minutes: BUFFER_TIME_MINUTES
                };
            }),
            staff_durations: staffDurations,
            total_price: calculateTotalPrice(),
            buffer_time_minutes: BUFFER_TIME_MINUTES
        };
        
        setData(enhancedData);
        post(`/${shop.id}/booking/4`);
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        
        if (!formData.attendee_services || !Array.isArray(formData.attendee_services)) {
            return totalPrice;
        }
        
        formData.attendee_services.forEach(attendeeService => {
            if (!attendeeService || !Array.isArray(attendeeService.services)) {
                return;
            }
            
            attendeeService.services.forEach(serviceId => {
                const service = shop.shop_service_categories.find(s => s.id === serviceId);
                if (service) {
                    totalPrice += parseFloat(service.cost);
                }
            });
        });
        
        return totalPrice;
    };
    
    useEffect(() => {
        const totalPrice = calculateTotalPrice();
        setData('total_price', totalPrice);
    }, [formData.attendee_services]);

    if (isInitializing || (!data.attendees || data.attendees.length === 0) && !initializedData) {
        return (
            <>
                <Head title="Processing Booking" />
                <UserLayout>
                    <div className="min-h-screen">
                        <header className="flex justify-center relative">
                            <h1 className="text-2xl font-bold">Processing Your Booking</h1>
                        </header>
                        <div className="mt-8 max-w-xl mx-auto">
                            <StepsIndicator step={4} />
                        </div>
                        <div className="flex justify-center items-center min-h-[40vh]">
                            <div className="text-center space-y-4">
                                <p>Please wait, preparing your booking...</p>
                            </div>
                        </div>
                    </div>
                </UserLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Assign Staff" />
            <UserLayout>
                <div className="min-h-screen">
                    <header className="flex justify-center relative">
                        <Button className="absolute rounded-none border-b border-foreground left-0" variant="ghost" asChild>
                            <Link href={`/${shop.id}/booking/3`}>
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
                        <StepsIndicator step={4} />
                    </div>

                    <section>
                        <h1 className='text-2xl font-bold mb-5'>Assign Staff to Attendees</h1>
                        
                        <Alert className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Buffer Time Notice</AlertTitle>
                            <AlertDescription>
                                A {BUFFER_TIME_MINUTES}-minute buffer time is automatically added after each service to ensure 
                                smooth transitions between appointments.
                            </AlertDescription>
                        </Alert>

                        {errors.message && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {errors.message}
                                </AlertDescription>
                            </Alert>
                        )}

                        {errors.time && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Schedule Conflict</AlertTitle>
                                <AlertDescription>
                                    {errors.time}
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {data.attendees && data.attendees.map((attendee, attendeeIndex) => (
                                    <Card 
                                        key={attendeeIndex} 
                                        className="relative"
                                        variant={attendeeIndex % 2 === 0 ? "default" : "secondary"}
                                    >
                                        <CardHeader>
                                            <CardTitle>
                                                {attendee.name}
                                            </CardTitle>
                                            <CardDescription>
                                                Select a staff member and services
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div>
                                                <Label htmlFor={`staff-${attendeeIndex}`}>Select Staff Member</Label>
                                                <Select
                                                    value={(formData.attendee_services[attendeeIndex]?.staff_id || "").toString()}
                                                    onValueChange={(value) => handleStaffSelection(attendeeIndex, value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a staff member" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Available Staff</SelectLabel>
                                                            {staffList && staffList.map(staffMember => {
                                                                const isAssigned = isStaffAssignedToOther(
                                                                    staffMember.id.toString(), 
                                                                    attendeeIndex
                                                                );
                                                                
                                                                const hasMultipleAssignments = isStaffAssignedToMultipleAttendees(
                                                                    staffMember.id.toString()
                                                                );
                                                                
                                                                const potentialConflict = wouldStaffHaveConflicts(
                                                                    staffMember.id.toString()
                                                                );
                                                                
                                                                return (
                                                                    <SelectItem 
                                                                        key={staffMember.id} 
                                                                        value={staffMember.id.toString()}
                                                                    >
                                                                        <div className="flex items-center justify-between w-full">
                                                                            <span>
                                                                                {staffMember.staff.first_name} {staffMember.staff.last_name} ({staffMember.role})
                                                                            </span>
                                                                            {isAssigned && (
                                                                                <Badge variant="outline" className="ml-2 text-xs">
                                                                                    Already assigned
                                                                                </Badge>
                                                                            )}
                                                                            {hasMultipleAssignments && potentialConflict && (
                                                                                <Badge variant="destructive" className="ml-2 text-xs">
                                                                                    Potential time conflict
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                
                                                {formData.attendee_services[attendeeIndex]?.staff_id && 
                                                 wouldStaffHaveConflicts(formData.attendee_services[attendeeIndex]?.staff_id) && (
                                                    <Alert variant="warning" className="mt-2">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <AlertTitle>Potential Time Conflict</AlertTitle>
                                                        <AlertDescription>
                                                            This staff member is assigned to multiple attendees with a total service duration 
                                                            that may exceed their availability. The backend will verify availability during submission.
                                                        </AlertDescription>
                                                    </Alert>
                                                )}
                                                
                                                {getAttendeeError(attendeeIndex, 'staff_id') && (
                                                    <div className="text-sm text-destructive mt-1">
                                                        {getAttendeeError(attendeeIndex, 'staff_id')}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label>Select Services</Label>
                                                    
                                                    {getAttendeeError(attendeeIndex, 'services') && (
                                                        <Badge variant="destructive">
                                                            Service required
                                                        </Badge>
                                                    )}
                                                </div>
                                                
                                                {Object.keys(groupedServices).length > 0 ? (
                                                    Object.keys(groupedServices).map(category => (
                                                        <div key={category} className="space-y-2">
                                                            <Badge variant="outline" className="font-medium">
                                                                {category}
                                                            </Badge>
                                                            <div className="space-y-2">
                                                                {groupedServices[category].map(service => (
                                                                    <div 
                                                                        key={service.id}
                                                                        className={`flex items-center space-x-2 p-2 rounded ${
                                                                            isServiceSelected(attendeeIndex, service.id) 
                                                                                ? 'bg-primary/10' 
                                                                                : 'hover:bg-muted'
                                                                        }`}
                                                                    >
                                                                        <Checkbox 
                                                                            id={`service-${attendeeIndex}-${service.id}`}
                                                                            checked={isServiceSelected(attendeeIndex, service.id)}
                                                                            onCheckedChange={() => toggleService(attendeeIndex, service.id)}
                                                                        />
                                                                        <div className="flex items-center justify-between w-full">
                                                                            <Label 
                                                                                htmlFor={`service-${attendeeIndex}-${service.id}`}
                                                                                className="text-sm cursor-pointer flex-grow"
                                                                            >
                                                                                {service.service_name}
                                                                                <span className="text-xs text-muted-foreground ml-2">
                                                                                    ({service.duration_hour}h {service.duration_minute}m)
                                                                                </span>
                                                                            </Label>
                                                                            <span className="text-sm">
                                                                                ₱{service.cost}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <Separator />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center p-4">
                                                        <p className="text-muted-foreground">No services available for selection.</p>
                                                    </div>
                                                )}
                                                
                                                {getAttendeeError(attendeeIndex, 'services') && (
                                                    <div className="text-sm text-destructive">
                                                        {getAttendeeError(attendeeIndex, 'services')}
                                                    </div>
                                                )}
                                            </div>

                                            {(getAttendeeError(attendeeIndex, 'staff_id') || 
                                              getAttendeeError(attendeeIndex, 'services')) && (
                                                <Alert variant="destructive">
                                                    <AlertTitle>Required Information</AlertTitle>
                                                    <AlertDescription>
                                                        Please complete all required selections for {attendee.name}.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {Object.entries(calculateStaffDurations()).some(([_, duration]) => duration > 120) && (
                                <Alert variant="warning" className="my-4 max-w-4xl mx-auto">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Potential Scheduling Conflicts</AlertTitle>
                                    <AlertDescription>
                                        Some staff members are assigned services with a total duration exceeding 2 hours.
                                        This may cause scheduling conflicts. Please review your selections.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="mt-8 flex justify-between items-center max-w-4xl mx-auto">
                                <div>
                                    <p className="text-sm font-semibold">Total Price: ₱{calculateTotalPrice().toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Includes all selected services and attendees
                                    </p>
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={processing || !validationStatus.isValid}
                                    className="sm:w-auto"
                                >
                                    Continue to Confirmation
                                </Button>
                            </div>
                        </form>
                    </section>
                </div>
            </UserLayout>
        </>
    );
}
