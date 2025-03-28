import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import axios from "axios"; // Make sure axios is imported
import SubscriptionHeader from "@/Components/Admin/Subscription/SubscriptionHeader";
import SubscriptionList from "@/Components/Admin/Subscription/SubscriptionList";
import SubscriptionFormDialog from "@/Components/Admin/Subscription/SubscriptionFormDialog";

export default function Subscription({ subscriptions: initialSubscriptions }) {
    const [localSubscriptions, setLocalSubscriptions] = useState(initialSubscriptions);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        tier: "",
        monthly_price: "",
        yearly_price: "",
        monthly_discount: "",
        yearly_discount: "",
        status: "active", // Add status field with default value
    });

    const resetForm = () => {
        setFormData({
            id: null,
            tier: "",
            monthly_price: "",
            yearly_price: "",
            monthly_discount: "",
            yearly_discount: "",
            status: "active", // Reset status to 'active' by default
        });
    };

    const handleSave = async () => {
        setIsLoading(true);

        try {
            const updatedFormData = {
                ...formData,
                monthly_discount: formData.monthly_discount || 0,
                yearly_discount: formData.yearly_discount || 0,
                status: formData.status || "active", // Ensure status is included
            };

            if (formData.id) {
                // Update existing subscription
                const response = await axios.put(`/admin/subscriptions/${formData.id}`, updatedFormData);
                setLocalSubscriptions((prev) =>
                    prev.map((sub) => (sub.id === formData.id ? response.data : sub))
                );
            } else {
                // Create new subscription
                const response = await axios.post("/admin/subscriptions", updatedFormData);
                setLocalSubscriptions((prev) => [...prev, response.data]);
            }

            setIsDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (subscription) => {
        setFormData(subscription);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/admin/subscriptions/${id}`);
            setLocalSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AdminLayout>
            <Head title="Subscription Management" />
            <div className="flex-1 space-y-6">
                <SubscriptionHeader onAddPlan={() => setIsDialogOpen(true)} />
                <SubscriptionList
                    subscriptions={localSubscriptions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <SubscriptionFormDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    formData={formData}
                    setFormData={setFormData}
                    onSave={handleSave}
                    isLoading={isLoading}
                />
            </div>
        </AdminLayout>
    );
}