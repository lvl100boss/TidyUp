import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawerRight";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Link, usePage, useForm } from "@inertiajs/react"
import {
    BookOpenText,
    Binoculars,
    TrendingUp,
    House,
    Settings,
    MessageCircleMore,
    LogOut,
    KeyRound,
    User,
    LayoutDashboard,
    Store,
    CalendarCheck,
    Building,
    Sun, // Import Sun icon
    Moon // Import Moon icon
} from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn utility

// Reusable MenuItem component
const MenuItem = ({ href, icon: Icon, label, method = 'get', as = 'a', onClick, variant }) => {
    const handleClick = (e) => {
        if (href === '#') {
            e.preventDefault(); // Prevent navigation for '#' href
        }
        if (onClick) {
            onClick(e); // Call original onClick handler
        }
    };

    return (
        <>
            <div className='p-4'>
                <Link
                    href={href}
                    method={method}
                    as={as}
                    className={cn(
                        'flex items-center',
                        variant === 'destructive' && 'text-red-500'
                    )}
                    onClick={handleClick} // Use the modified handler
                >
                    <Icon className="mr-2" size={16} />
                    <span>{label}</span>
                </Link>
            </div>
            <Separator />
        </>
    );
};

const MobileMenu = ({ children }) => {
    const { props } = usePage();
    const user = props.auth?.user;
    const role = props.auth?.userRole?.role_id;
    const isLoggedIn = !!user;

    const [isDarkTheme, setIsDarkTheme] = useState(false);
    useEffect(() => {
        // Retrieve the theme preference from local storage
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark");
            setIsDarkTheme(true);
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkTheme) {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setIsDarkTheme(!isDarkTheme);
    };

    const navLinks = [
        { icon: House, href: "/", label: "Home" },
        { icon: BookOpenText, href: "/appointments", label: "My Appointments" },
        { icon: Binoculars, href: "/discover", label: "Discover" },
        { icon: TrendingUp, href: "/popular", label: "Popular" }
    ];

    const roleSpecificLinks = {
        1: { href: "/admin/dashboard", icon: LayoutDashboard, label: "Admin Dashboard" },
        2: { href: "/admin/dashboard", icon: LayoutDashboard, label: "Admin Dashboard" },
        3: { href: "/shop/dashboard", icon: Store, label: "Manage Shop" },
        4: { href: "/shop/appointment", icon: CalendarCheck, label: "Manage Appointments" },
        5: { href: "/shop/setup", icon: Building, label: "Setup a Shop" },
    };

    const userRoleLink = isLoggedIn && role && roleSpecificLinks[role]
        ? roleSpecificLinks[role]
        : null;

    return (
        <Drawer direction="right">
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent className="flex flex-col h-full">
                <DrawerHeader>
                    <DrawerTitle>Menu</DrawerTitle>
                </DrawerHeader>
                <Separator />

                <div className="flex-grow overflow-y-auto">
                    {navLinks.map((link) => (
                        <MenuItem key={link.href} {...link} />
                    ))}

                    <DrawerHeader className="my-4">
                        <DrawerTitle>Other Options</DrawerTitle>
                    </DrawerHeader>
                    <Separator />

                    {isLoggedIn && userRoleLink && <MenuItem {...userRoleLink} />}
                    <MenuItem
                        href="#"
                        icon={isDarkTheme ? Sun : Moon} // Use Sun/Moon icon
                        label={isDarkTheme ? "Switch To Light Mode" : "Switch To Dark Mode"} // Update label
                        onClick={toggleTheme}
                    />
                    {isLoggedIn && (
                        <>
                            <MenuItem href="/profile" icon={Settings} label="Settings" />
                            <MenuItem href="/send-feedback" icon={MessageCircleMore} label="Send Feedback" />
                        </>
                    )}
                    {isLoggedIn ? (
                        <MenuItem
                            href={route('logout')}
                            icon={LogOut}
                            label="Logout"
                            method="post"
                            as="button"
                            variant="destructive"
                        />
                    ) : (
                        <>

                            <MenuItem href={route('login')} icon={KeyRound} label="Login" />
                            <MenuItem href={route('register')} icon={User} label="Register" />
                        </>
                    )}
                </div>
                <DrawerFooter className="mt-auto">
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export default MobileMenu;

