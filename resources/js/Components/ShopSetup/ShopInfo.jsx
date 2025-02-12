import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";

export default function ShopInfo({ data, setData, errors }) {
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
        </div>
    );
}
