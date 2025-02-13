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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Label } from "@/Components/ui/label";
import { useState, useEffect } from "react";

const formatTime = (time) => {
    if (!time) return "Closed";

    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

const getClosingTime = (shop_operation_hours) => {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    const todaySchedule = shop_operation_hours.find(
        (day) => day.day.charAt(0).toUpperCase() + day.day.slice(1) === today
    );

    return todaySchedule && todaySchedule.is_open
        ? formatTime(todaySchedule.close_time)
        : "Closed";
};

function BookNowButton({ shop_id }) {
    return (
        <Link
            href={`/booking/${shop_id}`}
            className={`${buttonVariants({
                variant: "default",
            })} w-full rounded-sm mt-3 figtree-semibold `}
        >
            Book Now!
        </Link>
    );
}

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

    const [closingTime, setClosingTime] = useState("Loading...");

    useEffect(() => {
        if (shop && shop?.shop_operation_hours) {
            setClosingTime(getClosingTime(shop?.shop_operation_hours));
        }
    }, [shop]);

    return (
        <UserLayout>
            <Head title={shop?.shop_name} />
            <div className="flex gap-5">
                <div className="flex-1">
                    <div className="mb-3 lg:hidden inline-flex gap-2 items-center">
                        <h1 className="figtree-semibold text-2xl">
                            {shop?.shop_name}
                        </h1>
                        <Badge className="bg-green-300 pointer-events-none text-foreground dark:text-background">
                            {shop?.availability === 1 ? "Open" : "Closed"}
                        </Badge>
                    </div>
                    <div className="mb-3">
                        <ShopGallery shop={shop} />
                    </div>

                    <div className="mb-3">
                        <Tabs defaultValue={categories[0]} className="">
                            {/* Tabs List */}
                            <h1 className="figtree-semibold text-2xl mb-2">
                                Services
                            </h1>
                            <TabsList className="flex  justify-start !bg-none mb-4">
                                {categories.map((category) => (
                                    <TabsTrigger
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {/* Tabs Content */}
                            {groupedServices.map(({ category, services }) => (
                                <TabsContent
                                    key={category}
                                    value={category}
                                    className="border p-1 rounded-md shadow-sm"
                                >
                                    <ul className="space-y-2">
                                        {services.map((service) => (
                                            <li
                                                key={service.id}
                                                className="p-2 flex justify-between items-center group hover:bg-muted/50 rounded-md"
                                            >
                                                <div className="inline-flex items-center gap-2">
                                                    <Component size={20} />
                                                    <div>
                                                        <p className="group-hover:underline group:hover">
                                                            <strong>
                                                                {
                                                                    service.service_name
                                                                }
                                                            </strong>
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {service.duration}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="figtree-semibold">
                                                    Php {service.cost}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                    <div className="my-10">
                        <div className="figtree-bold text-2xl mb-3">
                            Shop Details
                        </div>
                        <div className="space-y-2">
                            <div className="">
                                <div className="inline-flex gap-2 items-center">
                                    <div className="inline-flex items-center gap-3">
                                        <MapPin
                                            size={18}
                                            className="mb-[0.1rem]"
                                        />
                                        <h1 className="figtree-semibold text-lg">
                                            Location
                                        </h1>
                                    </div>
                                    <p className="figtree-light text-muted-foreground text-sm mt-1">
                                        {shop?.detailed_address}
                                    </p>
                                </div>
                            </div>
                            <div className="">
                                <div className="inline-flex gap-2 items-center">
                                    <div className="inline-flex items-center gap-3">
                                        <Phone
                                            size={18}
                                            className="mb-[0.1rem]"
                                        />
                                        <h1 className="figtree-semibold text-lg">
                                            Contact
                                        </h1>
                                    </div>
                                    <p className="figtree-light text-muted-foreground text-sm mt-1">
                                        {shop?.contact_number}
                                    </p>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="inline-flex gap-2 items-center">
                                    <div className="inline-flex items-center gap-3">
                                        <Mail
                                            size={18}
                                            className="mb-[0.1rem]"
                                        />
                                        <h1 className="figtree-semibold text-lg">
                                            Email
                                        </h1>
                                    </div>
                                    <p className="figtree-light text-muted-foreground text-sm mt-1">
                                        {shop?.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3 lg:hidden">
                            <BookNowButton shop_id={shop?.id} />
                        </div>
                    </div>
                </div>
                <div className="lg:w-[15rem] 2xl:w-[22rem] hidden lg:block">
                    <div className="border p-5 rounded-md ">
                        <div className="mb-3">
                            <h1 className="figtree-semibold text-2xl">
                                {shop?.shop_name}
                            </h1>
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
                                                    Open until {closingTime}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Click to view our shop's
                                                    operating hours.
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </DialogTrigger>
                                <DialogContent className="max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Operation Hours
                                        </DialogTitle>
                                        <div className="">
                                            <div className="grid grid-cols-2">
                                                <DialogDescription>
                                                    AVAILABLE DAYS
                                                </DialogDescription>
                                                <DialogDescription>
                                                    AVAILABLE TIMES
                                                </DialogDescription>
                                            </div>
                                            <div className="mt-3 space-y-3">
                                                {shop?.shop_operation_hours.map(
                                                    (day) => (
                                                        <div
                                                            key={day.day}
                                                            className="grid grid-cols-2 items-center gap-5"
                                                        >
                                                            <div className="w-full ">
                                                                <div
                                                                    className={`figtree-bold uppercase w-full ${buttonVariants(
                                                                        {
                                                                            variant:
                                                                                day.is_open
                                                                                    ? "default"
                                                                                    : "secondary",
                                                                        }
                                                                    )}`}
                                                                >
                                                                    {day.day}
                                                                </div>
                                                            </div>
                                                            <div
                                                                className={
                                                                    !day.is_open &&
                                                                    "text-muted-foreground uppercase"
                                                                }
                                                            >
                                                                {day.is_open
                                                                    ? `${formatTime(
                                                                          day.open_time
                                                                      )} - ${formatTime(
                                                                          day.close_time
                                                                      )}`
                                                                    : "Closed"}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
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
