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
import ShopCarousel from "@/Components/User/ShopCarousel";
import { Component, Clock8, Share2, TriangleAlert } from "lucide-react";
import { Separator } from "@/Components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/Components/ui/label";

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
                            })} w-full rounded-sm mt-3 figtree-semibold uppercase`}
                        >
                            Book Now!
                        </Link>
                        <Separator className="my-5" />
                        <div className="space-y-3">
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                            >
                                <Clock8 size={20} />
                                Open until
                            </Button>
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                            >
                                <Share2 size={20} />
                                Share
                            </Button>
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
