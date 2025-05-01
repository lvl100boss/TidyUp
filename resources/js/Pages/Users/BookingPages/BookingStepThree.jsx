import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
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
    
    const { data: formData, setData, post, processing, errors } = useForm({
        shop_id: shop.id,
        staff_id: data.staff_id,
        staff_index: data.staff_index,
        date: data.date,
        time: data.time,
        service_id: data.service_id,
        total_price: data.total_price,
        note: ' ',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // If in preview mode or not authenticated, show login dialog
        if (isPreview || !isAuthenticated) {
            setShowLoginDialog(true);
            return;
        }
        
        post(`/${shop.id}/booking/3`);
    };

    return (
        <>
            <Head title="Appointment Processing" />
            <UserLayout>
                <div className="min-h-screen">
                    <header className="flex justify-center relative ">
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
                    <section>
                        <h1 className='text-2xl font-bold mb-5'>Confirm your Appointment</h1>
                        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
                            <div>
                                <Card className="overflow-hidden">
                                    <img className='w-full aspect-video mb-5 object-cover' src={`/${shop.shop_gallery[0].url}`} />
                                    <CardContent>
                                        <CardTitle>Shop Name</CardTitle>
                                        <CardDescription className="">
                                            {shop.shop_name}
                                        </CardDescription>
                                    </CardContent>
                                    <CardContent>
                                        <CardTitle>Location</CardTitle>
                                        <CardDescription className="">
                                            {shop.detailed_address}
                                        </CardDescription>
                                    </CardContent>
                                    <CardContent>
                                        <CardTitle>Schedule</CardTitle>
                                        <CardDescription className="">
                                            {new Date(data.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </CardDescription>
                                        <CardDescription className="">
                                            {new Date(`2024-01-01T${data.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </div>
                            <div>
                                <Card>
                                    <CardHeader>
                                        <h1 className=' font-bold text-xl'>Services Summary</h1>
                                    </CardHeader>
                                    <CardContent className="pb-3">
                                        <CardTitle>Stylist</CardTitle>
                                        <div className="py-3 inline-flex items-center gap-3">
                                            <Avatar className="size-16">
                                                <AvatarImage src={'/storage/' + shopStaff[data.staff_index].staff.profile_photo_path} />
                                                <AvatarFallback>
                                                    {shopStaff[data.staff_index].staff.first_name[0] + shopStaff[data.staff_index].staff.last_name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-medium">
                                                    {shopStaff[data.staff_index].staff.first_name} {shopStaff[data.staff_index].staff.last_name}
                                                </h3>
                                                <h4 className="text-sm text-muted-foreground">
                                                    {shopStaff[data.staff_index].role}
                                                </h4>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardContent>
                                        <CardTitle>Note</CardTitle>
                                        <CardDescription className="mb-3">
                                            Leave a note (optional)
                                        </CardDescription>
                                        <Textarea
                                            placeholder="Type your message here."
                                            onChange={(e) => setData('note', e.target.value)}
                                            rows={8}
                                        />
                                    </CardContent>
                                    <CardContent className="pb-3">
                                        <CardTitle className="mb-2">Services</CardTitle>
                                        <CardDescription className="">
                                            {shop.shop_service_categories.map((service) => (
                                                data.service_id.map((selectedService) => {
                                                    if (service.id === selectedService) {
                                                        return (
                                                            <div key={service.id} className='flex items-center justify-between gap-2'>
                                                                <p className=''>
                                                                    - {service.service_name}
                                                                </p>
                                                                <p className='text-sm '>
                                                                    ₱{service.cost}
                                                                </p>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            ))}
                                        </CardDescription>
                                    </CardContent>

                                    <div className='mx-6'>
                                        <Separator className="" />
                                    </div>

                                    <CardFooter className='w-full pt-3'>
                                        <div className='flex justify-between items-center w-full'>
                                            <CardTitle className="text-2xl">Total Cost</CardTitle>
                                            <CardTitle className="text-2xl ">
                                                ₱{data.total_price}
                                            </CardTitle>
                                        </div>
                                    </CardFooter>
                                    <CardContent>
                                        <Button type="submit" className="w-full font-bold">
                                            Confirm Appointment
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
        </>
    );
}