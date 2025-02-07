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
import { Component, Clock8, Share2, TriangleAlert } from "lucide-react";
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

const getClosingTime = (operation_hours) => {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    const todaySchedule = operation_hours.find((day) => day.day === today);

    return todaySchedule && todaySchedule.is_open
        ? formatTime(todaySchedule.closing_time)
        : "Closed";
};
export default function Shop({ shop, branch, branchServices, randomShops }) {
    console.log(branchServices);
    const categories = [
        ...new Set(
            branchServices.map(
                (service) => service.service_category.category_name
            )
        ),
    ];

    const groupedServices = categories.map((category) => ({
        category,
        services: branchServices.filter(
            (service) => service.service_category.category_name === category
        ),
    }));

    const [closingTime, setClosingTime] = useState("Loading...");

    useEffect(() => {
        if (branch && branch.operation_hours) {
            setClosingTime(getClosingTime(branch.operation_hours));
        }
    }, [branch]);

    console.log(branch);
    return (
        <UserLayout>
            <Head title={shop.shop_name} />
            <div className="grid lg:grid-cols-4 gap-5">
                <div className="col-span-3">
                    <div className="mb-3 lg:hidden">
                        <h1 className="figtree-semibold text-2xl">
                            {shop.shop_name}
                        </h1>
                        <div className="inline-flex gap-2 items-center">
                            <p className="text-sm">{branch.branch_name}</p>
                            <Badge className="bg-green-300 text-foreground dark:text-background">
                                {branch.availability}
                            </Badge>
                        </div>
                    </div>
                    <div className="mb-3">
                        <ShopGallery branch={branch} />
                    </div>

                    <div className="mb-3">
                        <Tabs defaultValue={categories[0]} className="">
                            {/* Tabs List */}
                            <h1 className="figtree-semibold text-lg mb-2">
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
                                                className="p-2 flex justify-between items-center"
                                            >
                                                <div className="inline-flex items-center gap-2">
                                                    <Component size={20} />
                                                    <div>
                                                        <p className="underline">
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
                    <div className="">
                        <div className="inline-flex gap-2 items-center">
                            <h1 className="figtree-semibold text-lg">
                                Location
                            </h1>
                            <p className="figtree-light text-muted-foreground text-sm mt-1">
                                {branch.detailed_address}
                            </p>
                        </div>
                    </div>
                    <div className="">
                        <div className="inline-flex gap-2 items-center">
                            <h1 className="figtree-semibold text-lg">
                                Contact
                            </h1>
                            <p className="figtree-light text-muted-foreground text-sm mt-1">
                                {branch.contact_number}
                            </p>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div className="inline-flex gap-2 items-center">
                            <h1 className="figtree-semibold text-lg">Email</h1>
                            <p className="figtree-light text-muted-foreground text-sm mt-1">
                                {branch.email}
                            </p>
                        </div>
                    </div>
                    <div className="mb-3 lg:hidden">
                        <Link
                            className={`${buttonVariants({
                                variant: "default",
                            })} w-full`}
                        >
                            Book Now!
                        </Link>
                    </div>
                </div>
                <div className="col-span-1 hidden lg:block">
                    <div className="border p-5 rounded-md ">
                        <div className="mb-3">
                            <h1 className="figtree-semibold text-2xl">
                                {shop.shop_name}
                            </h1>
                            <div className="inline-flex gap-2 items-center">
                                <p className="text-sm">{branch.branch_name}</p>
                                <Badge className="bg-green-300 text-foreground dark:text-background">
                                    {branch.availability}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <p className="text-center text-xs text-muted-foreground italic opacity-0 pointer-events-none">
                                "Make Sure to Check the Other Branches Too!"
                            </p>
                        </div>
                        <Label className="mt-3 figtree-semibold">
                            Select Branches
                        </Label>
                        <Select
                            onValueChange={(branchId) => {
                                router.visit(`/shop/${shop.id}/${branchId}`);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={branch.branch_name} />
                            </SelectTrigger>
                            <SelectContent>
                                {shop.branches.map((branch) => (
                                    <SelectItem
                                        value={branch.id}
                                        key={branch.id}
                                    >
                                        {branch.branch_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Link
                            className={`${buttonVariants({
                                variant: "default",
                            })} w-full rounded-sm mt-3 figtree-semibold `}
                        >
                            Book Now!
                        </Link>
                        <Separator className="my-5" />
                        <div className="space-y-3">
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
                                            Click to view our shop's operating
                                            hours.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

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
                                                defaultValue={`https://127.0.0.1:8000/shop/${shop.id}/${branch.id}`}
                                                readOnly
                                            />
                                        </div>
                                        <CopyButton
                                            textToCopy={`127.0.0.1:8000/shop/${shop.id}/${branch.id}`}
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
