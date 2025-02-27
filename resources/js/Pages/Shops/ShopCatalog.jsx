import ShopsLayout from "@/Layouts/ShopsLayout";
import React, { useState, useEffect } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Plus, Pencil, Trash2, Save, X, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast, Toaster } from 'sonner';

export default function ShopCatalog({ shopServiceCategories, serviceCategories }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.message) {
            if (flash?.success) {
                toast.success("Success", {
                    description: flash.message,
                    duration: 5000,
                });
            } else {
                toast.error("Uh oh! Something went wrong.", {
                    description: flash.message,
                    duration: 5000,
                });
            }
        }
    }, [flash]); // Track flash as a whole instead of flash.message

    // Make sure serviceCategories is defined with a fallback to empty array
    const safeServiceCategories = serviceCategories || [];
    const safeShopServiceCategories = shopServiceCategories || [];

    // Initialize categories from serviceCategories props (this ensures ALL categories are included)
    const initialCategories = safeServiceCategories.map(category => {
        // Find all services belonging to this category
        const services = safeShopServiceCategories
            .filter(item => item.service_category_id === category.id)
            .map(item => ({
                id: item.id,
                name: item.service_name,
                price: parseFloat(item.cost || 0),
                duration_hour: item.duration_hour,
                duration_minute: item.duration_minute,
            }));

        return {
            id: category.id,
            name: category.name,
            services: services || [], // Ensure services is at least an empty array
        };
    });

    const [categories, setCategories] = useState(initialCategories);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [editingServiceId, setEditingServiceId] = useState(null);

    // Form for adding new services
    const { data, setData, post, processing, reset } = useForm({
        category_id: '',
        service_name: '',
        price: '',
        duration_hour: '',
        duration_minute: ''
    });

    // Form for editing services
    const { data: editData, setData: setEditData, patch: patchService, processing: editProcessing, reset: resetEdit } = useForm({
        id: null,
        service_name: '',
        price: '',
        duration_hour: '',
        duration_minute: ''
    });

    const formatDuration = (hours, minutes) => {
        const hourText = hours > 0 ? `${hours}h` : "";
        const minuteText = minutes > 0 ? `${minutes}m` : "";
        return `${hourText} ${minuteText}`.trim() || "0m";
    };

    const addService = (categoryId) => {
        // Set category_id first and ensure it's set before continuing
        setData('category_id', categoryId);

        // Create a copy of the data with the category_id explicitly set
        const serviceData = {
            ...data,
            category_id: categoryId
        };

        // Then post with the explicit data that includes category_id
        post(route('shop.catalog.service.store', serviceData), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                // Use the response from the server if available
                const response = page?.props?.flash?.data;

                if (response && response.service) {
                    const newService = response.service;

                    setCategories(prevCategories =>
                        prevCategories.map(category => {
                            if (category.id === categoryId) {
                                return {
                                    ...category,
                                    services: [...category.services, {
                                        id: newService.id,
                                        name: newService.service_name,
                                        price: parseFloat(newService.cost || 0),
                                        duration_hour: newService.duration_hour || 0,
                                        duration_minute: newService.duration_minute || 0,
                                    }]
                                };
                            }
                            return category;
                        })
                    );

                    toast.success("Service added", {
                        description: "The service was added successfully.",
                        duration: 3000,
                    });
                }

                // Reset the form
                reset();
            },
            onError: (errors) => {
                // Display error message
                toast.error("Error adding service", {
                    description: "There was a problem adding the service.",
                    duration: 5000,
                });
                console.error("Add service errors:", errors);
            }
        });
    };

    const startEditing = (service) => {
        if (!service) return;

        setEditingServiceId(service.id);
        setEditData({
            id: service.id,
            service_name: service.name || '',
            price: service.price || 0,
            duration_hour: service.duration_hour || 0,
            duration_minute: service.duration_minute || 0
        });
    };

    const cancelEditing = () => {
        setEditingServiceId(null);
        resetEdit();
    };

    const saveEditing = (serviceId) => {
        if (!serviceId) return;

        // Store the updated values before making the request
        const updatedValues = {
            name: editData.service_name,
            price: parseFloat(editData.price || 0),
            duration_hour: parseInt(editData.duration_hour || 0),
            duration_minute: parseInt(editData.duration_minute || 0),
        };

        patchService(route('shop.catalog.service.update', serviceId), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                // Get the response data from the page props if available
                const response = page?.props?.flash?.data;

                // Update UI immediately using the values we already have
                setCategories(prevCategories =>
                    prevCategories.map(category => ({
                        ...category,
                        services: category.services.map(service =>
                            service.id === serviceId ? {
                                ...service,
                                ...updatedValues
                            } : service
                        )
                    }))
                );

                // Show success toast
                toast.success("Service updated", {
                    description: "Service updated successfully",
                    duration: 3000,
                });

                setEditingServiceId(null);
                resetEdit();
            },
            onError: (errors) => {
                toast.error("Error updating service", {
                    description: "There was a problem updating the service.",
                    duration: 5000,
                });
                console.error("Update service errors:", errors);
            }
        });
    };

    const confirmDelete = (serviceId) => {
        setServiceToDelete({ serviceId });
        setDeleteDialogOpen(true);
    };

    const deleteService = () => {
        if (!serviceToDelete || !serviceToDelete.serviceId) return;

        router.delete(route('shop.catalog.service.destroy', serviceToDelete.serviceId), {
            onSuccess: () => {
                setCategories(prevCategories =>
                    prevCategories.map(category => ({
                        ...category,
                        services: category.services.filter(service =>
                            service.id !== serviceToDelete.serviceId
                        )
                    }))
                );
                setDeleteDialogOpen(false);
                setServiceToDelete(null);
            },
            onError: (errors) => {
                toast.error("Error deleting service", {
                    description: "There was a problem deleting the service.",
                    duration: 5000,
                });
                console.error("Delete service errors:", errors);
                setDeleteDialogOpen(false);
            }
        });
    };

    return (
        <ShopsLayout>
            <Head title="Shop Services" />
            <Toaster />
            <div className="max-w-7xl mx-auto py-6 space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
                    <p className="text-muted-foreground">
                        Manage your shop's service offerings, pricing, and duration
                    </p>
                </div>
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Tip</AlertTitle>
                    <AlertDescription>
                        Keep your services up to date with accurate pricing and duration information
                    </AlertDescription>
                </Alert>

                <Card>
                    <CardHeader>
                        <CardTitle>Service Categories</CardTitle>
                        <CardDescription>
                            Organize and manage services by category
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px] pr-4">
                            <Accordion type="single" collapsible className="space-y-4">
                                {categories.map((category) => (
                                    <AccordionItem key={category.id} value={`category-${category.id}`}>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex items-center space-x-2">
                                                <span>{category.name}</span>
                                                <Badge variant="secondary">
                                                    {category.services.length} services
                                                </Badge>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-4 pt-4">
                                                <div className="grid grid-cols-12 gap-2">
                                                    <Input
                                                        className="m-0 col-span-4"
                                                        placeholder="Service name"
                                                        value={data.service_name}
                                                        onChange={e => setData('service_name', e.target.value)}
                                                    />
                                                    <Input
                                                        className="m-0 col-span-2"
                                                        type="number"
                                                        placeholder="Price"
                                                        value={data.price}
                                                        onChange={e => setData('price', e.target.value)}
                                                    />
                                                    <Input
                                                        className="m-0 col-span-2"
                                                        type="number"
                                                        min="0"
                                                        max="23"
                                                        placeholder="Hours"
                                                        value={data.duration_hour}
                                                        onChange={e => setData('duration_hour', e.target.value)}
                                                    />
                                                    <Input
                                                        className="m-0 col-span-2"
                                                        type="number"
                                                        min="0"
                                                        max="59"
                                                        placeholder="Minutes"
                                                        value={data.duration_minute}
                                                        onChange={e => setData('duration_minute', e.target.value)}
                                                    />
                                                    <Button
                                                        className="m-0 col-span-2"
                                                        size="lg"
                                                        onClick={() => addService(category.id)}
                                                        disabled={processing}
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add
                                                    </Button>
                                                </div>

                                                <div className="space-y-2">
                                                    {category.services && category.services.map((service) => (
                                                        <div
                                                            key={service.id}
                                                            className="flex items-center justify-between p-2 rounded-md border bg-card"
                                                        >
                                                            {editingServiceId === service.id ? (
                                                                <div className="flex-1 grid grid-cols-12 gap-2">
                                                                    <Input
                                                                        className="m-0 col-span-5"
                                                                        placeholder="Service name"
                                                                        value={editData.service_name}
                                                                        onChange={e => setEditData('service_name', e.target.value)}
                                                                    />
                                                                    <Input
                                                                        className="m-0 col-span-2"
                                                                        type="number"
                                                                        placeholder="Price"
                                                                        value={editData.price}
                                                                        onChange={e => setEditData('price', e.target.value)}
                                                                    />
                                                                    <Input
                                                                        className="m-0 col-span-2"
                                                                        type="number"
                                                                        min="0"
                                                                        max="23"
                                                                        placeholder="Hours"
                                                                        value={editData.duration_hour}
                                                                        onChange={e => setEditData('duration_hour', e.target.value)}
                                                                    />
                                                                    <Input
                                                                        className="m-0 col-span-2"
                                                                        type="number"
                                                                        min="0"
                                                                        max="59"
                                                                        placeholder="Minutes"
                                                                        value={editData.duration_minute}
                                                                        onChange={e => setEditData('duration_minute', e.target.value)}
                                                                    />
                                                                    <div className="col-span-1 flex gap-1">
                                                                        <Button
                                                                            size="icon"
                                                                            variant="outline"
                                                                            onClick={() => saveEditing(service.id)}
                                                                            disabled={editProcessing}
                                                                        >
                                                                            <Save className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            onClick={cancelEditing}
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="flex items-center space-x-4">
                                                                        <span className="font-medium">{service.name}</span>
                                                                        <Badge variant="secondary">
                                                                            ₱{service.price}
                                                                        </Badge>
                                                                        <Badge variant="outline">
                                                                            <Clock className="h-3 w-3 mr-1" />
                                                                            {formatDuration(service.duration_hour, service.duration_minute)}
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => startEditing(service)}
                                                                        >
                                                                            <Pencil className="h-4 w-4 mr-2" />
                                                                            Edit
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="destructive"
                                                                            onClick={() => confirmDelete(service.id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                                            Delete
                                                                        </Button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this service? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={deleteService}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ShopsLayout >
    );
}