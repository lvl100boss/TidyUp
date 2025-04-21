import InputError from "@/Components/InputError";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Progress } from "@/Components/ui/progress";
import { Checkbox } from "@/Components/ui/checkbox";
import { Eye, EyeOff, Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card } from "@/Components/ui/card";
export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordStrengthString, setPasswordStrengthString] = useState("");
    const [passwordStrengthColor, setPasswordStrengthColor] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    useEffect(() => {
        if (!data.password_confirmation) {
            setPasswordsMatch(false);
        } else if (data.password === data.password_confirmation) {
            setPasswordsMatch(true);
        } else {
            setPasswordsMatch(false);
        }
    }, [data.password, data.password_confirmation]);

    useEffect(() => {
        switch (passwordStrength) {
            case 0:
                setPasswordStrengthString("");
                setPasswordStrengthColor("");
                break;
            case 25:
                setPasswordStrengthString("Weak password");
                setPasswordStrengthColor("-red-500");
                break;
            case 50:
                setPasswordStrengthString("Moderate password");
                setPasswordStrengthColor("-orange-500");
                break;
            case 75:
                setPasswordStrengthString("Good password");
                setPasswordStrengthColor("-blue-500");
                break;
            case 100:
                setPasswordStrengthString("Strong password");
                setPasswordStrengthColor("-emerald-500");
                break;
            default:
                setPasswordStrengthString("");
        }
    }, [passwordStrength]);

    useEffect(() => {
        let strength = 0;
        // Length check (at least 8 characters)
        if (data.password.length >= 8) {
            strength += 25;
        }
        // Uppercase and lowercase check
        if (/[A-Z]/.test(data.password) && /[a-z]/.test(data.password)) {
            strength += 25;
        }
        // Special characters check (more comprehensive list)
        if (/[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\]/.test(data.password)) {
            strength += 25;
        }
        // Numbers check
        if (/\d/.test(data.password)) {
            strength += 25;
        }
        setPasswordStrength(strength);
    }, [data.password]);

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

    const submit = (e) => {
        e.preventDefault();

        post(route("register.save"), {
            onFinish: () => reset("password", "password_confirmation")
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center pt-5 sm:pt-16 sm:justify-center px-6 md:px-8">
            <Head title="Register" />
            <Link href="/">
                <ApplicationLogo className="size-28 md:size-32" />
            </Link>
            <div className="mt-4 space-y-4">
                <h4 className="text-center text-4xl font-medium">
                    Join us today
                </h4>
                <p className="text-sm text-muted-foreground text-center">
                    Enter your Email and Password to register
                </p>
            </div>

            <form
                onSubmit={submit}
                className="w-full max-w-screen-sm sm:max-w-md md:px-8 md:py-6 rounded-lg space-y-5 mx-auto"
            >
                <div className="">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={data.username}
                        autoComplete="username"
                        onChange={(e) => setData("username", e.target.value)}
                    />
                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div className="">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={data.email}
                        autoComplete="email"
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-end justify-between relative">
                        <Label htmlFor="password">Password</Label>
                        <p className={`text-xs absolute right-0 text${passwordStrengthColor}`}>
                            {passwordStrengthString}
                        </p>
                    </div>

                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your new password"
                            value={data.password}
                            autoComplete="new-password"
                            className="pr-12 py-2" // Added more right padding and vertical padding
                            onChange={(e) => setData("password", e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center px-3" // Changed from pr-3 to px-3 for better spacing
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                        </button>
                    </div>
                    <div className="pt-2">
                        <Card className="p-4 bg-muted/20">
                            Password must contain:
                            <ul className="text-muted-foreground mt-2 space-y-1">
                                <li className={data.password.length >= 8 ? "text-emerald-500" : ""}>
                                    {
                                        data.password.length >= 8
                                            ? <span className="mr-2"><Check className="h-4 w-4 text-emerald-500 inline" /></span>
                                            : <span className="mr-2">•</span>
                                    }
                                    At least 8 characters
                                </li>
                                <li className={/[A-Z]/.test(data.password) && /[a-z]/.test(data.password) ? "text-emerald-500" : ""}>
                                    {
                                        /[A-Z]/.test(data.password) && /[a-z]/.test(data.password)
                                            ? <span className="mr-2"><Check className="h-4 w-4 text-emerald-500 inline" /></span>
                                            : <span className="mr-2">•</span>
                                    }
                                    Both uppercase and lowercase letters
                                </li>
                                <li className={/[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\]/.test(data.password) ? "text-emerald-500" : ""}>
                                    {
                                        /[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\]/.test(data.password)
                                            ? <span className="mr-2"><Check className="h-4 w-4 text-emerald-500 inline" /></span>
                                            : <span className="mr-2">•</span>
                                    }
                                    At least one special character
                                </li>
                                <li className={/\d/.test(data.password) ? "text-emerald-500 " : ""}>
                                    {
                                        /\d/.test(data.password)
                                            ? <span className="mr-2"><Check className="h-4 w-4 text-emerald-500 inline" /></span>
                                            : <span className="mr-2">•</span>
                                    }
                                    At least one number
                                </li>
                            </ul>
                        </Card>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-end justify-between relative">
                        <Label htmlFor="password_confirmation">
                            Confirm Password
                        </Label>
                        <p
                            className={`text-xs absolute right-0 ${passwordsMatch && data.password_confirmation
                                ? "text-emerald-500"
                                : data.password_confirmation ? "text-red-500" : ""
                                }`}
                        >
                            {data.password_confirmation === ""
                                ? ""
                                : passwordsMatch
                                    ? "Password Matches"
                                    : "Password does not match"}
                        </p>
                    </div>
                    <div className="relative">
                        <Input
                            id="password_confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            name="password_confirmation"
                            placeholder="Confirm your password"
                            value={data.password_confirmation}
                            autoComplete="new-password"
                            className="pr-12 py-2"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center px-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                        </button>
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full mt-8"
                    disabled={processing}
                >
                    Register
                </Button>

                <div className="mt-6 flex items-center justify-center text-sm gap-1">
                    <span className="text-muted-foreground">Already have an Account? </span>
                    <Link
                        href={route("login")}
                        className="font-medium hover:underline text-primary"
                    >
                        Sign In
                    </Link>
                </div>
            </form>
        </div>
    );
}
