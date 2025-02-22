import React from "react";
import ShopsLayout from "@/Layouts/ShopsLayout";
import { Head, Link } from "@inertiajs/react";
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
    Instagram,
    Facebook,
    Globe,
    Users,
    Scissors,
    ArrowUpRight,
    Pencil
} from "lucide-react";

import ShopGalleryCard from "@/Components/Shop/ShopProfile/ShopGalleryCard";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";

const ShopProfile = ({ shop }) => {
    // Sample shop data structure
    console.log(shop);
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

            <div className="flex-1 space-y-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-2/3 space-y-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage
                                            src={`/${shop.shop_photo}`}
                                            className="object-cover"
                                        />
                                        <AvatarFallback>GS</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-bold">
                                                {shop.shop_name}
                                            </h2>
                                        </div>
                                        <p className="text-muted-foreground">
                                            {shop.bio}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Services Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <Link className="flex items-center gap-2 hover:underline" href={`/shop/catalog`}>
                                        <Scissors className="h-5 w-5" />
                                        <span>Services ({shop.shop_service_categories.length})</span>
                                    </Link>
                                    <Link href={`/shop/catalog`} className="flex items-center gap-2 hover:underline">
                                        <span className="text-sm text-accent-foreground">View All</span>
                                        <ArrowUpRight className="h-5 w-5" />
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {shop.shop_service_categories.slice(0, 6).map(
                                        (service, index) => (
                                            <div
                                                key={index}
                                                className="border rounded-lg p-4"
                                            >
                                                <h3 className="font-medium">
                                                    {service.service_name}
                                                </h3>
                                                <div className="mt-2 space-y-1 text-sm">
                                                    <p className="text-green-600 font-bold">
                                                        Php {service.cost}
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        Duration:{" "}
                                                        {service.duration_hour + ' hours ' + service.duration_minute + ' minutes'}
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
                                <CardTitle className="flex items-center justify-between">
                                    <Link href={`/shop/manage/staff`} className="flex items-center gap-2 hover:underline">
                                        <Users className="h-5 w-5" />
                                        <span>Our Team ({shop.staffs.length})</span>
                                    </Link>
                                    <Link className="flex items-center gap-2 hover:underline" href={`/shop/manage/staff`}>
                                        <span className="text-sm text-accent-foreground">View All</span>
                                        <ArrowUpRight className="h-5 w-5" />
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {shop.staffs.slice(0, 4).map((member, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-4 border rounded-lg p-4"
                                        >
                                            <Avatar>
                                                <AvatarImage
                                                    src={`/storage/${member.staff.profile_photo_path}`}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback>
                                                    {member.staff.first_name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-medium">
                                                    {member.staff.first_name}{" "}
                                                    {member.staff.last_name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {member.staff.email}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {member.role[0].toUpperCase() + member.role.slice(1)}

                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="w-full md:w-1/3 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        {shop.detailed_address}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">
                                        {shop.contact_number}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm">{shop.email}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader >
                                <div className="flex justify-between ">
                                    <CardTitle>Business Hours</CardTitle>
                                    <Pencil className="size-4 cursor-pointer hover:scale-125 transition-transform" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {shop.shop_operation_hours.map((hours) => (
                                    <>
                                        <div
                                            key={hours.day}
                                            className="flex justify-between text-sm p-2 hover:bg-muted rounded-md"
                                        >
                                            <span className="capitalize">
                                                {hours.day}
                                            </span>
                                            <span className={hours.is_open ? "font-bold" : "text-red-600 font-bold"}>
                                                {hours.is_open
                                                    ? `${new Date(
                                                        `1970-01-01T${hours.open_time}Z`
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })} - ${new Date(
                                                        `1970-01-01T${hours.close_time}Z`
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    })}`
                                                    : "Closed"}
                                            </span>
                                        </div>
                                        <Separator />
                                    </>
                                ))}
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
                {/* Shop Gallery */}
                <ShopGalleryCard shop_gallery={shop.shop_gallery} />
            </div>
        </ShopsLayout>
    );
};

export default ShopProfile;
