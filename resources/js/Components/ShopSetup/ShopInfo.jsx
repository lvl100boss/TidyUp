import React from "react";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";

export default function ShopInfo({
    data,
    setData,
    errors,
    setAllFieldsFilled,
    allFieldsFilled,
}) {
    if (data.shop_name && data.shop_bio && !allFieldsFilled) {
        setAllFieldsFilled(true);
    } else if ((!data.shop_name || !data.shop_bio) && allFieldsFilled) {
        setAllFieldsFilled(false);
    }
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Shop Information</h2>
            <div>
                <Label htmlFor="shop_name">Shop Name</Label>
                <Input
                    type="text"
                    id="shop_name"
                    name="shop_name"
                    value={data.shop_name}
                    onChange={(e) => setData("shop_name", e.target.value)}
                    placeholder="Enter your Shop's Name"
                />
                <InputError field="shop_name" errors={errors} />
            </div>
            <div>
                <Label htmlFor="shop_bio">Bio</Label>
                <Textarea
                    id="shop_bio"
                    name="shop_bio"
                    value={data.shop_bio}
                    onChange={(e) => setData("shop_bio", e.target.value)}
                    placeholder="Enter your Shop's Bio"
                    rows={4}
                />
            </div>
        </div>
    );
}
