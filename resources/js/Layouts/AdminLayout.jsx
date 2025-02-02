import React, { useEffect, useState } from "react";
import Header from "@/Components/Admin/Header";
export default function AdminLayout({ children }) {
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
            <main>{children}</main>
        </div>
    );
}
