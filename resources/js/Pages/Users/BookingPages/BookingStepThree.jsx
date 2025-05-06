import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, LogOut, Calendar, Clock, MapPin, User, MessageSquare } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
    const [nicknameError, setNicknameError] = useState("");
    const [bookingForOther, setBookingForOther] = useState(false);

    const { data: formData, setData, post, processing, errors } = useForm({
        shop_id: shop.id,
        staff_id: data.staff_id,
        staff_index: data.staff_index,
        date: data.date,
        time: data.time,
        service_id: data.service_id,
        total_price: data.total_price,
        note: '',
        nickname: auth?.user?.first_name || '',
        booking_for_other: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate nickname field
        if (!formData.nickname || formData.nickname.trim() === '') {
            setNicknameError("Nickname is required");
            return;
        } else {
            setNicknameError("");
        }

        // If in preview mode or not authenticated, show login dialog
        if (isPreview || !isAuthenticated) {
            setShowLoginDialog(true);
            return;
        }

        post(`/${shop.id}/booking/3`);
    };

    // Handle bookingForOther toggle change
    const handleBookingForOtherChange = (checked) => {
        setBookingForOther(checked);
        setData('booking_for_other', checked);
        
        // Reset nickname when switching modes
        if (checked) {
            setData('nickname', ''); // Clear the nickname when booking for someone else
        } else {
            setData('nickname', auth?.user?.first_name || ''); // Reset to user's name
        }
    };

    return (
        <>
            <Head title="Confirm Appointment" />
            <UserLayout>
                <div className="min-h-screen max-w-7xl mx-auto px-4 pb-10">
                    <header className="border-b mb-8">
                        <div className="py-4 flex items-center justify-between">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={isPreview ? `/${shop.id}/preview/booking/2` : `/${shop.id}/booking/2`} className="flex items-center">
                                    <ChevronLeft className="mr-2" />
                                    <span>Back to Schedule</span>
                                </Link>
                            </Button>
                            <h1 className="text-xl sm:text-2xl font-bold">Book an Appointment</h1>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/${shop.id}/shop`} className="flex items-center">
                                    <span className="hidden sm:inline-block mr-2">Cancel</span>
                                    <LogOut className="size-4" />
                                </Link>
                            </Button>
                        </div>
                    </header>

                    <div className="max-w-xl mx-auto mb-10">
                        <StepsIndicator step={3} />
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold mb-2">Confirm Your Appointment</h2>
                        <p className="text-muted-foreground mb-8">
                            Review the details below and provide any additional information needed.
                        </p>
                        
                        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="size-5" />
                                            Appointment Details
                                        </CardTitle>
                                    </CardHeader>
                                    
                                    <CardContent className="space-y-6">
                                        <div>
                                            <img 
                                                className="w-full aspect-video object-cover rounded-md" 
                                                src={`/${shop.shop_gallery[0].url}`}
                                                alt={shop.shop_name} 
                                            />
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-muted-foreground">Shop</p>
                                                <p className="font-medium">{shop.shop_name}</p>
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                    <MapPin className="size-4" />
                                                    Location
                                                </p>
                                                <p>{shop.detailed_address}</p>
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                    <Calendar className="size-4" />
                                                    Date
                                                </p>
                                                <p>{new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                    <Clock className="size-4" />
                                                    Time
                                                </p>
                                                <p>{new Date(`2024-01-01T${data.time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="size-5" />
                                            Services & Customer Details
                                        </CardTitle>
                                    </CardHeader>
                                    
                                    <CardContent className="pb-3 space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Stylist</p>
                                            <div className="flex items-center gap-3 py-2">
                                                <Avatar>
                                                    <AvatarImage src={'/storage/' + shopStaff[data.staff_index].staff.profile_photo_path} />
                                                    <AvatarFallback>
                                                        {shopStaff[data.staff_index].staff.first_name[0] + shopStaff[data.staff_index].staff.last_name[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-medium">
                                                        {shopStaff[data.staff_index].staff.first_name} {shopStaff[data.staff_index].staff.last_name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {shopStaff[data.staff_index].role}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Checkbox 
                                                    id="bookingForOther" 
                                                    checked={bookingForOther}
                                                    onCheckedChange={handleBookingForOtherChange}
                                                />
                                                <Label htmlFor="bookingForOther">
                                                    I am booking for someone else
                                                </Label>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="nickname" className="flex gap-1">
                                                    {bookingForOther ? "Name of person receiving service" : "Your preferred name"} 
                                                    <span className="text-destructive">*</span>
                                                </Label>
                                                <Input 
                                                    id="nickname"
                                                    placeholder={bookingForOther ? "Enter the name of the person who will attend" : "Enter your preferred name"}
                                                    value={formData.nickname}
                                                    onChange={(e) => {
                                                        setData('nickname', e.target.value);
                                                        if (e.target.value.trim() !== '') {
                                                            setNicknameError("");
                                                        }
                                                    }}
                                                    aria-invalid={!!nicknameError}
                                                />
                                                {nicknameError && (
                                                    <p className="text-sm text-destructive">{nicknameError}</p>
                                                )}
                                                <p className="text-sm text-muted-foreground">
                                                    {bookingForOther 
                                                        ? "This helps stylists identify the person when they arrive"
                                                        : "This helps stylists identify you when you arrive"}
                                                </p>
                                            </div>
                                        
                                            <div className="space-y-2">
                                                <Label htmlFor="note" className="flex items-center gap-2">
                                                    <MessageSquare className="size-4" />
                                                    Additional Notes
                                                </Label>
                                                <Textarea
                                                    id="note"
                                                    placeholder={bookingForOther 
                                                        ? "Add any special requests or notes about the person receiving service" 
                                                        : "Add any special requests or notes for your stylist"}
                                                    value={formData.note}
                                                    onChange={(e) => setData('note', e.target.value)}
                                                    rows={4}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="font-medium">Selected Services</h3>
                                            {shop.shop_service_categories.map((service) => (
                                                data.service_id.map((selectedService) => {
                                                    if (service.id === selectedService) {
                                                        return (
                                                            <div key={service.id} className="flex items-center justify-between">
                                                                <p>{service.service_name}</p>
                                                                <p className="font-medium">₱{service.cost}</p>
                                                            </div>
                                                        )
                                                    }
                                                    return null;
                                                })
                                            ))}
                                        </div>
                                    </CardContent>

                                    <Separator />

                                    <CardFooter className="flex justify-between items-center py-4">
                                        <CardTitle>Total</CardTitle>
                                        <CardTitle>₱{data.total_price}</CardTitle>
                                    </CardFooter>

                                    <CardContent>
                                        <Button 
                                            type="submit" 
                                            size="lg"
                                            className="w-full font-medium"
                                        >
                                            {processing ? "Processing..." : "Confirm Appointment"}
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