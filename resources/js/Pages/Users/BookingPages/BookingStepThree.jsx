
import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, LogOut } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, LogOut, Plus, Trash2 } from "lucide-react";
import StepsIndicator from "@/Components/User/BookingPages/StepsIndicator";
import UserLayout from "@/Layouts/UserLayout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar';
import { Separator } from '@/Components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function BookingStepThree({ shop, shopStaff, data, isPreview = false }) {
    const { auth } = usePage().props;
    const isAuthenticated = auth.user !== null;
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    
=======
import { useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";

export default function BookingStepThree({ shop, shopStaff, data }) {
    const { data: formData, setData, post, processing, errors } = useForm({
        attendees: data?.attendees || [],
        // Ensure buffer time is passed along
        buffer_time_minutes: data.buffer_time_minutes || shop?.settings?.buffer_time_minutes || 30
    });
    
    const [error, setError] = useState(null);
    
    // Validate that we have the required data from steps 1 and 2
    useEffect(() => {
        if (!data.service_id || data.service_id.length === 0) {
            setError("No services selected. Please go back and select services.");
        } else if (!data.date || !data.time || !data.staff_id) {
            setError("Date, time, or staff not selected. Please complete step 2 first.");
        } else {
            setError(null);
        }
    }, [data]);
    
    // Add validation for duplicate emails
    const hasDuplicateEmails = () => {
        const emails = formData.attendees.map(a => a.email.toLowerCase().trim());
        return new Set(emails).size !== emails.length;
    };
    
    // Enhanced validation
    const getAttendeeErrors = (index) => {
        const attendee = formData.attendees[index];
        const errors = [];
        
        if (!attendee.name || attendee.name.trim() === '') {
            errors.push('Name is required');
        }
        
        if (!attendee.email || attendee.email.trim() === '') {
            errors.push('Email is required');
        } else if (!/^\S+@\S+\.\S+$/.test(attendee.email)) {
            errors.push('Valid email is required');
        }
        
        return errors;
    };

    const addAttendee = () => {
        const newAttendees = [...formData.attendees, { name: '', email: '' }];
        setData('attendees', newAttendees);
    };

    const removeAttendee = (index) => {
        const newAttendees = [...formData.attendees];
        newAttendees.splice(index, 1);
        setData('attendees', newAttendees);
    };

    const updateAttendee = (index, field, value) => {
        const newAttendees = [...formData.attendees];
        newAttendees[index][field] = value;
        setData('attendees', newAttendees);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // If in preview mode or not authenticated, show login dialog
        if (isPreview || !isAuthenticated) {
            setShowLoginDialog(true);
            return;
        }
        
        post(`/${shop.id}/booking/3`);
        // Validate attendee data before submission
        let hasError = false;
        
        if (hasDuplicateEmails()) {
            setError("Each attendee must have a unique email address.");
            hasError = true;
        }
        
        formData.attendees.forEach((attendee, index) => {
            const attendeeErrors = getAttendeeErrors(index);
            if (attendeeErrors.length > 0) {
                setError(`Attendee #${index + 1}: ${attendeeErrors.join(', ')}`);
                hasError = true;
            }
        });
        
        if (hasError) {
            return;
        }
        
        // Initialize attendee_services structure for each attendee
        // This ensures Step Four has the data structure it needs
        const attendee_services = formData.attendees.map((_, index) => ({
            attendee_index: index,
            services: [],
            staff_id: null,
            buffer_time_minutes: formData.buffer_time_minutes
        }));
        
        // Add the initialized attendee_services to the form data
        setData(prevData => ({
            ...prevData,
            attendee_services: attendee_services
        }));
        
        // Add a slight delay to ensure state is updated before submission
        setTimeout(() => {
            post(`/${shop.id}/booking/3`);
        }, 50);
    };

    return (
        <>
            <Head title="Add Attendees" />
            <UserLayout>
                <div className="min-h-screen">
                    <header className="flex justify-center relative">
                        <Button className="absolute rounded-none border-b border-foreground left-0" variant="ghost" asChild>
                            <Link href={isPreview ? `/${shop.id}/preview/booking/2` : `/${shop.id}/booking/2`}>
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
                        <StepsIndicator step={3} />
                    </div>

                    {/* Display error if any */}
                    {(error || errors.message) && (
                        <Alert variant="destructive" className="max-w-4xl mx-auto my-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {error || errors.message}
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    <section>
                        <h1 className='text-2xl font-bold mb-5'>Add Attendees</h1>
                        <div className="max-w-2xl mx-auto">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Additional Attendees</CardTitle>
                                    <CardDescription>
                                        Add additional people who will be attending this appointment. This is optional - leave empty if you're booking only for yourself.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {formData.attendees.map((attendee, index) => {
                                            const attendeeErrors = getAttendeeErrors(index);
                                            return (
                                                <div key={index} className="border rounded-md p-4 relative">
                                                    <Button 
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        className="absolute right-2 top-2"
                                                        onClick={() => removeAttendee(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor={`attendee-name-${index}`}>Name</Label>
                                                            <Input
                                                                id={`attendee-name-${index}`}
                                                                type="text"
                                                                placeholder="Enter attendee name"
                                                                value={attendee.name}
                                                                onChange={(e) => updateAttendee(index, 'name', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`attendee-email-${index}`}>Email</Label>
                                                            <Input
                                                                id={`attendee-email-${index}`}
                                                                type="email"
                                                                placeholder="Enter attendee email"
                                                                value={attendee.email}
                                                                onChange={(e) => updateAttendee(index, 'email', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    {attendeeErrors.length > 0 && (
                                                        <div className="mt-2 text-sm text-destructive">
                                                            {attendeeErrors.map((err, i) => (
                                                                <p key={i}>{err}</p>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addAttendee}
                                            className="w-full"
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Add Attendee
                                        </Button>

                                    </CardContent>
                                </Card>
                            </div>
                        </form>
                    </section>
                </div>
            </UserLayout>
            
            {/* Authentication Dialog */}
            <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Sign in required</DialogTitle>
                        <DialogDescription>
                            You need to sign in or create an account to complete your booking.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex items-center justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => router.visit(route('login', { redirect: window.location.pathname }))}>
                            Sign In
                        </Button>
                        <Button variant="default" onClick={() => router.visit(route('register', { redirect: window.location.pathname }))}>
                            Create Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


                                        <div className="flex justify-end">
                                            <Button 
                                                type="submit" 
                                                disabled={processing || error !== null}
                                            >
                                                {formData.attendees.length > 0 ? 'Continue to Assign Services' : 'Skip (Book Only for Myself)'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </div>
            </UserLayout>
        </>
    );
}