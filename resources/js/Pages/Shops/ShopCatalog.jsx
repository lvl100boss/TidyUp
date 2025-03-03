import ShopsLayout from "@/Layouts/ShopsLayout";
import React, { useState } from "react";
import { Head } from "@inertiajs/react";

// Import shadcn UI components (adjust import paths as needed)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShopCatalog() {
    // Each category has an id, a name, and an array of services (each with id and name)
    const initialCategories = [
        {
            id: 1,
            name: "Haircut",
            services: [{ id: 1, name: "Basic Haircut" }, { id: 2, name: "Deluxe Haircut" }],
        },
        {
            id: 2,
            name: "Hair Styling",
            services: [{ id: 1, name: "Braiding" }, { id: 2, name: "Curling" }],
        },
        {
            id: 3,
            name: "Kid's Haircut",
            services: [],
        },
        {
            id: 4,
            name: "Others",
            services: [],
        },
    ];

    const [categories, setCategories] = useState(initialCategories);
    // For adding a new service per category. Keys are category IDs.
    const [newServiceValues, setNewServiceValues] = useState({});
    // To track which service is being edited (within a category)
    const [editing, setEditing] = useState({ categoryId: null, serviceId: null, value: "" });

    const addService = (categoryId) => {
        const value = newServiceValues[categoryId];
        if (!value || !value.trim()) return;
        setCategories(
            categories.map((category) => {
                if (category.id === categoryId) {
                    // Find a unique service id within the category
                    const newId = category.services.length
                        ? Math.max(...category.services.map((s) => s.id)) + 1
                        : 1;
                    return {
                        ...category,
                        services: [...category.services, { id: newId, name: value }],
                    };
                }
                return category;
            })
        );
        setNewServiceValues({ ...newServiceValues, [categoryId]: "" });
    };

    const deleteService = (categoryId, serviceId) => {
        setCategories(
            categories.map((category) => {
                if (category.id === categoryId) {
                    return {
                        ...category,
                        services: category.services.filter((s) => s.id !== serviceId),
                    };
                }
                return category;
            })
        );
    };

    const startEditing = (categoryId, service) => {
        setEditing({ categoryId, serviceId: service.id, value: service.name });
    };

    const saveEditing = () => {
        const { categoryId, serviceId, value } = editing;
        setCategories(
            categories.map((category) => {
                if (category.id === categoryId) {
                    return {
                        ...category,
                        services: category.services.map((s) =>
                            s.id === serviceId ? { ...s, name: value } : s
                        ),
                    };
                }
                return category;
            })
        );
        setEditing({ categoryId: null, serviceId: null, value: "" });
    };

    return (
        <ShopsLayout>
            <Head title="Shop Services" />

            <div className="container mx-auto p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Shop Services</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {categories.map((category) => (
                            <div key={category.id} className="border p-4 rounded">
                                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>

                                {/* Add Service to this category */}
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        type="text"
                                        placeholder="New service"
                                        value={newServiceValues[category.id] || ""}
                                        onChange={(e) =>
                                            setNewServiceValues({
                                                ...newServiceValues,
                                                [category.id]: e.target.value,
                                            })
                                        }
                                    />
                                    <Button onClick={() => addService(category.id)}>Add</Button>
                                </div>

                                {/* List of services for the category */}
                                <ul className="space-y-2">
                                    {category.services.map((service) => (
                                        <li key={service.id} className="flex items-center gap-2">
                                            {editing.categoryId === category.id && editing.serviceId === service.id ? (
                                                <>
                                                    <Input
                                                        type="text"
                                                        value={editing.value}
                                                        onChange={(e) =>
                                                            setEditing({ ...editing, value: e.target.value })
                                                        }
                                                    />
                                                    <Button onClick={saveEditing}>Save</Button>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() =>
                                                            setEditing({ categoryId: null, serviceId: null, value: "" })
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{service.name}</span>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => startEditing(category.id, service)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => deleteService(category.id, service.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </ShopsLayout>
    );
}
