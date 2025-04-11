import React, { useEffect, useState } from 'react'
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, useForm } from '@inertiajs/react';
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import InputError from '@/Components/InputError';

export default function SetupUserProfile() {
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
        first_name: "",
        middle_name: "",
        last_name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register.setupProfile.save'), {
            data: {
                ...data,
            },
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
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                            id="first_name"
                            value={data.first_name}
                            onChange={(e) => setData("first_name", e.target.value)}
                            placeholder="Enter your first name"
                        />
                        {/* display errors.first_name if needed */}
                        <InputError message={errors.first_name} className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="middle_name">Middle Name (optional)</Label>
                        <Input
                            id="middle_name"
                            value={data.middle_name}
                            onChange={(e) => setData("middle_name", e.target.value)}
                            placeholder="Enter your middle name"
                        />
                        <InputError message={errors.middle_name} className="mt-2" />
                    </div>
                    <div >
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                            id="last_name"
                            value={data.last_name}
                            onChange={(e) => setData("last_name", e.target.value)}
                            placeholder="Enter your last name"
                        />
                        <InputError message={errors.last_name} className="mt-2" />
                    </div>

                    <div>
                        <Button type="submit" disabled={processing} className="w-full mt-4">
                            Confirm
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    )
}
