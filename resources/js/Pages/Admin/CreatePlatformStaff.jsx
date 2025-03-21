import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import PlatformStaffForm from "@/Components/Admin/ManageStaff/PlatformStaffForm";
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

export default function CreatePlatformStaff({ isAdmin }) {
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

    const { data, setData, post, processing, errors } = useForm({
        position: "",
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        is_active: "1",
        profile_photo_path: null,
        contact_number: "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        console.log("Submitting form with data:", data); // Add logging to check data
        // Use route helper to ensure correct URL
        post(route('admin.platform-staff.store'), {
            onError: (errors) => {
                console.error("Form submission errors:", errors);
            }
        });
    }

    return (
        <AdminLayout>
            <Head title="Create Platform Staff" />
            <Toaster richColors />
            <div className="max-w-screen-lg mx-auto">
                <PlatformStaffForm
                    isAdmin={isAdmin}
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    create
                />
            </div>
        </AdminLayout>
    );
}
