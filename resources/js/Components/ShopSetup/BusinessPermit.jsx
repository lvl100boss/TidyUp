import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";

export default function BusinessPermit({
    handlePermitImageChange,
    previewPermitImage,
    errors,
}) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Business Permit</h2>
            <div className="space-y-4">
                <Label htmlFor="business_permit">Upload Business Permit</Label>
                <div className="grid gap-4">
                    <Input
                        type="file"
                        id="business_permit"
                        accept="image/*"
                        onChange={handlePermitImageChange}
                        className="cursor-pointer"
                    />
                    {previewPermitImage && (
                        <div className="relative w-full max-w-md">
                            <img
                                src={previewPermitImage}
                                alt="Business permit preview"
                                className="w-full object-cover rounded-lg"
                            />
                        </div>
                    )}
                    <InputError field="business_permit" errors={errors} />
                </div>
            </div>
        </div>
    );
}
