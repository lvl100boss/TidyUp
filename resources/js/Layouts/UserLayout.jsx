import Header from "@/Components/User/Header";
import ThemeButton from "@/Components/ThemeButton";
import Sidebar from "@/Components/User/Sidebar";
import Footer from "@/Components/User/Footer";
import MobileNavButton from "@/Components/MobileNavButton";
import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import GradientBackground from "@/Components/GradientBackground";

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
        <>
            <div className="py-2 px-5 relative min-h-screen">
                <GradientBackground />
                <Header
                    onClick={toggleTheme}
                    isDarkTheme={isDarkTheme}
                    setIsDarkTheme={setIsDarkTheme}
                />
                <div className="flex gap-5 mt-[4.5rem]">
                    {/* <Sidebar /> */}
                    <main className="flex-1 max-w-screen-2xl mx-auto px-2">
                        {children}
                    </main>
                </div>

                <div>
                    <MobileNavButton />
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
    );
}
