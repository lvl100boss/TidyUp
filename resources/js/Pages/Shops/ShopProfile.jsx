import React from "react";
import ShopsLayout from "@/Layouts/ShopsLayout";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Instagram,
    Facebook,
    Globe,
    Camera,
    Users,
    Scissors,
    Calendar,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
const ShopProfile = ({ shop }) => {
    // Sample shop data structure
    const sampleShop = {
        id: 1,
        name: "Glamour Salon & Spa",
        description:
            "Premier beauty salon offering a wide range of services including haircuts, styling, coloring, and spa treatments.",
        address: "123 Beauty Street, Manila, Philippines",
        phone: "+63 912 345 6789",
        email: "contact@glamoursalon.com",
        rating: 4.8,
        totalReviews: 256,
        openingHours: {
            monday: "9:00 AM - 7:00 PM",
            tuesday: "9:00 AM - 7:00 PM",
            wednesday: "9:00 AM - 7:00 PM",
            thursday: "9:00 AM - 7:00 PM",
            friday: "9:00 AM - 8:00 PM",
            saturday: "9:00 AM - 8:00 PM",
            sunday: "10:00 AM - 6:00 PM",
        },
        social: {
            instagram: "@glamoursalon",
            facebook: "GlamourSalonPH",
            website: "www.glamoursalon.com",
        },
        services: [
            { name: "Haircut", price: "₱500 - ₱800", duration: "1 hour" },
            {
                name: "Hair Color",
                price: "₱2,500 - ₱4,500",
                duration: "2-3 hours",
            },
            { name: "Manicure", price: "₱350", duration: "45 mins" },
            { name: "Pedicure", price: "₱400", duration: "1 hour" },
            { name: "Facial", price: "₱1,200", duration: "1 hour" },
            {
                name: "Full Body Massage",
                price: "₱1,500",
                duration: "1.5 hours",
            },
        ],
        staff: [
            {
                name: "Maria Santos",
                role: "Senior Stylist",
                experience: "8 years",
            },
            {
                name: "John Cruz",
                role: "Color Specialist",
                experience: "6 years",
            },
            { name: "Ana Reyes", role: "Nail Artist", experience: "5 years" },
            {
                name: "Mike Tan",
                role: "Massage Therapist",
                experience: "7 years",
            },
        ],
    };

    return (
        <ShopsLayout>
            <Head title="Shop Profile" />

            <div className="flex-1 space-y-4 md:p-8 pt-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-2/3 space-y-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src="/shop-avatar.jpg" />
                                        <AvatarFallback>GS</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-bold">
                                                {sampleShop.name}
                                            </h2>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary">
                                                    Verified
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    ⭐ {sampleShop.rating} (
                                                    {sampleShop.totalReviews}{" "}
                                                    reviews)
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground">
                                            {sampleShop.description}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Services Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Scissors className="h-5 w-5" />
                                    Services
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {sampleShop.services.map(
                                        (service, index) => (
                                            <div
                                                key={index}
                                                className="border rounded-lg p-4"
                                            >
                                                <h3 className="font-medium">
                                                    {service.name}
                                                </h3>
                                                <div className="mt-2 space-y-1 text-sm">
                                                    <p className="text-green-600 font-medium">
                                                        {service.price}
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        Duration:{" "}
                                                        {service.duration}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Staff Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Our Team
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {sampleShop.staff.map((member, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 border rounded-lg p-4"
                                        >
                                            <Avatar>
                                                <AvatarFallback>
                                                    {member.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-medium">
                                                    {member.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {member.role}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Experience:{" "}
                                                    {member.experience}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Information */}
                    <div className="w-full md:w-1/3 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        {sampleShop.address}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        {sampleShop.phone}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        {sampleShop.email}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Business Hours</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {Object.entries(sampleShop.openingHours).map(
                                    ([day, hours]) => (
                                        <div
                                            key={day}
                                            className="flex justify-between text-sm"
                                        >
                                            <span className="capitalize">
                                                {day}
                                            </span>
                                            <span>{hours}</span>
                                        </div>
                                    )
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Social Media</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Instagram className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        {sampleShop.social.instagram}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Facebook className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        {sampleShop.social.facebook}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        {sampleShop.social.website}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Camera className="h-5 w-5" />
                            Gallery
                        </CardTitle>
                        <CardDescription>
                            Browse our salon's portfolio and facilities
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4, 5, 6, 8].map((id) => (
                                <Dialog key={id}>
                                    <DialogTrigger asChild>
                                        <div className="aspect-square cursor-pointer relative group overflow-hidden rounded-lg">
                                            <img
                                                src={`https://source.unsplash.com/random/800x800?salon,${id}`}
                                                alt={`Gallery image ${id}`}
                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <img
                                            src={`https://source.unsplash.com/random/1200x800?salon,${id}`}
                                            alt={`Gallery image ${id}`}
                                            className="w-full h-auto rounded-lg"
                                        />
                                    </DialogContent>
                                </Dialog>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ShopsLayout>
    );
};

export default ShopProfile;
