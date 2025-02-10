import React, { useEffect, useState } from "react";
import Header from "@/Components/Admin/Header";
import Sidebar from "@/Components/Admin/sidebar";

export default function AdminLayout({ children }) {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    useEffect(() => {
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
            {/* Header */}
            <Header onClick={toggleTheme} isDarkTheme={isDarkTheme} />

            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 py-2 px-5 relative min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}
