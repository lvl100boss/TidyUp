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

export default function Shop({ shop, randomShops }) {
    console.log(shop);
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
                            className={`${
                                shop?.availability === 1
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
                </div>
                <div className="lg:w-[15rem] 2xl:w-[22rem] hidden lg:block">
                    <div className="border p-5 rounded-md sticky top-20">
                        <div className="mb-3">
                            <h1 className="figtree-semibold text-2xl">
                                {shop?.shop_name}
                            </h1>
                            <Badge
                                className={`${
                                    shop?.availability === 1
                                        ? "bg-green-300"
                                        : "bg-secondary text-foreground"
                                } pointer-events-none`}
                            >
                                {shop?.availability === 1
                                    ? "Available"
                                    : "Unavailable"}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-center text-xs text-muted-foreground italic pointer-events-none">
                                {shop?.bio}
                            </p>
                        </div>

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
                                            Business Hours
                                        </DialogTitle>
                                        <BusinessHoursContent shop={shop} />
                                    </DialogHeader>
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
                                                defaultValue={`https://127.0.0.1:8000/shop/${shop?.id}`}
                                                readOnly
                                            />
                                        </div>
                                        <CopyButton
                                            textToCopy={`127.0.0.1:8000/shop/${shop?.id}`}
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
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                            >
                                <TriangleAlert size={20} />
                                Report Account
                            </Button>
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
