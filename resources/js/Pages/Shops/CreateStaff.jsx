import ShopsLayout from "@/Layouts/ShopsLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Input, PInput } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import { Info } from "lucide-react";
import { useState, useEffect } from "react";

export default function CreateStaff() {
    const { data, setData, post, processing, errors, reset } = useForm({
        role: "",
        position: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [passwordStrength, setPasswordStrength] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const checkPasswordStrength = (password) => {
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8;

        const conditions = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough];
        const metConditions = conditions.filter(Boolean).length;

        if (password.length === 0) return "";
        if (metConditions === 5) return "strong";
        if (metConditions >= 4) return "good";
        if (metConditions >= 3) return "moderate";
        return "weak";
    };

    const getStrengthColor = (strength) => {
        switch (strength) {
            case "strong": return "bg-green-500";
            case "good": return "bg-blue-500";
            case "moderate": return "bg-yellow-500";
            case "weak": return "bg-red-500";
            default: return "bg-gray-200";
        }
    };

    useEffect(() => {
        setPasswordStrength(checkPasswordStrength(data.password));
        setPasswordsMatch(
            data.password !== "" &&
            data.password_confirmation !== "" &&
            data.password === data.password_confirmation
        );
    }, [data.password, data.password_confirmation]);

    function handleSubmit(e) {
        e.preventDefault();
        post(route("shop.manage.staff.store"));
    }


    return (
        <ShopsLayout>
            <Head title="Create Staff Account" />
            <h1 className="text-2xl font-bold">Create Staff Account</h1>
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2">
                    {/* First Name Field */}
                    <div>
                        <Label htmlFor="first_name" className="font-bold">First Name</Label>
                        <Input
                            id="first_name"
                            value={data.first_name}
                            onChange={(e) => setData("first_name", e.target.value)}
                            placeholder="First Name"
                        />
                        <InputError message={errors.first_name} />
                    </div>
                    {/* Last Name Field */}
                    <div>
                        <Label htmlFor="last_name" className="font-bold">Last Name</Label>
                        <Input
                            id="last_name"
                            value={data.last_name}
                            onChange={(e) => setData("last_name", e.target.value)}
                            placeholder="Last Name"
                        />
                        <InputError message={errors.last_name} />
                    </div>
                    {/* Position Field */}
                    <div>
                        <Label htmlFor="position" className="font-bold">Position</Label>

                        <Select onValueChange={(value) => setData('position', value)}>
                            <SelectTrigger id="position">
                                <SelectValue placeholder="Select Position" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.position} />
                    </div>
                    {/* Role Field */}
                    <div>
                        <Label htmlFor="role" className="font-bold">Role</Label>
                        <Input
                            id="role"
                            value={data.role}
                            onChange={(e) => setData("role", e.target.value)}
                            placeholder="ex. Head Stylist, Barber, etc."
                        />
                        <InputError message={errors.role} />
                    </div>

                    {/* Date of Birth Field */}
                    <div>
                        <Label htmlFor="date_of_birth" className="font-bold">Date of Birth</Label>
                        <Input
                            id="date_of_birth"
                            type="date"
                            value={data.date_of_birth}
                            onChange={(e) => setData("date_of_birth", e.target.value)}
                        />
                        <InputError message={errors.date_of_birth} />
                    </div>
                    {/* Gender Field */}
                    <div>
                        <Label htmlFor="gender" className="font-bold">Gender</Label>
                        <Select onValueChange={(value) => setData('gender', value)}>
                            <SelectTrigger id="gender">
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.gender} />
                    </div>
                    {/* Email Field */}
                    <div>
                        <Label htmlFor="email" className="font-bold">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="Email"
                        />
                        <InputError message={errors.email} />
                    </div>
                    {/* Username Field */}
                    <div>
                        <Label htmlFor="username" className="font-bold">Username</Label>
                        <Input
                            id="username"
                            value={data.username}
                            onChange={(e) => setData("username", e.target.value)}
                            placeholder="Username"
                        />
                        <InputError message={errors.username} />
                    </div>
                    {/* Password Field */}
                    <div>
                        <div>
                            <div className="inline-flex items-center gap-2">
                                <Label htmlFor="password" className="font-bold">Password</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Info className="size-4 cursor-pointer" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <ul>
                                                <li><span>&#8226;</span> Password must contain lowercase and uppercase characters</li>
                                                <li><span>&#8226;</span> Password must contain at least one number</li>
                                                <li><span>&#8226;</span> Password must contain at least one special character</li>
                                                <li><span>&#8226;</span> Password must be at least 8 characters long</li>
                                            </ul>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <p></p>
                        </div>
                        <PInput
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => {
                                setData("password", e.target.value);
                            }}
                            placeholder="Password"
                        />
                        {passwordStrength && (
                            <div className="mt-2">
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-24 rounded ${getStrengthColor(passwordStrength)}`}></div>
                                    <span className="text-sm capitalize">{passwordStrength} password</span>
                                </div>
                            </div>
                        )}
                        <InputError message={errors.password} />
                    </div>
                    {/* Password Confirmation Field */}
                    <div>
                        <Label htmlFor="password_confirmation" className="font-bold">Confirm Password</Label>
                        <PInput
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            placeholder="Confirm Password"
                        />
                        {data.password_confirmation && (
                            <div className="mt-2">
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-24 rounded ${passwordsMatch ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                    </span>
                                </div>
                            </div>
                        )}
                        <InputError message={errors.password_confirmation} />
                    </div>
                </div>
                <div className="mt-6">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="font-bold"
                    >
                        Create Staff Account
                    </Button>
                </div>
            </form>
        </ShopsLayout>
    );
}