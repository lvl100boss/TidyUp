import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";

export default function Contact({
    data,
    setData,
    errors,
    allFieldsFilled,
    setAllFieldsFilled,
}) {
    if (data.email && data.phone && !allFieldsFilled) {
        setAllFieldsFilled(true);
    } else if ((!data.email || !data.phone) && allFieldsFilled) {
        setAllFieldsFilled(false);
    }
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <Label htmlFor="email">Business Email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Enter your Shop's email address"
                    />
                    <InputError field="email" errors={errors} />
                </div>
                <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        placeholder="Enter your Shop's phone number"
                    />
                    <InputError field="phone" errors={errors} />
                </div>
            </div>
        </div>
    );
}
