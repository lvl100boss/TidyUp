import ShopsLayout from "@/Layouts/ShopsLayout";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Head, Link, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react"
import { useEffect, useState } from "react";
import { toast, Toaster } from 'sonner';
import StaffTable from "@/Components/Shop/ManageStaff.jsx/StaffTable";

export default function ManageStaff({ staffs, shop, isOwner }) {
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
        <ShopsLayout>
            <Head title="Manage Staff" />
            <Toaster />
            <div>
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-semibold tracking-tight">Manage Staff</h1>
                    {isOwner && (
                        <Link
                            href="/shop/manage/staff/create"
                            className={`flex items-center font-bold ${buttonVariants({ variant: "default" })}`}
                        >
                            Add New Staff
                        </Link>
                    )}
                </div>
                <div>
                    <StaffTable staffs={staffs} isOwner={isOwner} shop={shop} />
                </div>
            </div>
        </ShopsLayout >
    );
}
