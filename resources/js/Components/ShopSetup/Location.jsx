import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import LocationSelect from "@/Components/LocationSelect";
import InputError from "@/Components/InputError";

export default function Location({
    data,
    setData,
    handleLocationChange,
    errors,
}) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Location Details</h2>
            <div>
                <Label htmlFor="address">Address</Label>
                <LocationSelect onLocationChange={handleLocationChange} />
            </div>
            <div>
                <Label htmlFor="detailed_address">Detailed Address</Label>
                <Input
                    type="text"
                    id="detailed_address"
                    name="detailed_address"
                    value={data.detailed_address}
                    onChange={(e) =>
                        setData("detailed_address", e.target.value)
                    }
                    placeholder="Enter your Shop's detailed address"
                />
                <InputError field="detailed_address" errors={errors} />
            </div>
        </div>
    );
}
