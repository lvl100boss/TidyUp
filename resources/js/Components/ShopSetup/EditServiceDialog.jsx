import React, { useEffect, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { toast } from "sonner";

const EditServiceDialog = ({ isOpen, onOpenChange, serviceCategories, currentService, onUpdate }) => {
    const editForm = useForm({
        id: '',
        service_name: '',
        service_category_id: '',
        cost: '',
        duration_hour: 0,
        duration_minute: 0,
    });

    // Update form data when currentService changes
    useEffect(() => {
        if (currentService) {
            editForm.setData({
                id: currentService.id,
                service_name: currentService.service_name,
                service_category_id: String(currentService.service_category_id),
                cost: String(currentService.cost),
                duration_hour: currentService.duration_hour,
                duration_minute: currentService.duration_minute,
            });
        }
    }, [currentService]);

    // Check if any form values have changed from the original service
    const hasChanges = useMemo(() => {
        if (!currentService) return false;

        return (
            editForm.data.service_name !== currentService.service_name ||
            editForm.data.service_category_id !== String(currentService.service_category_id) ||
            editForm.data.cost !== String(currentService.cost) ||
            editForm.data.duration_hour !== currentService.duration_hour ||
            editForm.data.duration_minute !== currentService.duration_minute
        );
    }, [editForm.data, currentService]);

    // Check if all required fields are filled
    const isFormValid = useMemo(() => {
        return (
            editForm.data.service_name &&
            editForm.data.service_category_id &&
            editForm.data.cost &&
            (editForm.data.duration_hour > 0 || editForm.data.duration_minute > 0)
        );
    }, [editForm.data]);

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!currentService) return;

        // Validate form data
        if (!editForm.data.service_name || !editForm.data.service_category_id || !editForm.data.cost) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (editForm.data.duration_hour === 0 && editForm.data.duration_minute === 0) {
            toast.error("Duration cannot be zero");
            return;
        }

        // Call parent handler with form data
        onUpdate(currentService.id, editForm.data);

        // Reset form
        editForm.reset();
    };

    // Reset form when dialog is closed
    const handleOpenChange = (open) => {
        if (!open) editForm.reset();
        onOpenChange(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
                        {editForm.errors.service_name &&
                            <p className="text-sm text-destructive mt-1">{editForm.errors.service_name}</p>
                        }
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
                        {editForm.errors.service_category_id &&
                            <p className="text-sm text-destructive mt-1">{editForm.errors.service_category_id}</p>
                        }
                    </div>
                    <div>
                        <Label htmlFor="edit_cost">Price (₱)</Label>
                        <Input
                            id="edit_cost"
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            value={editForm.data.cost}
                            onChange={(e) => editForm.setData('cost', e.target.value)}
                            required
                        />
                        {editForm.errors.cost &&
                            <p className="text-sm text-destructive mt-1">{editForm.errors.cost}</p>
                        }
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
                            </p>
                        }
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={!hasChanges || !isFormValid}
                        >
                            Update Service
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditServiceDialog;
