import { Button, buttonVariants } from "@/Components/ui/button";
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState, useCallback } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/Components/ui/drawer";

import {
    Calendar,
    LayoutDashboard,
    Building2,
    BookOpen,
    Store,
    SquareChevronUp,
} from "lucide-react";

const ShopMobileNavButton = () => {
    const { url } = usePage();

    const mainLinks = [
        { href: "/shop/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/shop/appointments", label: "Appointments", icon: Calendar },
        { href: "/shop/profile", label: "Shop Profile", icon: Building2 },
        { href: "/shop/catalog", label: "Shop Catalog", icon: BookOpen },
        { href: "/shop/manage/staff", label: "Manage Staffs", icon: Store },
    ];

    return (
        <div className="lg:hidden">
            <Drawer>
                <DrawerTrigger>
                    <Button size="sm" className="fixed bottom-5 right-5 shop">
                        <SquareChevronUp />
                        <span className="font-medium text-sm">Menu</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent onCloseAutoFocus={(e) => e.preventDefault()}>
                    <div className="md:border md:max-w-lg rounded-lg mx-auto mt-2">
                        <DrawerHeader>
                            <DrawerTitle className="text-center">
                                Menu
                            </DrawerTitle>
                            {/* <DrawerDescription>Tidy Up.</DrawerDescription> */}
                        </DrawerHeader>
                        <div className="mx-auto px-5 pb-5">
                            {mainLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`w-full ${buttonVariants({
                                        variant:
                                            url === link.href
                                                ? "secondary"
                                                : "ghost",
                                    })} !justify-start`}
                                >
                                    <link.icon />
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <DrawerFooter>
                        {/* <Button>Submit</Button> */}
                        <DrawerClose>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default ShopMobileNavButton;
