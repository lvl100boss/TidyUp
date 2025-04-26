import { useEffect, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Notification } from "@/Components/User/Notification";
import { Link, usePage } from "@inertiajs/react";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawerRight"
import { Separator } from "@/components/ui/separator"

import { Bell, Menu, Search } from "lucide-react";
import ThemeButton from "@/Components/ThemeButton";
import SearchShop from "./Header/SearchShop";
import { cn } from "@/lib/utils";
import MobileMenu from "../MobileMenu";

const Header = ({ onClick, isDarkTheme, setIsDarkTheme }) => {
    const user = usePage().props.auth.user;
    const isLogged = user ? true : false;
    const role = usePage().props.auth.userRole || {};
    const [isScrolled, setIsScrolled] = useState(false);
    const { url } = usePage();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/appointments", label: "My Appointments" },
        { href: "/discover", label: "Discover" },
        { href: "/popular", label: "Popular" }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        // Header container with dynamic styling based on scroll position
        <header
            className={` mb-3 fixed top-0 left-0 right-0 z-50 px-5 py-3 bg-background/50 backdrop-blur-2xl border-dashed  ${isScrolled ? "border-b" : ""
                }`}
        >
            {/* Max width container for header content */}
            <div className="flex justify-between items-center max-w-screen-2xl mx-auto sm:px-2">
                {/* Logo and Application Title */}
                <div className="">
                    <Link href="/" className="flex items-center gap-2">
                        <ApplicationLogo className="size-14 lg:size-16 dark:invert" />
                        <h1 className="text-xl font-medium clash-display">
                            TidyUp
                        </h1>
                    </Link>
                </div>

                {/* Desktop Navigation Links - Centered */}
                <div className="hidden md:flex flex-1 justify-center items-center space-x-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "relative text-sm transition-all duration-300 hover:text-primary",
                                url === link.href
                                    ? "text-primary scale-[1.2] hover:scale-[1.3]" // Active link style
                                    : "text-muted-foreground hover:scale-[1.2]" // Inactive link style
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {user ? (
                    // Logged-in user actions
                    <div className="flex items-center gap-2">
                        {/* Search Component */}
                        <SearchShop />
                        {/* Notification Component */}
                        <Notification />
                        {/* User Profile Dropdown */}
                        <div className="hidden sm:block">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        {/* Display user profile photo or fallback initials */}
                                        {user.profile_photo_path ? (
                                            <AvatarImage
                                                src={`/storage/${user.profile_photo_path}`}
                                            />
                                        ) : user.first_name ? (
                                            <AvatarFallback>
                                                {user.first_name[0] + user.last_name[0]}
                                            </AvatarFallback>
                                        ) : (
                                            <AvatarFallback className="uppercase">
                                                {user.username[0] + user.username[1]}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 mr-7">
                                    {/* Dropdown Header with User Info */}
                                    <DropdownMenuLabel className="flex gap-4 items-center py-3.5">
                                        <Avatar>
                                            {user.profile_photo_path ? (
                                                <AvatarImage
                                                    src={`/storage/${user.profile_photo_path}`}
                                                />
                                            ) : user.first_name ? (
                                                <AvatarFallback>
                                                    {user.first_name[0] +
                                                        user.last_name[0]}
                                                </AvatarFallback>
                                            ) : (
                                                <AvatarFallback className="uppercase">
                                                    {user.username[0] +
                                                        user.username[1]}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div>
                                            <h6>
                                                {/* Display user's full name */}
                                                {user.first_name +
                                                    (user.middle_name ? ` ${user.middle_name[0]}. ` : " ") +
                                                    " " +
                                                    user.last_name}
                                            </h6>
                                            <p className="font-normal">
                                                @{user.username} {/* Display username */}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {/* Dropdown Menu Items */}
                                    <DropdownMenuGroup>
                                        <Link href="/profile">
                                            <DropdownMenuItem>Profile</DropdownMenuItem>
                                        </Link>
                                        {/* Role-specific dashboard/management links */}
                                        {role.role_id === 3 ? ( // Shop Owner
                                            <Link href={route("shop.dashboard")}>
                                                <DropdownMenuItem>
                                                    Manage Shop
                                                </DropdownMenuItem>
                                            </Link>
                                        ) : role.role_id === 4 ? ( // Shop Staff
                                            <Link href={route("shop.appointments")}>
                                                <DropdownMenuItem>
                                                    Manage Appointments
                                                </DropdownMenuItem>
                                            </Link>
                                        ) : role.role_id === 1 ? ( // Admin
                                            <Link href={route("admin.shops")}>
                                                <DropdownMenuItem>
                                                    Admin Dashboard
                                                </DropdownMenuItem>
                                            </Link>
                                        ) : ( // Regular User without shop
                                            <Link href={`/shop/setup`}>
                                                <DropdownMenuItem>
                                                    Setup Your Shop
                                                </DropdownMenuItem>
                                            </Link>
                                        )}
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    {/* Theme Toggle */}
                                    <DropdownMenuItem onClick={onClick}>
                                        Set Theme to{" "}
                                        {isDarkTheme ? "Light Mode" : "Dark Mode"}
                                    </DropdownMenuItem>
                                    {/* Settings Link */}
                                    <Link href="/profile">
                                        <DropdownMenuItem >
                                            Settings
                                        </DropdownMenuItem>
                                    </Link>
                                    {/* Send Feedback Link */}
                                    <Link href="/send-feedback">
                                        <DropdownMenuItem >
                                            Send Feedback
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    {/* Logout Button */}
                                    <Link
                                        method="post"
                                        href={route("logout")}
                                        as="button"
                                        className="w-full"
                                    >
                                        <DropdownMenuItem className="text-red-500">
                                            Log out
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="sm:hidden">
                            <MobileMenu>
                                <Avatar className="cursor-pointer">
                                    {/* Display user profile photo or fallback initials */}
                                    {user.profile_photo_path ? (
                                        <AvatarImage
                                            src={`/storage/${user.profile_photo_path}`}
                                        />
                                    ) : user.first_name ? (
                                        <AvatarFallback>
                                            {user.first_name[0] + user.last_name[0]}
                                        </AvatarFallback>
                                    ) : (
                                        <AvatarFallback className="uppercase">
                                            {user.username[0] + user.username[1]}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </MobileMenu>
                        </div>
                    </div>
                ) : (
                    // Logged-out user actions (Guest)
                    <>
                        {/* Mobile Menu Trigger (visible on smaller screens) */}
                        <div className="flex items-center gap-1.5">
                            {/* Search Component */}
                            <div className="lg:mr-1.5">
                                <SearchShop />
                            </div>
                            <div className="block md:hidden">
                                <MobileMenu>
                                    <Button variant="outline">
                                        <Menu size={30} />
                                    </Button>
                                </MobileMenu>
                            </div>
                        </div>
                        {/* Desktop Auth Buttons (visible on larger screens) */}
                        <div className="lg:flex items-center gap-2 hidden">
                            {/* Theme Toggle Button for guests */}
                            {!user && (
                                <ThemeButton
                                    onClick={onClick}
                                    isDarkTheme={isDarkTheme}
                                />
                            )}
                            {/* Sign Up Button */}
                            <Button asChild variant="outline">
                                <Link href="/register" >
                                    Sign Up
                                </Link>
                            </Button>
                            {/* Sign In Button */}
                            <Button asChild>
                                <Link href="/login">Sign In</Link>
                            </Button>
                        </div>
                    </>
                )
                }
            </div>
        </header >
    );
};

export default Header;
