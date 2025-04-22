import React, { useState, useEffect } from 'react';
import ResubmitForm from '@/Components/ResubmitForm';
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
    DialogClose,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Pencil, Trash2, Plus, PhilippinePeso, Clock } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import { Toaster } from "@/Components/ui/sonner";
import { toast } from "sonner";

// Helper function to format duration
const formatDuration = (hours, minutes) => {
    if (hours > 0) {
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
};

const ShopServices = ({ shop, serviceCategories, changeDetected, setChangeDetected }) => {

    useEffect(() => {
        if (changeDetected?.message) {
            if (changeDetected.success) {
                toast.success("Success", { description: changeDetected.message });
            } else {
                toast.error("Error", { description: changeDetected.message || "An error occurred." });
            }
        }
    }, [changeDetected]);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);

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

    const deleteForm = useForm({}); // No data needed for delete form

    // --- Add Service ---
    const handleAdd = (e) => {
        e.preventDefault();
        addForm.post(route('shop.resubmission.services.store', { shop: shop.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddDialogOpen(false);
                addForm.reset();
                if (changeDetected) return;
                setChangeDetected(true);
            },
            onError: (errors) => {
                console.error("Add service errors:", errors);
                // Optionally show toast errors
                Object.values(errors).forEach(error => toast.error(error));
            }
        });
    };

    // --- Edit Service ---
    const openEditDialog = (service) => {
        setCurrentService(service);
        editForm.setData({
            id: service.id,
            service_name: service.service_name,
            service_category_id: String(service.service_category_id), // Ensure it's a string for Select
            cost: String(service.cost),
            duration_hour: service.duration_hour,
            duration_minute: service.duration_minute,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!currentService) return;
        editForm.patch(route('shop.resubmission.services.update', { shop: shop.id, service: currentService.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditDialogOpen(false);
                setCurrentService(null);
                editForm.reset();
                if (changeDetected) return;
                setChangeDetected(true);
            },
            onError: (errors) => {
                console.error("Edit service errors:", errors);
                Object.values(errors).forEach(error => toast.error(error));
            }
        });
    };

    // --- Delete Service ---
    const openDeleteDialog = (service) => {
        setCurrentService(service);
        setIsDeleteDialogOpen(true);
        if (changeDetected) return;
        setChangeDetected(true);
    };

    const handleDeleteConfirm = () => {
        if (!currentService) return;
        deleteForm.delete(route('shop.resubmission.services.destroy', { shop: shop.id, service: currentService.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setCurrentService(null);
            },
            onError: (errors) => {
                console.error("Delete service errors:", errors);
                Object.values(errors).forEach(error => toast.error(error));
            },
        });
    };

    return (
        <ResubmitForm
            title="Shop Services"
            icon="Scissors"
        // No onSubmit needed here as actions are handled individually
        >


            <div className="space-y-3 mt-4">
                {shop.services && shop.services.length > 0 ? shop.services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                                <Label className="font-semibold">{service.service_name}</Label>
                                <Badge variant="outline" className="text-xs">{service.service_categories?.name || 'N/A'}</Badge>
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                <span className="flex items-center">
                                    <PhilippinePeso className="h-3 w-3 mr-1" />
                                    {parseFloat(service.cost).toFixed(2)}
                                </span>
                                <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatDuration(service.duration_hour, service.duration_minute)}
                                </span>
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <Button variant="outline" size="icon" onClick={() => openEditDialog(service)} className="h-7 w-7">
                                <Pencil className="h-3.5 w-3.5" />
                                <span className="sr-only">Edit Service</span>
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => openDeleteDialog(service)} className="h-7 w-7">
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="sr-only">Delete Service</span>
                            </Button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-6 border rounded-md">
                        <p className="text-sm text-muted-foreground">No services found for this shop. Add a new service to get started.</p>
                    </div>
                )}
            </div>
            <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus /> Add Service
                </Button>
            </div>
            {/* Add Service Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the new service.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <Label htmlFor="add_service_name">Service Name</Label>
                            <Input
                                id="add_service_name"
                                value={addForm.data.service_name}
                                onChange={(e) => addForm.setData('service_name', e.target.value)}
                                required
                            />
                            {addForm.errors.service_name && <p className="text-sm text-destructive mt-1">{addForm.errors.service_name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="add_service_category_id">Category</Label>
                            <Select
                                value={addForm.data.service_category_id}
                                onValueChange={(value) => addForm.setData('service_category_id', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.isArray(serviceCategories) && serviceCategories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {addForm.errors.service_category_id && <p className="text-sm text-destructive mt-1">{addForm.errors.service_category_id}</p>}
                        </div>
                        <div>
                            <Label htmlFor="add_cost">Price (₱)</Label>
                            <Input
                                id="add_cost"
                                type="number"
                                step="0.01"
                                min="0"
                                value={addForm.data.cost}
                                onChange={(e) => addForm.setData('cost', e.target.value)}
                                required
                            />
                            {addForm.errors.cost && <p className="text-sm text-destructive mt-1">{addForm.errors.cost}</p>}
                        </div>
                        <div>
                            <Label>Duration</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min="0"
                                    max="23"
                                    placeholder="Hours"
                                    value={addForm.data.duration_hour}
                                    onChange={(e) => addForm.setData('duration_hour', parseInt(e.target.value) || 0)}
                                    required
                                />
                                <span>h</span>
                                <Input
                                    type="number"
                                    min="0"
                                    max="59"
                                    step="1"
                                    placeholder="Minutes"
                                    value={addForm.data.duration_minute}
                                    onChange={(e) => addForm.setData('duration_minute', parseInt(e.target.value) || 0)}
                                    required
                                />
                                <span>m</span>
                            </div>
                            {(addForm.errors.duration_hour || addForm.errors.duration_minute || addForm.errors.duration) &&
                                <p className="text-sm text-destructive mt-1">
                                    {addForm.errors.duration_hour || addForm.errors.duration_minute || addForm.errors.duration || 'Invalid duration'}
                                </p>}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={addForm.processing}>
                                {addForm.processing ? "Adding..." : "Add Service"}
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
                            Update the details for "{currentService?.service_name}".
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <Label htmlFor="edit_service_name">Service Name</Label>
                            <Input
                                id="edit_service_name"
                                value={editForm.data.service_name}
                                onChange={(e) => editForm.setData('service_name', e.target.value)}
                                required
                            />
                            {editForm.errors.service_name && <p className="text-sm text-destructive mt-1">{editForm.errors.service_name}</p>}
                        </div>
                        <div>
                            <Label htmlFor="edit_service_category_id">Category</Label>
                            <Select
                                value={editForm.data.service_category_id}
                                onValueChange={(value) => editForm.setData('service_category_id', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.isArray(serviceCategories) && serviceCategories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {editForm.errors.service_category_id && <p className="text-sm text-destructive mt-1">{editForm.errors.service_category_id}</p>}
                        </div>
                        <div>
                            <Label htmlFor="edit_cost">Price (₱)</Label>
                            <Input
                                id="edit_cost"
                                type="number"
                                step="0.01"
                                min="0"
                                value={editForm.data.cost}
                                onChange={(e) => editForm.setData('cost', e.target.value)}
                                required
                            />
                            {editForm.errors.cost && <p className="text-sm text-destructive mt-1">{editForm.errors.cost}</p>}
                        </div>
                        <div>
                            <Label>Duration</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min="0"
                                    max="23"
                                    placeholder="Hours"
                                    value={editForm.data.duration_hour}
                                    onChange={(e) => editForm.setData('duration_hour', parseInt(e.target.value) || 0)}
                                    required
                                />
                                <span>h</span>
                                <Input
                                    type="number"
                                    min="0"
                                    max="59"
                                    step="1"
                                    placeholder="Minutes"
                                    value={editForm.data.duration_minute}
                                    onChange={(e) => editForm.setData('duration_minute', parseInt(e.target.value) || 0)}
                                    required
                                />
                                <span>m</span>
                            </div>
                            {(editForm.errors.duration_hour || editForm.errors.duration_minute || editForm.errors.duration) &&
                                <p className="text-sm text-destructive mt-1">
                                    {editForm.errors.duration_hour || editForm.errors.duration_minute || editForm.errors.duration || 'Invalid duration'}
                                </p>}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
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
                            Are you sure you want to delete the service "{currentService?.service_name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteForm.processing}>
                            {deleteForm.processing ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </ResubmitForm>
    )
}

export default ShopServices