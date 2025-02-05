import Header from "@/Components/User/Header";
import ThemeButton from "@/Components/ThemeButton";
import Sidebar from "@/Components/User/Sidebar";
import Footer from "@/Components/User/Footer";
import MobileNavButton from "@/Components/MobileNavButton";
import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

export default function UserLayout({ children }) {
    const user = usePage().props.auth.user;
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
        <div className="py-2 px-5 relative min-h-screen">
            <Header onClick={toggleTheme} isDarkTheme={isDarkTheme} />
            <div className="flex gap-5">
                <Sidebar />
                <main className="flex-1">{children}</main>
            </div>
            <div>
                <Footer />
            </div>
            <div>
                {!user && (
                    <ThemeButton
                        onClick={toggleTheme}
                        isDarkTheme={isDarkTheme}
                    />
                )}
                <MobileNavButton />
            </div>
        </div>
    );
}
