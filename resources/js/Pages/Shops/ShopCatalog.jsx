import ShopsLayout from "@/Layouts/ShopsLayout";
import React, { useState, useEffect } from "react";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import { Plus, Pencil, Trash2, AlertCircle, Clock, Search, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import { toast, Toaster } from 'sonner';
import { Separator } from "@/components/ui/separator";

// The error might be related to component imports, so let's start with a simpler version
export default function ShopCatalog({ shopServices, serviceCategories, isOwnerOrManager }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.message) {
            if (flash?.success) {
                toast("Success", {
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
    }, [flash]);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    // Group services by their category
    const groupedServices = serviceCategories.map(category => {
        return {
            ...category,
            services: shopServices.filter(service =>
                service.service_category_id === category.id
            )
        };
    });

    const addForm = useForm({
        service_name: '',
        service_category_id: '',
        cost: '',
        duration_hour: 0,
        duration_minute: 0,
    });

    const editForm = useForm({
        id: '',
        service_name: '',
        service_category_id: '',
        cost: '',
        duration_hour: 0,
        duration_minute: 0,
    });

    const deleteForm = useForm({
        id: '',
    });

    const handleAdd = (e) => {
        e.preventDefault();
        addForm.post(route('shop.catalog.store'), {
            onSuccess: () => {
                setIsAddDialogOpen(false);
                addForm.reset();
            }
        });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        // Convert service_category_id to a number if it's a string
        const formData = {
            ...editForm.data,
            service_category_id: parseInt(editForm.data.service_category_id)
        };

        editForm.patch(route('shop.catalog.update', editForm.data.id), {
            data: formData,
            onSuccess: () => {
                setIsEditDialogOpen(false);
                setCurrentService(null);
                editForm.reset();
            },
            onError: (errors) => {
                console.error("Edit form errors:", errors);
            }
        });
    };

    const handleDelete = (e) => {
        e.preventDefault();
        deleteForm.delete(route('shop.catalog.destroy', deleteForm.data.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                deleteForm.reset();
            },
            onError: (errors) => {
                console.error("Delete form errors:", errors);
            }
        });
    };

    const openEditDialog = (service) => {
        setCurrentService(service);
        editForm.setData({
            id: service.id,
            service_name: service.service_name,
            service_category_id: service.service_category_id,
            cost: service.cost,
            duration_hour: service.duration_hour,
            duration_minute: service.duration_minute,
        });
        setIsEditDialogOpen(true);
        // Log to verify the data is set correctly
        console.log("Edit form data set:", service);
    };

    const openDeleteDialog = (service) => {
        setCurrentService(service);
        deleteForm.setData({
            id: service.id,
        });
        setIsDeleteDialogOpen(true);
        // Log to verify the data is set correctly
        console.log("Delete form data set:", { id: service.id });
    };

    // Format duration
    const formatDuration = (hours, minutes) => {
        if (hours > 0) {
            return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
        }
        return `${minutes}min`;
    };

    return (
        <ShopsLayout>
            <Head title="Shop Services" />
            <Toaster />
            <div className="max-w-7xl mx-auto space-y-8 pb-8">
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

                {/* Services Management Section */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Your Services</h2>
                    {isOwnerOrManager && (
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" /> Add New Service
                        </Button>
                    )}
                </div>

                {/* Services Accordion */}
                <Accordion type="multiple" className="w-full">
                    {groupedServices.map((category) => (
                        <AccordionItem key={category.id} value={`category-${category.id}`}>
                            <AccordionTrigger className="text-lg font-medium">
                                <div className="flex items-center">
                                    <span>{category.name}</span>
                                    <Badge variant="outline" className="ml-2">
                                        {category.services.length} services
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {category.services.length === 0 ? (
                                    <div className="py-4 text-muted-foreground text-center">
                                        No services in this category yet
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {category.services.map((service) => (
                                            <Card key={service.id} className="border ">
                                                <CardHeader className="pb-3">
                                                    <CardTitle>{service.service_name}</CardTitle>
                                                    <CardDescription className="flex items-center">
                                                        <Clock className="h-3.5 w-3.5 mr-1" />
                                                        {formatDuration(service.duration_hour, service.duration_minute)}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="pb-3">
                                                    <p className="text-lg font-bold">
                                                        ₱{parseFloat(service.cost).toFixed(2)}
                                                    </p>
                                                </CardContent>
                                                {isOwnerOrManager && (
                                                    <CardFooter className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openEditDialog(service)}
                                                        >
                                                            <Pencil className="h-4 w-4 mr-1" /> Edit
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(service)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                                                        </Button>
                                                    </CardFooter>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                {/* Add Service Dialog */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Service</DialogTitle>
                            <DialogDescription>
                                Add a new service to your catalog.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAdd}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="service_name" className="text-right">Service Name</label>
                                    <Input
                                        id="service_name"
                                        name="service_name"
                                        placeholder="e.g. Men's Haircut"
                                        className="col-span-3"
                                        value={addForm.data.service_name}
                                        onChange={(e) => addForm.setData('service_name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="service_category_id" className="text-right">Category</label>
                                    <select
                                        id="service_category_id"
                                        name="service_category_id"
                                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                                        value={addForm.data.service_category_id}
                                        onChange={(e) => addForm.setData('service_category_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {serviceCategories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="cost" className="text-right">Price (₱)</label>
                                    <div className="col-span-3 relative">
                                        <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="cost"
                                            name="cost"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="pl-8"
                                            value={addForm.data.cost}
                                            onChange={(e) => addForm.setData('cost', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">Duration</label>
                                    <div className="col-span-3 flex items-center gap-2">
                                        <Input
                                            id="duration_hour"
                                            name="duration_hour"
                                            type="number"
                                            min="0"
                                            max="23"
                                            placeholder="Hours"
                                            className="w-1/3"
                                            value={addForm.data.duration_hour}
                                            onChange={(e) => addForm.setData('duration_hour', e.target.value)}
                                            required
                                        />
                                        <span>h</span>
                                        <Input
                                            id="duration_minute"
                                            name="duration_minute"
                                            type="number"
                                            min="0"
                                            max="59"
                                            placeholder="Minutes"
                                            className="w-1/3"
                                            value={addForm.data.duration_minute}
                                            onChange={(e) => addForm.setData('duration_minute', e.target.value)}
                                            required
                                        />
                                        <span>min</span>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={addForm.processing}>
                                    {addForm.processing ? "Saving..." : "Save Service"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Service Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Service</DialogTitle>
                            <DialogDescription>
                                Update the details of this service.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEdit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="edit_service_name" className="text-right">Service Name</label>
                                    <Input
                                        id="edit_service_name"
                                        name="service_name"
                                        placeholder="e.g. Men's Haircut"
                                        className="col-span-3"
                                        value={editForm.data.service_name}
                                        onChange={(e) => editForm.setData('service_name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="edit_service_category_id" className="text-right">Category</label>
                                    <select
                                        id="edit_service_category_id"
                                        name="service_category_id"
                                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                                        value={editForm.data.service_category_id}
                                        onChange={(e) => editForm.setData('service_category_id', e.target.value)}
                                        required
                                    >
                                        {serviceCategories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label htmlFor="edit_cost" className="text-right">Price (₱)</label>
                                    <div className="col-span-3 relative">
                                        <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="edit_cost"
                                            name="cost"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="pl-8"
                                            value={editForm.data.cost}
                                            onChange={(e) => editForm.setData('cost', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">Duration</label>
                                    <div className="col-span-3 flex items-center gap-2">
                                        <Input
                                            id="edit_duration_hour"
                                            name="duration_hour"
                                            type="number"
                                            min="0"
                                            max="23"
                                            placeholder="Hours"
                                            className="w-1/3"
                                            value={editForm.data.duration_hour}
                                            onChange={(e) => editForm.setData('duration_hour', e.target.value)}
                                            required
                                        />
                                        <span>h</span>
                                        <Input
                                            id="edit_duration_minute"
                                            name="duration_minute"
                                            type="number"
                                            min="0"
                                            max="59"
                                            placeholder="Minutes"
                                            className="w-1/3"
                                            value={editForm.data.duration_minute}
                                            onChange={(e) => editForm.setData('duration_minute', e.target.value)}
                                            required
                                        />
                                        <span>min</span>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={editForm.processing}>
                                    {editForm.processing ? "Updating..." : "Update Service"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this service? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleDelete}>
                            {currentService && (
                                <div className="py-4 space-y-3">
                                    <div className="font-bold text-lg">{currentService.service_name}</div>
                                    <Separator />
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center">
                                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">Price</div>
                                                <div className="font-medium">₱{parseFloat(currentService.cost).toFixed(2)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <div>
                                                <div className="text-sm text-muted-foreground">Duration</div>
                                                <div className="font-medium">
                                                    {formatDuration(currentService.duration_hour, currentService.duration_minute)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="destructive" disabled={deleteForm.processing}>
                                    {deleteForm.processing ? "Deleting..." : "Delete Service"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </ShopsLayout>
    );
}