import { useState } from "react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";

export function ServiceSelector({
    services,
    selectedServices,
    onServiceSelect,
}) {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        ...new Set(services.map((service) => service.category)),
    ];

    return (
        <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1">
                <ScrollArea className="h-[400px]">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={
                                selectedCategory === category
                                    ? "default"
                                    : "ghost"
                            }
                            className="w-full justify-start"
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
                </ScrollArea>
            </div>
            <div className="col-span-3">
                <ScrollArea className="h-[400px]">
                    <div className="grid grid-cols-2 gap-4">
                        {services
                            .filter(
                                (service) =>
                                    !selectedCategory ||
                                    service.category === selectedCategory
                            )
                            .map((service) => (
                                <Card key={service.id} className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-medium">
                                                {service.service_name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {service.duration_hour}h{" "}
                                                {service.duration_minute}m
                                            </p>
                                        </div>
                                        <p className="font-medium">
                                            ₱{service.cost}
                                        </p>
                                    </div>
                                    <Button
                                        variant={
                                            selectedServices[service.id]
                                                ? "default"
                                                : "outline"
                                        }
                                        className="w-full"
                                        onClick={() => onServiceSelect(service)}
                                    >
                                        {selectedServices[service.id]
                                            ? "Selected"
                                            : "Select"}
                                    </Button>
                                </Card>
                            ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
