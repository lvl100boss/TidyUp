import UserSettingsLayout from "@/Layouts/UserSettingsLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from 'react';

export default function Theme() {
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
        <UserSettingsLayout>
            <Head title="Theme" />
            <div className="min-h-screen">
                <h1>Theme</h1>
                <div className="flex items-center space-x-4">
                    <label htmlFor="toggle" className="text-gray-700 dark:text-gray-300">
                        {isDarkTheme ? 'Dark Mode' : 'Light Mode'}
                    </label>
                    <button
                        onClick={toggleTheme}
                        className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-pressed={isDarkTheme}
                    >
                        <span className="sr-only">Toggle dark mode</span>
                        <span
                            className={`${isDarkTheme ? 'translate-x-6 bg-gray-200' : 'translate-x-1 bg-indigo-600'
                                } relative inline-block w-4 h-4 bg-white rounded-full transition-transform`}
                        >
                            <span className="sr-only"></span>
                        </span>
                    </button>
                </div>
            </div>
        </UserSettingsLayout>
    );
}