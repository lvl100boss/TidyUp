import React from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/Components/ui/tabs2";
import { Component } from "lucide-react";

function ServiceTabs(props) {
    return (
        <div className="mb-3">
            <Tabs defaultValue={props.categories?.[0]} className="">
                {/* Tabs List */}
                <h1 className="figtree-semibold text-2xl mb-2">Services</h1>
                <TabsList className="flex  justify-start !bg-none mb-4">
                    {props.categories.map((category) => (
                        <TabsTrigger key={category} value={category}>
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Tabs Content */}
                {props.groupedServices.map(({ category, services }) => (
                    <TabsContent
                        key={category}
                        value={category}
                        className="border p-1 rounded-md shadow-sm"
                    >
                        <ul className="space-y-2">
                            {services.map((service) => (
                                <li
                                    key={service.id}
                                    className="p-2 flex justify-between items-center group hover:bg-muted/50 rounded-md"
                                >
                                    <div className="inline-flex items-center gap-2">
                                        <Component size={20} />
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <p className="group-hover:underline group:hover">
                                                    <strong>
                                                        {service.service_name}
                                                    </strong>
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {service.duration_hour}h{" "}
                                                    {service.duration_minute}m
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
                            ))}
                        </ul>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

export default ServiceTabs;
