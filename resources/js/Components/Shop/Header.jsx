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
import { cn } from "@/lib/utils";

const Header = ({ onClick, isDarkTheme, setIsDarkTheme }) => {
    const user = usePage().props.auth.user;
    const role = usePage().props.auth.userRole || {};
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={` mb-3 fixed top-0 left-0 right-0 z-50 px-5 py-3 bg-background/50 backdrop-blur-2xl border-dashed  ${isScrolled ? "border-b" : ""
                }`}
        >
            <div className="flex justify-between items-center px-2">
                <div className="">
                    <Link href="/" className="flex items-center gap-2">
                        <ApplicationLogo className="size-14 lg:size-16 dark:invert" />
                        <h1 className="text-xl font-medium clash-display">
                            TidyUp
                        </h1>
                    </Link>
                </div>

                {user ? (
                    <div className="flex items-center gap-2">
                        {/* Notification Button */}
                        <Notification />




                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer">
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
                                            {user.first_name +
                                                (user.middle_name ? ` ${user.middle_name[0]}. ` : " ") +
                                                " " +
                                                user.last_name}
                                        </h6>
                                        <p className="font-normal">
                                            @{user.username}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <Link href="/profile">
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                                <DropdownMenuItem onClick={onClick}>
                                    Set Theme to{" "}
                                    {isDarkTheme ? "Light Mode" : "Dark Mode"}
                                </DropdownMenuItem>
                                <Link href="/profile">
                                    <DropdownMenuItem >
                                        Settings
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/send-feedback">
                                    <DropdownMenuItem >
                                        Send Feedback
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuSeparator />
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
                ) : (
                    <>
                        <div className="lg:hidden">
                            <DropdownMenu className="min-w-full">
                                <DropdownMenuTrigger>
                                    <Button variant="outline">
                                        <Menu size={30} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="mr-7 " inset>
                                    <Link href="/login">
                                        <DropdownMenuItem>Sign In</DropdownMenuItem>
                                    </Link>
                                    <Link href="/register">
                                        <DropdownMenuItem>Sign Up</DropdownMenuItem>
                                    </Link>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="lg:flex items-center gap-2 hidden">
                            {!user && (
                                <ThemeButton
                                    onClick={onClick}
                                    isDarkTheme={isDarkTheme}
                                />
                            )}
                            <Button asChild variant="outline">
                                <Link href="/register" >
                                    Sign Up
                                </Link>
                            </Button>
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
