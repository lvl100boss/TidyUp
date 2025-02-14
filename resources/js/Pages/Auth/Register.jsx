import InputError from "@/Components/InputError";
import { Input, PInput } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import ApplicationLogo from "@/Components/ApplicationLogo";
import React, { useEffect, useState } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

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
        <div className="flex min-h-screen flex-col items-center  pt-6 sm:justify-center sm:pt-0  px-5">
            <Head title="Register" />
            <Link href="/">
                <ApplicationLogo className="size-28 md:size-32 dark:invert" />
            </Link>
            <div className="my-2 space-y-4">
                <h4 className="text-center text-4xl figtree-medium">
                    Join us today
                </h4>
                <p className="text-sm text-muted-foreground">
                    Enter your Email and Password to register
                </p>
            </div>

            <form
                onSubmit={submit}
                className="w-full max-w-screen-sm sm:max-w-md md:px-6 md:py-4 rounded-lg"
            >
                <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                        id="first_name"
                        type="text"
                        name="first_name"
                        placeholder="Enter your first name"
                        value={data.first_name}
                        autoComplete="given-name"
                        isFocused={true}
                        onChange={(e) => setData("first_name", e.target.value)}
                    />
                    <InputError message={errors.first_name} className="mt-2" />
                </div>
                <div className="mt-4">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                        id="last_name"
                        type="text"
                        name="last_name"
                        placeholder="Enter your last name"
                        value={data.last_name}
                        autoComplete="family-name"
                        onChange={(e) => setData("last_name", e.target.value)}
                    />
                    <InputError message={errors.last_name} className="mt-2" />
                </div>
                <div className="mt-4">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="username"
                        name="username"
                        placeholder="Enter your username"
                        value={data.username}
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("username", e.target.value)}
                    />
                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div className="mt-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={data.email}
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <Label htmlFor="password">Password</Label>

                    <PInput
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your new password"
                        value={data.password}
                        autoComplete="current-password"
                        className=""
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <Label htmlFor="password_confirmation">
                        Confirm Password
                    </Label>
                    <PInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        placeholder="Confirm your password"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-8 w-full">
                    <Button className=" w-full" disabled={processing}>
                        Register
                    </Button>
                </div>
                <div className="mt-8 flex items-center justify-center text-sm gap-1">
                    <span className="">Already have an Account? </span>
                    <Link
                        href={route("login")}
                        className="figtree-medium hover:figtree-semibold underline"
                    >
                        Sign In
                    </Link>
                </div>
            </form>
        </div>
    );
}
