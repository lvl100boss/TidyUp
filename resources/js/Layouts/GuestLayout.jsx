import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

export default function GuestLayout({ children }) {
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
    return (
        <div className="flex min-h-screen flex-col items-center  pt-6 sm:justify-center sm:pt-0 ">
            <div>
                <Link href="/">
                    <ApplicationLogo className="size-36 dark:invert" />
                </Link>
            </div>
            <div>
                <h4 className="text-center text-4xl">TidyUp!</h4>
                <p className="text-center text-sm text-muted-foreground">
                    We're glad to have you here.
                </p>
            </div>
            <div className="mt-5 w-full overflow-hidden sm:max-w-md sm:rounded-lg ">
                {children}
            </div>
        </div>
    );
}
