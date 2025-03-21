import InputError from "@/Components/InputError";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Progress } from "@/Components/ui/progress";
import { Checkbox } from "@/Components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        middle_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        has_middle_name: false,
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
                setPasswordStrengthColor("-green-500");
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

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
            preserveScroll: true
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0 px-5">
            <Head title="Register" />
            <Link href="/">
                <ApplicationLogo className="size-28 md:size-32 dark:invert" />
            </Link>
            <div className="my-2 space-y-4">
                <h4 className="text-center text-4xl font-medium">
                    Join us today
                </h4>
                <p className="text-sm text-muted-foreground text-center">
                    Enter your Email and Password to register
                </p>
            </div>

            <form
                onSubmit={submit}
                className="w-full max-w-screen-sm sm:max-w-md md:px-6 md:py-4 rounded-lg space-y-4"
            >
                <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                        id="first_name"
                        type="text"
                        name="first_name"
                        placeholder="Enter your first name"
                        value={data.first_name}
                        autoComplete="given-name"
                        onChange={(e) => setData("first_name", e.target.value)}
                        className="w-full"
                    />
                    <InputError message={errors.first_name} className="mt-2" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="middle_name">Middle Name</Label>
                    <Input
                        id="middle_name"
                        type="text"
                        name="middle_name"
                        placeholder="Enter your middle name"
                        value={data.middle_name}
                        autoComplete="given-name"
                        disabled={data.has_middle_name}
                        className={data.has_middle_name ? "bg-muted text-muted-foreground" : ""}
                        onChange={(e) => setData("middle_name", e.target.value)}
                    />
                    <InputError message={errors.middle_name} className="mt-2" />
                    <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                            id="has_middle_name"
                            checked={data.has_middle_name}
                            onCheckedChange={(checked) => {
                                setData("has_middle_name", checked);
                                if (checked) {
                                    setData("middle_name", "");
                                }
                            }}
                        />
                        <Label 
                            htmlFor="has_middle_name" 
                            className="text-sm font-normal cursor-pointer"
                        >
                            I don't have a middle name
                        </Label>
                    </div>
                </div>
                <div className="space-y-2">
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
                <div className="space-y-2">
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

                <div className="space-y-2">
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
                    <div className="flex items-end justify-between">
                        <Label htmlFor="password">Password</Label>
                        <p className={`text-sm text${passwordStrengthColor}`}>
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
                            className="pr-10"
                            onChange={(e) => setData("password", e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                        </button>
                    </div>
                    <Progress value={passwordStrength} className="h-1" />
                    <div className="text-sm text-muted-foreground mt-2">
                        Password must contain:
                        <ul className="list-disc list-inside space-y-1 mt-1">
                            <li className={data.password.length >= 8 ? "text-green-500" : ""}>
                                At least 8 characters
                            </li>
                            <li className={/[A-Z]/.test(data.password) && /[a-z]/.test(data.password) ? "text-green-500" : ""}>
                                Both uppercase and lowercase letters
                            </li>
                            <li className={/[!@#$%^&*(),.?":{}|<>_\-+=[\]/\\]/.test(data.password) ? "text-green-500" : ""}>
                                At least one special character
                            </li>
                            <li className={/\d/.test(data.password) ? "text-green-500" : ""}>
                                At least one number
                            </li>
                        </ul>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-end justify-between">
                        <Label htmlFor="password_confirmation">
                            Confirm Password
                        </Label>
                        <p
                            className={`text-sm ${passwordsMatch && data.password_confirmation
                                ? "text-green-500"
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
                            className="pr-10"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
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
                
                <div className="mt-4 flex items-center justify-center text-sm gap-1">
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
