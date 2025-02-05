import UserLayout from "@/Layouts/UserLayout";
import ShopGallery from "@/Components/User/ShopGallery";
import { Badge } from "@/Components/ui/badge";
import { Head, Link } from "@inertiajs/react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs2";
import { Button, buttonVariants } from "@/Components/ui/button";

export default function Shop({ shop, branch, branchServices }) {
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

    console.log(categories);
    return (
        <UserLayout>
            <Head title={shop.shop_name} />
            <div className="mb-3">
                <h1 className="figtree-semibold text-2xl">{shop.shop_name}</h1>
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
                <div className="inline-flex gap-2 items-center">
                    <h1 className="figtree-semibold text-lg">Location</h1>
                    <p className="figtree-light text-muted-foreground text-sm mt-1">
                        {branch.detailed_address}
                    </p>
                </div>
            </div>
            <div className="mb-3">
                <Tabs defaultValue={categories[0]} className="">
                    {/* Tabs List */}
                    <TabsList className="flex  justify-start !bg-none ">
                        <h1 className="figtree-semibold text-lg">Services</h1>
                        {categories.map((category) => (
                            <TabsTrigger key={category} value={category}>
                                {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Tabs Content */}
                    {groupedServices.map(({ category, services }) => (
                        <TabsContent
                            key={category}
                            value={category}
                            className=""
                        >
                            <ul className="space-y-2">
                                {services.map((service) => (
                                    <li
                                        key={service.id}
                                        className="p-2 border-b flex justify-between items-center"
                                    >
                                        <div>
                                            <p>
                                                <strong>
                                                    {service.service_name}
                                                </strong>
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {service.duration}
                                            </p>
                                        </div>{" "}
                                        <p className="figtree-medium">
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
                    <h1 className="figtree-semibold text-lg">Contact</h1>
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
            <div className="mb-3">
                <Link
                    className={`${buttonVariants({
                        variant: "default",
                    })} w-full`}
                >
                    Book Now!
                </Link>
            </div>
        </UserLayout>
    );
}
