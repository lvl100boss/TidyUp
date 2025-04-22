import UserLayout from "@/Layouts/UserLayout";
import ShopGallery from "@/Components/User/ShopGallery";
import { Badge } from "@/Components/ui/badge";
import { Head, Link, router } from "@inertiajs/react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs2";
import { Button, buttonVariants } from "@/Components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import ShopCarousel from "@/Components/User/ShopCarousel";
import {
    Component,
    Clock8,
    Share2,
    TriangleAlert,
    RefreshCw,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Globe,
    Star
} from "lucide-react";
import CopyButton from "@/Components/CopyButton";
import { Separator } from "@/Components/ui/separator";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";



import { Label } from "@/Components/ui/label";
import { useState, useEffect } from "react";
import ShopDetailsCard from "@/Components/Shop/ShopPage/ShopDetailsCard";
import BookNowButton from "@/Components/Shop/ShopPage/BookNowButton";
import ServiceTabs from "@/Components/Shop/ShopPage/ServiceTabs";
import BusinessHoursContent from "@/Components/Shop/ShopPage/BusinessHoursContent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReviewsSection from "@/Components/Shop/ShopPage/ReviewsSection";

export default function Shop({ shop, randomShops, reviews }) {
    // Remove the verification check from useEffect
    // and use conditional rendering instead
    if (!shop) {
        return null;
    }

    // Handle redirection for unverified shops after component mounts
    useEffect(() => {
        if (shop && shop.status !== 'verified') {
            router.visit('/not-found');
        }
    }, [shop]);

    // Early return if shop is not verified
    if (shop && shop.status !== 'verified') {
        return null;
    }

    const categories = [
        ...new Set(
            shop?.shop_service_categories?.map(
                (service) => service.service_categories?.name
            ) || []
        ),
    ];

    const groupedServices = categories.map((category) => ({
        category,
        services:
            shop?.shop_service_categories?.filter(
                (service) => service.service_categories?.name === category
            ) || [],
    }));

    const currentUrl = window.location.href;
    const socialMediaIcons = {
        Instagram: <Instagram className="h-5 w-5" />,
        Facebook: <Facebook className="h-5 w-5" />,
        Twitter: <Twitter className="h-5 w-5" />,
        Youtube: <Youtube className="h-5 w-5" />,
        Globe: <Globe className="h-5 w-5" />
    };
    return (
        <UserLayout>
            <Head title={shop?.shop_name} />
            <div className="flex gap-5">
                <div className="flex-1">
                    <div className="mb-3 lg:hidden inline-flex gap-2 items-center">
                        <h1 className="figtree-semibold text-2xl">
                            {shop?.shop_name}
                        </h1>
                        <Badge
                            className={`${shop?.availability === 1
                                ? "bg-green-300"
                                : "bg-secondary text-foreground"
                                } pointer-events-none`}
                        >
                            {shop?.availability === 1
                                ? "Available"
                                : "Unavailable"}
                        </Badge>
                    </div>
                    <div className="mb-3">
                        <ShopGallery shop={shop} />
                    </div>

                    {/* Service Tabs */}
                    <ServiceTabs
                        categories={categories}
                        groupedServices={groupedServices}
                    />

                    <ShopDetailsCard shop={shop} />

                    {/* Reviews Section */}
                    <ReviewsSection reviews={reviews} />

                </div>
                <div className="lg:w-[15rem] 2xl:w-[22rem] hidden lg:block">
                    <div className="border p-5 rounded-md sticky top-20">
                        <div className="flex gap-3">
                            <div>
                                <Avatar className="size-14">
                                    <AvatarImage src={'/' + shop.shop_photo} className="" />
                                    <AvatarFallback className="uppercase">{shop.shop_name.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="mb-3">
                                <h1 className="figtree-semibold text-2xl">
                                    {shop?.shop_name}
                                </h1>

                                <p className="text-xs text-muted-foreground italic pointer-events-none">
                                    {shop?.bio}
                                </p>
                            </div>
                        </div>
                        {/* <div>
                            <Badge
                                className={`${shop?.availability === 1
                                    ? "bg-green-300"
                                    : "bg-secondary text-foreground"
                                    } pointer-events-none`}
                            >
                                {shop?.availability === 1
                                    ? "Available"
                                    : "Unavailable"}
                            </Badge>
                        </div> */}

                        <BookNowButton shop_id={shop?.id} />
                        <Separator className="my-5" />
                        <div className="space-y-3">
                            <Dialog>
                                <DialogTrigger className="w-full">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger className="w-full">
                                                <Button
                                                    className="w-full justify-start"
                                                    variant="outline"
                                                >
                                                    <Clock8 size={20} />
                                                    View Shop's Business Hours
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Click to view our shop's
                                                    business hours.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </DialogTrigger>
                                <DialogContent className="max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Shop's Business Hours
                                        </DialogTitle>
                                    </DialogHeader>
                                    <BusinessHoursContent shop={shop} />
                                </DialogContent>
                            </Dialog>
                            <Dialog >
                                <DialogTrigger className="w-full">
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Globe size={20} />
                                        View Shop's Social Media
                                    </Button>
                                </DialogTrigger>
                                <DialogContent >
                                    <DialogHeader>
                                        <DialogTitle>Social Media Links</DialogTitle>
                                        <DialogDescription>
                                            Follow {shop.shop_name} on their social media platforms to stay updated.
                                        </DialogDescription>
                                    </DialogHeader>
                                    {shop.social_media && shop.social_media.length > 0 ? (
                                        shop.social_media.map((social) => (
                                            <div key={social.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {socialMediaIcons[social.icon]}
                                                    <div>
                                                        <p className="text-sm font-medium">{social.name}</p>
                                                        <a
                                                            href={social.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-muted-foreground hover:underline"
                                                        >
                                                            {social.url}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6 text-muted-foreground">
                                            <p className="mb-2">No social media added yet</p>
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Share2 size={20} />
                                        Share link
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Share link</DialogTitle>
                                        <DialogDescription>
                                            Anyone who has this link will be
                                            able to view this.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex items-center space-x-2">
                                        <div className="grid flex-1 gap-2">
                                            <Label
                                                htmlFor="link"
                                                className="sr-only"
                                            >
                                                Link
                                            </Label>
                                            <Input
                                                id="link"
                                                defaultValue={currentUrl}
                                                readOnly
                                            />
                                        </div>
                                        <CopyButton
                                            textToCopy={currentUrl}
                                        />
                                    </div>
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                            >
                                                Close
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>


                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                <ShopCarousel shops={randomShops} />
            </div>
        </UserLayout>
    );
}
