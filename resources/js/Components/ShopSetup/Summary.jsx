import React from "react";
import { Badge } from "../ui/badge";

const Summary = ({ data, categories }) => {
    const formatOperationHours = (hours) => {
        return Object.entries(hours)
            .filter(([_, value]) => value.isOpen)
            .map(
                ([day, value]) =>
                    `${day}: ${value.openTime} - ${value.closeTime}`
            )
            .join("\n");
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">
                Review Your Shop Information
            </h2>

            <div className="grid gap-4 p-6 border rounded-lg">
                <div>
                    <h3 className="font-semibold mb-2">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">Shop Name:</p>
                        <p>{data.shop_name}</p>
                        <p className="text-muted-foreground">Email:</p>
                        <p>{data.email}</p>
                        <p className="text-muted-foreground">Phone:</p>
                        <p>{data.phone}</p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Shop Categories</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.categories.map((category, index) => (
                            <Badge key={index} variant={"secondary"}>
                                {categories[index].name}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Location</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">Region:</p>
                        <p>{data.region}</p>
                        <p className="text-muted-foreground">Province:</p>
                        <p>{data.province}</p>
                        <p className="text-muted-foreground">City:</p>
                        <p>{data.city}</p>
                        <p className="text-muted-foreground">Barangay:</p>
                        <p>{data.barangay}</p>
                        <p className="text-muted-foreground">Address:</p>
                        <p>{data.detailed_address}</p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Operation Hours</h3>
                    <pre className="text-sm whitespace-pre-line">
                        {formatOperationHours(data.operation_hours)}
                    </pre>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">
                        Services ({data.catalog_items.length})
                    </h3>
                    <div className="grid gap-2">
                        {data.catalog_items.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between text-sm"
                            >
                                <span>{item.service_name}</span>
                                <span className="font-semibold">
                                    ₱{item.cost}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Summary;
