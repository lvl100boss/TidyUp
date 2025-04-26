import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import UserLayout from "@/Layouts/UserLayout";

export default function Edit({ mustVerifyEmail, status }) {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    useEffect(() => {
        // Retrieve the theme preference from local storage
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark");
            setIsDarkTheme(true);
        }
    }, []);
    const toggleDarkMode = () => {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
        setIsDarkTheme(!isDarkTheme);
    }
    const toggleLightMode = () => {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
        setIsDarkTheme(!isDarkTheme);
    }
    return (
        <UserLayout>
            <Head title="Profile" />
            <div className="w-full">
                <div className=" max-w-2xl space-y-6 mx-auto pt-5 pb-20">
                    <div>
                        <header>
                            <h2 className="text-lg font-medium ">Appearance</h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                You can change the appearance of the app
                                here.
                            </p>
                        </header>
                        <div className="mt-2 flex gap-2">
                            {/* Light Mode */}
                            <div
                                className={`p-2 border rounded-lg w-fit transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer`
                                    + (!isDarkTheme ? " border-muted-foreground/50" : "")
                                }
                                onClick={toggleLightMode}
                            >

                                <div className="aspect-video h-20 overflow-hidden rounded-lg">
                                    <img className="size-full object-cover" src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80" />
                                </div>
                                <div className="mt-2">
                                    <p className="text-xs font-bold">Light Mode</p>
                                </div>
                            </div>
                            {/* Dark Mode */}
                            <div
                                className={`p-2 border rounded-lg w-fit  transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer`
                                    + (isDarkTheme ? " border-muted-foreground/50" : " ")
                                }
                                onClick={toggleDarkMode}
                            >
                                <div className="aspect-video h-20 overflow-hidden rounded-lg ">
                                    <img className="size-full object-cover invert " src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80" />
                                </div>
                                <div className="mt-2">
                                    <p className="text-xs font-bold">Dark Mode</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div >
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}

                        />
                    </div>
                    <div >
                        <UpdatePasswordForm />
                    </div>
                    <div >
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
