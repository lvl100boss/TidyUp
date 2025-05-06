import React, { useState, useEffect, useMemo } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/Components/ui/tabs2";
import { Component, Check, Scissors, Clock } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function BookingServiceTabs({ categories, groupedServices, setData }) {
    const [selectedServices, setSelectedServices] = useState([]);
    const [activeCategory, setActiveCategory] = useState(categories?.[0] || "");

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

    const handleCategoryChange = (value) => {
        setActiveCategory(value);
    };

    return (
        <div className="mb-3">
            <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
                <div className="mb-4 sm:mb-6">
                    <h3 className="text-base font-medium mb-2">Service Categories</h3>
                    <ScrollArea className="w-full pb-2">
                        <TabsList className="h-10 sm:h-12 p-1 w-full justify-start">
                            {categories?.map((category) => (
                                <TabsTrigger 
                                    key={category} 
                                    value={category}
                                    className="px-3 sm:px-6 py-2 text-sm sm:text-base h-8 sm:h-10 data-[state=active]:shadow-md transition-all"
                                >
                                    {category}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </ScrollArea>
                </div>

                {/* Tabs Content */}
                {groupedServices?.map(({ category, services }) => (
                    <TabsContent
                        key={category}
                        value={category}
                        className="mt-0"
                    >
                        <h3 className="text-lg font-medium mb-3">{category} Services</h3>
                        <div className="space-y-2 sm:space-y-3">
                            {services.map((service) => {
                                const isSelected = selectedServices.some(s => s.id === service.id);
                                return (
                                    <Card 
                                        key={service.id}
                                        onClick={() => toggleService(service)}
                                        className={`hover:border-primary cursor-pointer transition-all duration-200
                                            ${isSelected ? 'border-primary ring-1 ring-primary bg-primary/5' : ''}`}
                                    >
                                        <CardContent className="p-3 sm:p-6">
                                            <div className="flex justify-between items-start gap-2 sm:gap-4">
                                                <div className="flex items-start gap-2 sm:gap-3">
                                                    <div className={`mt-1 p-1 sm:p-2 rounded-full ${isSelected ? 'bg-primary text-white' : 'bg-muted'}`}>
                                                        {isSelected ? (
                                                            <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        ) : (
                                                            <Scissors className="h-4 w-4 sm:h-5 sm:w-5" />
                                                        )}
                                                    </div>
                                                    
                                                    <div>
                                                        <h4 className="font-medium text-base sm:text-lg leading-5 sm:leading-6">
                                                            {service.service_name}
                                                        </h4>
                                                        
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                                            <span className="text-xs sm:text-sm text-muted-foreground">
                                                                {service.duration_hour > 0 ? `${service.duration_hour}h ` : ''}
                                                                {service.duration_minute > 0 ? `${service.duration_minute}m` : ''}
                                                            </span>
                                                        </div>
                                                        
                                                        {service.description && (
                                                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 line-clamp-2">
                                                                {service.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="text-right">
                                                    <p className="font-bold text-base sm:text-lg">
                                                        ₱{Number(service.cost).toFixed(2)}
                                                    </p>
                                                    {isSelected && (
                                                        <Badge variant="outline" className="border-primary text-primary bg-primary/5 text-xs sm:text-sm">
                                                            Selected
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
            
            {selectedServices.length > 0 && (
                <Card className="mt-4 sm:mt-6">
                    <CardContent className="p-4 sm:p-6">
                        <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">Selected Services</h3>
                        <div className="space-y-2">
                            {selectedServices.map((service) => (
                                <div key={service.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span className="font-medium text-sm sm:text-base">{service.service_name}</span>
                                    </div>
                                    <span className="font-medium text-sm sm:text-base">₱{Number(service.cost).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        
                        <Separator className="my-3 sm:my-4" />
                        
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-base sm:text-lg">Total</h3>
                            <span className="font-bold text-base sm:text-lg">₱{totalCost.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default BookingServiceTabs;
