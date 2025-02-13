import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import { Info } from "lucide-react";

export default function BusinessPermit({
    data,
    handlePermitImageChange,
    handleDtiRegistrationImageChange,
    handleValidIdImageChange,
    previewPermitImage,
    previewDtiRegistrationImage,
    previewValidIdImage,
    errors,
    setAllFieldsFilled,
    allFieldsFilled,
}) {
    if (
        data.business_permit &&
        data.dti_registration &&
        data.valid_id &&
        !allFieldsFilled
    ) {
        setAllFieldsFilled(true);
    } else if (
        !data.business_permit &&
        !data.dti_registration &&
        !data.valid_id &&
        allFieldsFilled
    ) {
        setAllFieldsFilled(false);
    }
    return (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold">Legal Documents</h1>
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Business Permit</h2>
                <Label htmlFor="business_permit">Upload Business Permit</Label>
                <div className="grid gap-4">
                    <Input
                        type="file"
                        id="business_permit"
                        accept="image/*"
                        onChange={handlePermitImageChange}
                        className="cursor-pointer pt-2"
                    />
                    {previewPermitImage && (
                        <div className="relative w-full max-w-md mx-auto">
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
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">DTI Registration</h2>
                <Label htmlFor="dti_registration">
                    Upload DTI Registration
                </Label>
                <Input
                    type="file"
                    id="dti_registration"
                    accept="image/*"
                    onChange={handleDtiRegistrationImageChange}
                    className="cursor-pointer pt-2"
                />
                {previewDtiRegistrationImage && (
                    <div className="relative w-full max-w-md mx-auto">
                        <img
                            src={previewDtiRegistrationImage}
                            alt="DTI registration preview"
                            className="w-full object-cover rounded-lg"
                        />
                    </div>
                )}
                <InputError field="dti_registration" errors={errors} />
            </div>
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Valid ID</h2>
                <Label htmlFor="valid_id">Upload Valid ID</Label>
                <Input
                    type="file"
                    id="valid_id"
                    accept="image/*"
                    onChange={handleValidIdImageChange}
                    className="cursor-pointer pt-2"
                />
                {previewValidIdImage && (
                    <div className="relative w-full max-w-md mx-auto">
                        <img
                            src={previewValidIdImage}
                            alt="Valid ID preview"
                            className="w-full object-cover rounded-lg"
                        />
                    </div>
                )}
                <InputError field="valid_id" errors={errors} />
            </div>

            <div className="p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    <p>
                        All documents are encrypted and stored securely in
                        compliance with data protection regulations. Access is
                        strictly limited to verification purposes only.
                    </p>
                </div>
            </div>
        </div>
    );
}
