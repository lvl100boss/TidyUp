import AdminLayout from "@/Layouts/AdminLayout";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Head, Link, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react"
import { useEffect, useState } from "react";
import { toast, Toaster } from 'sonner';
import StaffTable from "@/Components/Admin/ManageStaff/PlataformStaffTable";

export default function PlatformStaff({ staffs, isAdmin }) {
    // Add console.log to debug isAdmin value
    console.log('isAdmin value:', isAdmin);
    
    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.message) {
            if (flash.success) {
                toast("Heads up!", {
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
    }, [flash.message]);

    return (
        <AdminLayout>
            <Head title="Manage Platform Staff" />
            <Toaster />
            <div>
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-semibold tracking-tight">Manage Platform Staff</h1>
                    {/* Use direct link to match route definition */}
                    <Link
                        href="/admin/platform-staff/create"
                        className={`flex items-center font-bold ${buttonVariants({ variant: "default" })}`}
                    >
                        <Plus className="mr-1" />
                        Add New Staff
                    </Link>
                </div>
                <div>
                    <PlatformStaffTable staffs={staffs || []} isAdmin={isAdmin} />
                </div>
            </div>
        </AdminLayout>
    );
}
