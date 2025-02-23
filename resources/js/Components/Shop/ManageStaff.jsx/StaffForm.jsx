
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

function StaffForm(props) {
    return (
        <form onSubmit={props.handleSubmit} className="max-w-screen-md border border-border p-6 rounded-md mt-6 mb-10 shadow-md">
            <div className="">
                <div className="col-span-2">
                    <div className="flex gap-5 items-center">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={props.data.profile_photo_path ? URL.createObjectURL(props.data.profile_photo_path) : ''} />
                            <AvatarFallback className="font-bold">Profile</AvatarFallback>
                        </Avatar>
                        <div className="w-full mb-2">
                            <Label htmlFor="profile_photo_path" className="font-bold">Profile Photo</Label>
                            <Input id="profile_photo_path" type="file" onChange={e => props.setData("profile_photo_path", e.target.files[0])} className="pt-2 block w-full" />
                            <InputError message={props.errors.profile_photo_path} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2">
                        {
                            /* First Name Field */
                        }
                        <div>
                            <Label htmlFor="first_name" className="font-bold">First Name</Label>
                            <Input id="first_name" value={props.data.first_name} onChange={e => props.setData("first_name", e.target.value)} placeholder="First Name" />
                            <InputError message={props.errors.first_name} />
                        </div>
                        {
                            /* Last Name Field */
                        }
                        <div>
                            <Label htmlFor="last_name" className="font-bold">Last Name</Label>
                            <Input id="last_name" value={props.data.last_name} onChange={e => props.setData("last_name", e.target.value)} placeholder="Last Name" />
                            <InputError message={props.errors.last_name} />
                        </div>
                        {
                            /* Position Field */
                        }
                        <div>
                            <Label htmlFor="position" className="font-bold">Position</Label>

                            <Select onValueChange={value => props.setData('position', value)}>
                                <SelectTrigger id="position">
                                    <SelectValue placeholder="Select Position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {props.isOwner && <>
                                        <SelectItem value="owner">Owner</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                    </>}
                                    <SelectItem value="staff">Staff</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={props.errors.position} />
                        </div>
                        {
                            /* Role Field */
                        }
                        <div>
                            <Label htmlFor="role" className="font-bold">Role</Label>
                            <Input id="role" value={props.data.role} onChange={e => props.setData("role", e.target.value)} placeholder="ex. Head Stylist, Barber, etc." />
                            <InputError message={props.errors.role} />
                        </div>

                        {
                            /* Date of Birth Field */
                        }
                        <div>
                            <Label htmlFor="date_of_birth" className="font-bold">Date of Birth</Label>
                            <Input id="date_of_birth" type="date" value={props.data.date_of_birth} onChange={e => props.setData("date_of_birth", e.target.value)} />
                            <InputError message={props.errors.date_of_birth} />
                        </div>
                        {
                            /* Gender Field */
                        }
                        <div>
                            <Label htmlFor="gender" className="font-bold">Gender</Label>
                            <Select onValueChange={value => props.setData('gender', value)}>
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={props.errors.gender} />
                        </div>
                        {
                            /* contact_number */
                        }
                        <div>
                            <Label htmlFor="contact_number" className="font-bold">Contact Number</Label>
                            <Input id="contact_number" value={props.data.contact_number} onChange={e => props.setData("contact_number", e.target.value)} placeholder="Contact Number" />
                            <InputError message={props.errors.contact_number} />
                        </div>
                        {
                            /* Status Field */
                        }
                        <div className="">
                            <Label htmlFor="is_active" className="font-bold">Status</Label>
                            <Select value={`${props.data.is_active}`} onValueChange={value => props.setData('is_active', value)}>
                                <SelectTrigger id="is_active">
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

                <div className="col-span-2 mt-6">
                    <div className="grid grid-cols-1 gap-6">
                        {
                            /* Email Field */
                        }
                        <div>
                            <Label htmlFor="email" className="font-bold">Email</Label>
                            <Input id="email" type="email" value={props.data.email} onChange={e => props.setData("email", e.target.value)} placeholder="Email" />
                            <InputError message={props.errors.email} />
                        </div>
                        {
                            /* Username Field */
                        }
                        <div>
                            <Label htmlFor="username" className="font-bold">Username</Label>
                            <Input id="username" value={props.data.username} onChange={e => props.setData("username", e.target.value)} placeholder="Username" />
                            <InputError message={props.errors.username} />
                        </div>
                        {
                            /* Password Field */
                        }
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
                            <PInput id="password" type="password" value={props.data.password} onChange={e => {
                                props.setData("password", e.target.value);
                            }} placeholder="Password" />
                            {props.passwordStrength && <div className="mt-2">
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-24 rounded ${props.getStrengthColor(props.passwordStrength)}`}></div>
                                    <span className="text-sm capitalize">{props.passwordStrength} password</span>
                                </div>
                            </div>}
                            <InputError message={props.errors.password} />
                        </div>
                        {
                            /* Password Confirmation Field */
                        }
                        <div>
                            <Label htmlFor="password_confirmation" className="font-bold">Confirm Password</Label>
                            <PInput id="password_confirmation" type="password" value={props.data.password_confirmation} onChange={e => props.setData("password_confirmation", e.target.value)} placeholder="Confirm Password" />
                            {props.data.password_confirmation && <div className="mt-2">
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-24 rounded ${props.passwordsMatch ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`text-sm ${props.passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                                        {props.passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                    </span>
                                </div>
                            </div>}
                            <InputError message={props.errors.password_confirmation} />
                        </div>

                    </div>
                    <div className="place-self-end mt-6">
                        <Button type="submit" disabled={props.processing} className="font-bold">
                            Create Staff Account
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default StaffForm;