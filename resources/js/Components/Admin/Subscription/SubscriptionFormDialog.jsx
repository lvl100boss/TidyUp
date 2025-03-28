import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function SubscriptionFormDialog({
    isOpen,
    onClose,
    formData,
    setFormData,
    onSave,
    isLoading,
}) {
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.tier || formData.tier.trim() === "") {
            newErrors.tier = "Tier name is required.";
        }
        if (!formData.monthly_price || isNaN(formData.monthly_price)) {
            newErrors.monthly_price = "Monthly price is required and must be a valid number.";
        }
        if (!formData.yearly_price || isNaN(formData.yearly_price)) {
            newErrors.yearly_price = "Yearly price is required and must be a valid number.";
        }
        if (!formData.status) {
            newErrors.status = "Status is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveClick = () => {
        if (validateForm()) {
            onSave();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {formData.id ? "Edit Subscription Plan" : "Add Subscription Plan"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="tier">Tier</Label>
                        <Input
                            id="tier"
                            value={formData.tier}
                            onChange={(e) =>
                                setFormData({ ...formData, tier: e.target.value })
                            }
                            placeholder="Enter tier name"
                        />
                        {errors.tier && (
                            <p className="text-sm text-destructive mt-1">{errors.tier}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="monthly_price">Monthly Price</Label>
                        <Input
                            id="monthly_price"
                            type="number"
                            value={formData.monthly_price}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    monthly_price: parseFloat(e.target.value) || "",
                                })
                            }
                            placeholder="Enter monthly price"
                        />
                        {errors.monthly_price && (
                            <p className="text-sm text-destructive mt-1">{errors.monthly_price}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="yearly_price">Yearly Price</Label>
                        <Input
                            id="yearly_price"
                            type="number"
                            value={formData.yearly_price}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    yearly_price: parseFloat(e.target.value) || "",
                                })
                            }
                            placeholder="Enter yearly price"
                        />
                        {errors.yearly_price && (
                            <p className="text-sm text-destructive mt-1">{errors.yearly_price}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="monthly_discount">Monthly Discount (%)</Label>
                        <Input
                            id="monthly_discount"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.monthly_discount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    monthly_discount: parseFloat(e.target.value) || 0,
                                })
                            }
                            placeholder="Enter monthly discount percentage"
                        />
                    </div>
                    <div>
                        <Label htmlFor="yearly_discount">Yearly Discount (%)</Label>
                        <Input
                            id="yearly_discount"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.yearly_discount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    yearly_discount: parseFloat(e.target.value) || 0,
                                })
                            }
                            placeholder="Enter yearly discount percentage"
                        />
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="text-sm text-destructive mt-1">{errors.status}</p>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={isLoading} onClick={handleSaveClick}>
                        {isLoading ? "Saving..." : "Save Plan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}