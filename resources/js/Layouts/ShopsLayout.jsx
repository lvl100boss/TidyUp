import React, { useEffect, useState } from "react";
import Header from "@/Components/Shop/Header";
import Sidebar from "@/Components/Shop/Sidebar";
import { Toaster } from 'sonner';

export default function ShopsLayout({ children }) {
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
            <div className="flex gap-5 mt-[4.5rem]">
                <Sidebar />
                <main className="flex-1">{children}</main>
                <Toaster richColors />
            </div>
        </div>
    );
}
