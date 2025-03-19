import React, { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { toast } from "sonner";
import {
    Package,
    Plus,
    Pencil,
    Trash2,
    AlertCircle,
    Search,
    Loader2,
} from "lucide-react";

export default function Subscription({ subscriptions = [], success = null, error = null }) {
    const { flash } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    const [localSubscriptions, setLocalSubscriptions] = useState(subscriptions);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        description: "",
        price: "",
        duration: "1",
        duration_unit: "months",
        status: "active",
    });

    // Update local subscriptions when props change
    useEffect(() => {
        setLocalSubscriptions(subscriptions);
    }, [subscriptions]);

    // Check for flash subscription updates
    useEffect(() => {
        if (flash && flash.subscriptions) {
            setLocalSubscriptions(flash.subscriptions);
        }
    }, [flash]);

    useEffect(() => {
        if (success) {
            toast.success(success);
        }
        if (error) {
            toast.error(error);
        }
        setIsLoading(false);
    }, [success, error]);

    const filteredSubscriptions = localSubscriptions.filter((plan) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            !searchQuery ||
            plan.name.toLowerCase().includes(searchLower) ||
            plan.description.toLowerCase().includes(searchLower) ||
            plan.price.toString().includes(searchLower)
        );
    });

    const handleAddPlan = () => {
        setIsLoading(true);
        post(route("admin.subscriptions.store"), {
            onSuccess: (response) => {
                setIsAddDialogOpen(false);
                reset();
                // If response contains fresh data, update it
                if (response && response.props && response.props.subscriptions) {
                    setLocalSubscriptions(response.props.subscriptions);
                }
            },
            onFinish: () => setIsLoading(false)
        });
    };

    const handleEditPlan = () => {
        setIsLoading(true);
        router.put(route("admin.subscriptions.update", selectedPlan.id), data, {
            onSuccess: (response) => {
                setIsEditDialogOpen(false);
                setSelectedPlan(null);
                // If response contains fresh data, update it
                if (response && response.props && response.props.subscriptions) {
                    setLocalSubscriptions(response.props.subscriptions);
                }
            },
            onFinish: () => setIsLoading(false)
        });
    };

    const handleDeletePlan = () => {
        setIsLoading(true);
        router.delete(route("admin.subscriptions.destroy", selectedPlan.id), {
            onSuccess: (response) => {
                setIsDeleteAlertOpen(false);
                setSelectedPlan(null);
                // If response contains fresh data, update it
                if (response && response.props && response.props.subscriptions) {
                    setLocalSubscriptions(response.props.subscriptions);
                }
            },
            onFinish: () => setIsLoading(false)
        });
    };

    const openEditDialog = (plan) => {
        setSelectedPlan(plan);
        setData({
            name: plan.name,
            description: plan.description,
            price: plan.price,
            duration: plan.duration.toString(),
            duration_unit: plan.duration_unit,
            status: plan.status,
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteAlert = (plan) => {
        setSelectedPlan(plan);
        setIsDeleteAlertOpen(true);
    };

    const formatDuration = (duration, unit) => {
        if (duration === 1) {
            return `1 ${unit.slice(0, -1)}`;
        }
        return `${duration} ${unit}`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    return (
        <AdminLayout>
            <Head title="Subscription Plans" />

            <div className="container py-8 mx-auto">
                <div className="flex flex-col space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Subscription Plans</h1>
                        <div className="flex items-center gap-4">
                            <div className="relative w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search plans..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                            <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add Plan
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                               Create New Plans
                            </CardTitle>
                            <CardDescription>
                                Manage all subscription plans available on the platform.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : filteredSubscriptions.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSubscriptions.map((plan) => (
                                            <TableRow key={plan.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{plan.name}</p>
                                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                                            {plan.description}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{formatCurrency(plan.price)}</TableCell>
                                                <TableCell>
                                                    {formatDuration(plan.duration, plan.duration_unit)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            plan.status === "active"
                                                                ? "success"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {plan.status === "active" ? "Active" : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditDialog(plan)}
                                                            title="Edit"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDeleteAlert(plan)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Package className="h-12 w-12 text-muted-foreground/60 mb-3" />
                                    <h3 className="font-medium text-lg">No subscription plans found</h3>
                                    <p className="text-muted-foreground mt-1">
                                        {searchQuery
                                            ? "Try adjusting your search term"
                                            : "Create your first subscription plan to get started"}
                                    </p>
                                    {searchQuery && (
                                        <Button
                                            variant="link"
                                            onClick={() => setSearchQuery("")}
                                            className="mt-2"
                                        >
                                            Clear search
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Add Plan Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add New Subscription Plan</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Plan Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Monthly Plan"
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name}</p>
                            )}
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                placeholder="Monthly subscription plan for starting "
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (PHP)</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData("price", e.target.value)}
                                placeholder="100.00"
                            />
                            {errors.price && (
                                <p className="text-sm text-destructive">{errors.price}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    min="1"
                                    value={data.duration}
                                    onChange={(e) => setData("duration", e.target.value)}
                                    placeholder="30"
                                />
                                {errors.duration && (
                                    <p className="text-sm text-destructive">{errors.duration}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="duration_unit">Unit</Label>
                                <Select 
                                    value={data.duration_unit} 
                                    onValueChange={(value) => setData("duration_unit", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="days">Days</SelectItem>
                                        <SelectItem value="months">Months</SelectItem>
                                        <SelectItem value="years">Years</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.duration_unit && (
                                    <p className="text-sm text-destructive">{errors.duration_unit}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select 
                                value={data.status} 
                                onValueChange={(value) => setData("status", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">{errors.status}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setIsAddDialogOpen(false);
                                reset();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleAddPlan} 
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Plan"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Plan Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Subscription Plan</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Plan Name</Label>
                            <Input
                                id="edit-name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name}</p>
                            )}
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-price">Price (PHP)</Label>
                            <Input
                                id="edit-price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData("price", e.target.value)}
                            />
                            {errors.price && (
                                <p className="text-sm text-destructive">{errors.price}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-duration">Duration</Label>
                                <Input
                                    id="edit-duration"
                                    type="number"
                                    min="1"
                                    value={data.duration}
                                    onChange={(e) => setData("duration", e.target.value)}
                                />
                                {errors.duration && (
                                    <p className="text-sm text-destructive">{errors.duration}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-duration_unit">Unit</Label>
                                <Select 
                                    value={data.duration_unit} 
                                    onValueChange={(value) => setData("duration_unit", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="days">Days</SelectItem>
                                        <SelectItem value="months">Months</SelectItem>
                                        <SelectItem value="years">Years</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.duration_unit && (
                                    <p className="text-sm text-destructive">{errors.duration_unit}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select 
                                value={data.status} 
                                onValueChange={(value) => setData("status", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">{errors.status}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setIsEditDialogOpen(false);
                                setSelectedPlan(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleEditPlan} 
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            Delete Subscription Plan
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the "{selectedPlan?.name}" plan? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setIsDeleteAlertOpen(false);
                                setSelectedPlan(null);
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDeletePlan}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}