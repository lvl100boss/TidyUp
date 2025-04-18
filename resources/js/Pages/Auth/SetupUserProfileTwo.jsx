import React, { useEffect, useState } from 'react'
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, useForm } from '@inertiajs/react';
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import InputError from '@/Components/InputError';

export default function SetupUserProfile({ first_name, last_name }) {
    const displayName = first_name[0] + last_name[0];
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

    const { data, setData, post, processing, errors } = useForm({
        profile_photo_path: "",
        contact_number: "",
        gender: "",
        date_of_birth: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register.setupProfile2.save'), {
            data: {
                ...data,
                profile_photo_path: data.profile_photo_path,
            },
            forceFormData: true,
        });
    }


    return (
        <section className='grid place-items-center min-h-screen '>
            <Head title="Setup User Profile" />
            <div className="max-w-xl mx-auto">
                <ApplicationLogo className="size-28 mx-auto" />
                <h1 className='text-center text-4xl font-medium mt-4'>Welcome!</h1>
                <h1 className='text-center text-4xl font-medium mb-4'> Let's set up your profile.</h1>
                <p className='text-sm text-muted-foreground text-center mb-4'>Tell us a bit about yourself to get started.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="profile_photo_path">Profile Photo</Label>
                        <div
                            onClick={() => document.getElementById('profile_photo_path').click()}
                            className='w-full mb-4 cursor-pointer'
                        >
                            <Avatar className='size-32 mx-auto bg-muted'>
                                <AvatarImage
                                    src={data.profile_photo_path instanceof File ? URL.createObjectURL(data.profile_photo_path) : null}
                                    onError={() => setData("profile_photo_path", null)}
                                />
                                <AvatarFallback className="uppercase">{displayName}</AvatarFallback>
                            </Avatar>
                            <div className='text-center text-sm text-muted-foreground'>Click to upload</div>
                            <InputError message={errors.profile_photo_path} className="mt-2" />
                        </div>
                        <div className="relative">
                            <Input
                                id="profile_photo_path"
                                type="file"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        setData("profile_photo_path", e.target.files[0]);
                                    } else {
                                        setData("profile_photo_path", null);
                                    }
                                }}
                                className="pt-2 hidden"
                            />
                            {data.profile_photo_path && (
                                <div className='flex items-center justify-end mt-2 absolute right-1 -top-14'>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setData("profile_photo_path", "")}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="contact_number">Contact Number</Label>
                        <Input
                            id="contact_number"
                            type="tel"
                            value={data.contact_number}
                            onChange={(e) => setData("contact_number", e.target.value)}
                            placeholder="Enter your contact number"
                        />
                        <InputError message={errors.contact_number} className="mt-2" />
                    </div>
                    <div>
                        <Label>Gender</Label>
                        <Select
                            value={data.gender}
                            onValueChange={(val) => setData("gender", val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.gender} className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                        <Input
                            id="date_of_birth"
                            type="date"
                            value={data.date_of_birth}
                            onChange={(e) => setData("date_of_birth", e.target.value)}
                        />
                        <InputError message={errors.date_of_birth} className="mt-2" />
                    </div>
                    <Button type="submit" disabled={processing} className="w-full mt-4">
                        Confirm
                    </Button>
                </form>
            </div >
        </section >
    )
}
