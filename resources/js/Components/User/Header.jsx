import { useEffect, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Notification } from "./Notification";
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
import { Bell, Menu } from "lucide-react";
import ThemeButton from "@/Components/ThemeButton";


const Header = ({ onClick, isDarkTheme, setIsDarkTheme }) => {
    const user = usePage().props.auth.user;
    const isLogged = user ? true : false;
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
            className={`flex justify-between items-center mb-3 fixed top-0 left-0 right-0 z-50 px-5 py-3 bg-background/90 backdrop-blur border-dashed ${isScrolled ? "border-b" : ""
                }`}
        >
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
                    <div>
                        {isLogged && (
                            `Welcome, ${user.first_name}`
                        )}

                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button
                                variant="outline"
                                radius="round"
                                size="icon"
                            >
                                <Bell className="stroke-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mr-16 p-0 border-0">
                            <Notification />
                        </DropdownMenuContent>
                    </DropdownMenu>

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
                                        {user.first_name
                                            ? `${user.first_name} ${user.last_name}`
                                            : user.username}
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
                                {role.role_id === 3 ? (
                                    <Link href={route("shop.dashboard")}>
                                        <DropdownMenuItem>
                                            Manage Shop
                                        </DropdownMenuItem>
                                    </Link>
                                ) : (
                                    <Link href={`/shop/setup`}>
                                        <DropdownMenuItem>
                                            Setup Your Shop
                                        </DropdownMenuItem>
                                    </Link>
                                )}
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onClick}>
                                Set Theme to{" "}
                                {isDarkTheme ? "Light Mode" : "Dark Mode"}
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                Support
                            </DropdownMenuItem>
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
        </header >
    );
};

export default Header;
