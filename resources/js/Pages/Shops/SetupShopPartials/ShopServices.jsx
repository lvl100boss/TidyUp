import React, { useState, useCallback, useEffect } from 'react';
import ResubmitForm from '@/Components/ResubmitForm';
import { Button } from "@/Components/ui/button";
import { Plus } from 'lucide-react';
import { Toaster } from "@/Components/ui/sonner";
import { toast } from "sonner";

// Import extracted components
import ServiceItem from '@/Components/ShopSetup/ServiceItem';
import AddServiceDialog from '@/Components/ShopSetup/AddServiceDialog';
import EditServiceDialog from '@/Components/ShopSetup/EditServiceDialog';
import DeleteServiceDialog from '@/Components/ShopSetup/DeleteServiceDialog';
import EmptyServicesList from '@/Components/ShopSetup/EmptyServicesList';

const ShopServices = ({ data, setData, errors, serviceCategories }) => {
    // Dialog state controls
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    // Initialize services array in parent form if not present
    useEffect(() => {
        if (!data.shop_services) {
            setData('shop_services', []);
        }
    }, []);

    // --- Add Service ---
    const handleAdd = useCallback((formData) => {
        // Create a new service with a temporary ID
        const newService = {
            id: `temp-${Date.now()}`,
            service_name: formData.service_name,
            service_category_id: formData.service_category_id,
            cost: formData.cost,
            duration_hour: formData.duration_hour,
            duration_minute: formData.duration_minute,
            service_categories: serviceCategories.find(
                category => category.id.toString() === formData.service_category_id
            )
        };

        // Update the parent form state
        setData('shop_services', [...(data.shop_services || []), newService]);
        setIsAddDialogOpen(false);
        toast.success("Service added successfully");
    }, [serviceCategories, data.shop_services, setData]);

    // --- Edit Service ---
    const openEditDialog = useCallback((service) => {
        setCurrentService(service);
        setIsEditDialogOpen(true);
    }, []);

    const handleUpdate = useCallback((serviceId, formData) => {
        // Update the service in parent form state
        setData('shop_services', (data.shop_services || []).map(service =>
            service.id === serviceId
                ? {
                    ...service,
                    service_name: formData.service_name,
                    service_category_id: formData.service_category_id,
                    cost: formData.cost,
                    duration_hour: formData.duration_hour,
                    duration_minute: formData.duration_minute,
                    service_categories: serviceCategories.find(
                        category => category.id.toString() === formData.service_category_id
                    )
                }
                : service
        ));

        setIsEditDialogOpen(false);
        setCurrentService(null);
        toast.success("Service updated successfully");
    }, [serviceCategories, data.shop_services, setData]);

    // --- Delete Service ---
    const openDeleteDialog = useCallback((service) => {
        setCurrentService(service);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback((serviceId) => {
        // Remove the service from parent form state
        setData('shop_services', (data.shop_services || []).filter(service => service.id !== serviceId));
        setIsDeleteDialogOpen(false);
        setCurrentService(null);
        toast.success("Service removed successfully");
    }, [data.shop_services, setData]);

    return (
        <ResubmitForm
            title="Shop Services"
            icon="Scissors"
        >
            <div className="space-y-3 mt-4">
                {data.shop_services && data.shop_services.length > 0 ? (
                    data.shop_services.map((service) => (
                        <ServiceItem
                            key={service.id}
                            service={service}
                            onEdit={openEditDialog}
                            onDelete={openDeleteDialog}
                        />
                    ))
                ) : (
                    <EmptyServicesList />
                )}
            </div>

            {errors.shop_services && (
                <p className="text-red-500 text-xs mt-2">{errors.shop_services}</p>
            )}

            <div className="flex justify-end mt-4">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <Plus /> Add Service
                </Button>
            </div>

            {/* Dialogs */}
            <AddServiceDialog
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                serviceCategories={serviceCategories}
                onAdd={handleAdd}
            />

            <EditServiceDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                serviceCategories={serviceCategories}
                currentService={currentService}
                onUpdate={handleUpdate}
            />

            <DeleteServiceDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                currentService={currentService}
                onDelete={handleDeleteConfirm}
            />
        </ResubmitForm>
    );
};

export default ShopServices;
