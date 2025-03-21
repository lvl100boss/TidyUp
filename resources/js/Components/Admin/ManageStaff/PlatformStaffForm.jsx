import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input, PInput } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import { Info } from "lucide-react";
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
import { useState, useEffect } from "react";

function StaffForm(props) {
    const [passwordStrength, setPasswordStrength] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

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
        setPasswordStrength(checkPasswordStrength(props.data.password));
        setPasswordsMatch(
            props.data.password !== "" &&
            props.data.password_confirmation !== "" &&
            props.data.password === props.data.password_confirmation
        );
    }, [props.data.password, props.data.password_confirmation]);

    // Handle file change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Update form data
            props.setData(prevData => ({
                ...prevData,
                profile_photo_path: file
            }));
        }
    };

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <form onSubmit={props.handleSubmit} className="border border-border p-8 rounded-md mt-6 mb-10 shadow-md">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b">
                {props.create ? "Create New Staff Account" : "Edit Staff Account"}
            </h2>

            {/* Profile Photo Section */}
            <div className="border p-5 pb-7 shadow  rounded-md mb-8">
                <h3 className="text-md font-medium mb-4">Profile Picture</h3>
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="flex-shrink-0">
                        {props.staff?.profile_photo_path && !previewUrl && (
                            <Avatar className="w-28 h-28 border-2 border-muted">
                                <AvatarImage
                                    src={`/storage/${props.staff.profile_photo_path}`}
                                />
                            </Avatar>
                        )}
                        {previewUrl && (
                            <Avatar className="w-28 h-28 border-2 border-muted">
                                <AvatarImage src={previewUrl} />
                            </Avatar>
                        )}
                        {(!props.staff?.profile_photo_path && !previewUrl) && (
                            <Avatar className="w-28 h-28 border-2 border-muted">
                                <AvatarFallback className="bg-background">
                                    Profile
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>

                    <div className="w-full">
                        <Label htmlFor="profile_photo_path" className="font-bold block mb-2">Upload Photo</Label>
                        <Input
                            id="profile_photo_path"
                            type="file"
                            onChange={handleFileChange}
                            className="pt-2"
                        />
                        <p className="text-gray-500 text-sm mt-1">Recommended size: 300x300px (Square)</p>
                        <InputError message={props.errors.profile_photo_path} />
                    </div>
                </div>
            </div>

            {/* Personal Information Section */}
            <div className="mb-8">
                <h3 className="text-md font-medium mb-4 pb-1 border-b">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <Label htmlFor="first_name" className="font-bold">First Name</Label>
                        <Input
                            id="first_name"
                            value={props.data.first_name}
                            onChange={e => props.setData(prevData => ({
                                ...prevData,
                                first_name: e.target.value
                            }))}
                            placeholder="First Name"
                            className="mt-1"
                        />
                        <InputError message={props.errors.first_name} />
                    </div>
                    <div>
                        <Label htmlFor="last_name" className="font-bold">Last Name</Label>
                        <Input
                            id="last_name"
                            value={props.data.last_name}
                            onChange={e => props.setData(prevData => ({
                                ...prevData,
                                last_name: e.target.value
                            }))}
                            placeholder="Last Name"
                            className="mt-1"
                        />
                        <InputError message={props.errors.last_name} />
                    </div>
                    <div>
                        <Label htmlFor="date_of_birth" className="font-bold">Date of Birth</Label>
                        <Input
                            id="date_of_birth"
                            type="date"
                            value={props.data.date_of_birth}
                            onChange={e => props.setData(prevData => ({
                                ...prevData,
                                date_of_birth: e.target.value
                            }))}
                            className="mt-1"
                        />
                        <InputError message={props.errors.date_of_birth} />
                    </div>
                    <div>
                        <Label htmlFor="gender" className="font-bold">Gender</Label>
                        <Select
                            value={props.data.gender}
                            onValueChange={value => props.setData(prevData => ({
                                ...prevData,
                                gender: value
                            }))}
                        >
                            <SelectTrigger id="gender" className="mt-1">
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={props.errors.gender} />
                    </div>
                    <div>
                        <Label htmlFor="contact_number" className="font-bold">Contact Number</Label>
                        <Input
                            id="contact_number"
                            value={props.data.contact_number}
                            onChange={e => props.setData(prevData => ({
                                ...prevData,
                                contact_number: e.target.value
                            }))}
                            placeholder="Contact Number"
                            className="mt-1"
                        />
                        <InputError message={props.errors.contact_number} />
                    </div>
                </div>
            </div>

            {/* Job Information Section */}
            <div className="mb-8">
                <h3 className="text-md font-medium mb-4 pb-1 border-b">Job Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <Label htmlFor="position" className="font-bold">Position</Label>
                        <Input
                            id="position"
                            value={props.data.role}
                            onChange={e => props.setData(prevData => ({
                                ...prevData,
                                role: e.target.value
                            }))}
                            placeholder="ex. Project Manager, UI/UX Designer, etc."
                            className="mt-1"
                        />
                        <InputError message={props.errors.role} />
                    </div>
                    <div>
                        <Label htmlFor="is_active" className="font-bold">Status</Label>
                        <Select
                            value={`${props.data.is_active}`}
                            onValueChange={value => props.setData(prevData => ({
                                ...prevData,
                                is_active: value
                            }))}
                        >
                            <SelectTrigger id="is_active" className="mt-1">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"1"}>Active</SelectItem>
                                <SelectItem value={"0"}>Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={props.errors.is_active} />
                    </div>
                </div>
            </div>

            {/* Account Information Section */}
            <div className="mb-8">
                <h3 className="text-md font-medium mb-4 pb-1 border-b">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <Label htmlFor="email" className="font-bold">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={props.data.email}
                            onChange={e => props.setData(prevData => ({
                                ...prevData,
                                email: e.target.value
                            }))}
                            placeholder="Email"
                            className="mt-1"
                        />
                        <InputError message={props.errors.email} />
                    </div>
                    <div>
                        <Label htmlFor="username" className="font-bold">Username</Label>
                        <Input
                            id="username"
                            value={props.data.username}
                            onChange={e => props.setData(prevData => ({
                                ...prevData,
                                username: e.target.value
                            }))}
                            placeholder="Username"
                            className="mt-1"
                        />
                        <InputError message={props.errors.username} />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-2 mb-1">
                            <Label htmlFor="password" className="font-bold">Password</Label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="size-4 cursor-pointer text-gray-500" />
                                    </TooltipTrigger>
                                    <TooltipContent className="w-80">
                                        <p className="font-medium mb-1">Password requirements:</p>
                                        <ul className="text-sm space-y-1">
                                            <li>• Lowercase and uppercase characters</li>
                                            <li>• At least one number</li>
                                            <li>• At least one special character</li>
                                            <li>• At least 8 characters long</li>
                                        </ul>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <PInput
                            id="password"
                            type="password"
                            value={props.data.password}
                            onChange={e => props.setData(prevData => ({
                                ...prevData,
                                password: e.target.value
                            }))}
                            placeholder="Password"
                        />
                        {passwordStrength && <div className="mt-2">
                            <div className="flex items-center gap-2">
                                <div className={`h-2 w-24 rounded ${getStrengthColor(passwordStrength)}`}></div>
                                <span className="text-sm capitalize">{passwordStrength} password</span>
                            </div>
                        </div>}
                        <InputError message={props.errors.password} />
                    </div>
                    <div>
                        <Label htmlFor="password_confirmation" className="font-bold">Confirm Password</Label>
                        <PInput
                            id="password_confirmation"
                            type="password"
                            value={props.data.password_confirmation}
                            onChange={e => props.setData(prevData => ({
                                ...prevData,
                                password_confirmation: e.target.value
                            }))}
                            placeholder="Confirm Password"
                            className="mt-1"
                        />
                        {props.data.password_confirmation && <div className="mt-2">
                            <div className="flex items-center gap-2">
                                <div className={`h-2 w-24 rounded ${passwordsMatch ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className={`text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                </span>
                            </div>
                        </div>}
                        <InputError message={props.errors.password_confirmation} />
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-8 pt-4 border-t">
                <Button type="submit" disabled={props.processing} className="font-bold px-6">
                    {props.create ? "Create Staff Account" : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}

export default StaffForm;