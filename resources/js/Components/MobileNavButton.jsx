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
    TrendingUp,
    Compass,
    Scissors,
    Droplet,
    MessagesSquare,
    MessageCircleQuestion,
    MessageSquareWarning,
    House,
    SquareChevronUp,
} from "lucide-react";

const MobileNavButton = () => {
    const { url } = usePage();

    const mainLinks = [
        { href: "/", label: "Home", icon: House },
        { href: "/appointments", label: "Appointments", icon: Calendar },
        { href: "/discover", label: "Discover", icon: Compass },
        { href: "/popular", label: "Popular", icon: TrendingUp },
    ];

    const categoryLinks = [
        { href: "/barbershops", label: "Barbershops", icon: Scissors },
        { href: "/hair-salons", label: "Hair Salons", icon: Droplet },
    ];

    const helpLinks = [
        { href: "/FAQs", label: "FAQ's", icon: MessageCircleQuestion },
        {
            href: "/send-feedback",
            label: "Send Feedback",
            icon: MessagesSquare,
        },
        {
            href: "/report-issue",
            label: "Report An Issue",
            icon: MessageSquareWarning,
        },
    ];
    return (
        <div className="md:hidden">
            <Drawer>
                <DrawerTrigger>
                    <Button size="sm" className="fixed bottom-5 right-5 shop">
                        <SquareChevronUp />
                        <span className="font-medium text-sm">Menu</span>
                    </Button>
                </DrawerTrigger>
                <DrawerContent onCloseAutoFocus={(e) => e.preventDefault()}>
                    <div className="md:border rounded-lg mx-auto mt-2">
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

export default MobileNavButton;
