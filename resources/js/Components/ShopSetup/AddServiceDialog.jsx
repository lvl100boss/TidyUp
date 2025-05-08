import React, { useMemo } from 'react';
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

const AddServiceDialog = ({ isOpen, onOpenChange, serviceCategories, onAdd }) => {
    const addForm = useForm({
        service_name: '',
        service_category_id: '',
        cost: '',
        duration_hour: 0,
        duration_minute: 0,
    });

    // Check if form is valid and all required fields are filled
    const isFormValid = useMemo(() => {
        return (
            addForm.data.service_name &&
            addForm.data.service_category_id &&
            addForm.data.cost &&
            (addForm.data.duration_hour > 0 || addForm.data.duration_minute > 0)
        );
    }, [addForm.data]);

    const handleAdd = (e) => {
        e.preventDefault();

        // Validate form data
        if (!addForm.data.service_name || !addForm.data.service_category_id || !addForm.data.cost) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (addForm.data.duration_hour === 0 && addForm.data.duration_minute === 0) {
            toast.error("Duration cannot be zero");
            return;
        }

        // Call parent handler with form data
        onAdd(addForm.data);

        // Reset form
        addForm.reset();
    };

    // Reset form when dialog is closed
    const handleOpenChange = (open) => {
        if (!open) addForm.reset();
        onOpenChange(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
                            placeholder="Enter service name"
                            onChange={(e) => addForm.setData('service_name', e.target.value)}
                            required
                        />
                        {addForm.errors.service_name &&
                            <p className="text-sm text-destructive mt-1">{addForm.errors.service_name}</p>
                        }
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
                        {addForm.errors.service_category_id &&
                            <p className="text-sm text-destructive mt-1">{addForm.errors.service_category_id}</p>
                        }
                    </div>
                    <div>
                        <Label htmlFor="add_cost">Price (₱)</Label>
                        <Input
                            id="add_cost"
                            placeholder="Enter service price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={addForm.data.cost}
                            onChange={(e) => addForm.setData('cost', e.target.value)}
                            required
                        />
                        {addForm.errors.cost &&
                            <p className="text-sm text-destructive mt-1">{addForm.errors.cost}</p>
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
                            </p>
                        }
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={!isFormValid}>Add Service</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddServiceDialog;
