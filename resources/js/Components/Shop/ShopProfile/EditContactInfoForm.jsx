import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function EditContactInfoForm({ shop, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        email: shop.email || "",
        contact_number: shop.contact_number || "",
        detailed_address: shop.detailed_address || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("shop.update-contact-info"), {
            onSuccess: () => {
                onClose && onClose();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                    id="contact_number"
                    type="text"
                    value={data.contact_number}
                    onChange={(e) => setData("contact_number", e.target.value)}
                />
                {errors.contact_number && (
                    <p className="text-sm text-red-500">{errors.contact_number}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="detailed_address">Address</Label>
                <Textarea
                    id="detailed_address"
                    value={data.detailed_address}
                    onChange={(e) => setData("detailed_address", e.target.value)}
                    rows={3}
                />
                {errors.detailed_address && (
                    <p className="text-sm text-red-500">{errors.detailed_address}</p>
                )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>
        </form>
    );
}
