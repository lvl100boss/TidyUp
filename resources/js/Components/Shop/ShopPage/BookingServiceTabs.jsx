import React, { useState, useEffect, useMemo } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/Components/ui/tabs2";
import { Component, Check } from "lucide-react";


function BookingServiceTabs({ categories, groupedServices, setData }) {
    const [selectedServices, setSelectedServices] = useState([]);
    const [totalPrice, setTotalCost] = useState(0);
    const toggleService = (service) => {
        setSelectedServices(prev => {
            const isSelected = prev.some(s => s.id === service.id);
            const newSelection = isSelected
                ? prev.filter(s => s.id !== service.id)
                : [...prev, service];

            return newSelection;
        });
    };

    const totalCost = useMemo(() => {
        return selectedServices.reduce((sum, service) => sum + Number(service.cost), 0);
    }, [selectedServices]);

    // Update form data whenever selected services change
    useEffect(() => {
        setData('service_id', selectedServices.map(s => s.id));
        setData('total_price', totalCost);
    }, [selectedServices]);



    return (
        <div className="mb-3">
            <Tabs defaultValue={categories?.[0]} className="">
                {categories && (
                    <TabsList className="flex  justify-start !bg-none mb-4">
                        {categories.map((category) => (
                            <TabsTrigger key={category} value={category}>
                                {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                )}

                {/* Tabs Content */}
                {groupedServices?.map(({ category, services }) => (
                    <TabsContent
                        key={category}
                        value={category}
                        className="border p-1 rounded-md shadow-sm"
                    >
                        <ul className="space-y-2">
                            {services.map((service) => {
                                const isSelected = selectedServices.some(s => s.id === service.id);
                                return (
                                    <li
                                        key={service.id}
                                        onClick={() => toggleService(service)}
                                        className={`p-2 flex justify-between items-center group hover:bg-muted/50 rounded-md cursor-pointer
                                            ${isSelected ? 'bg-muted/50 ring-2 ring-primary' : ''}`}
                                    >
                                        <div className="inline-flex items-center gap-2">
                                            <div className="relative">
                                                <Component size={20} />
                                                {isSelected && (
                                                    <Check size={16} className="absolute -top-2 -right-2 text-primary" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1">
                                                    <p className="group-hover:underline">
                                                        <strong>{service.service_name}</strong>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {service.duration_hour}h {service.duration_minute}m
                                                    </p>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {service.duration}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="figtree-semibold">
                                            Php {service.cost}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                    </TabsContent>
                ))}
            </Tabs>
            {selectedServices.length > 0 && (
                (() => {
                    const totalCost = selectedServices.reduce((sum, service) => sum + Number(service.cost), 0);
                    return (
                        <div className="mt-4 p-4 border rounded-md">
                            <p className="font-bold text-xl">Selected Services:</p>
                            <ul className="space-y-1">
                                {selectedServices.map((service) => (
                                    <li key={service.id} className="">
                                        <p className="font-bold"> - {service.service_name}</p>
                                        <p className="ml-3">Php {service.cost}</p>
                                    </li>
                                ))}
                            </ul>
                            <hr className="my-2" />
                            <p className="font-bold text-xl">Total Cost:</p>
                            <p>Php {totalCost}</p>
                        </div>

                    );
                })()
            )}
        </div >
    );
}

export default BookingServiceTabs;
