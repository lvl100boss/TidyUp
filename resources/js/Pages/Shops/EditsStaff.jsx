import ShopsLayout from "@/Layouts/ShopsLayout";
import { Head, useForm } from "@inertiajs/react";
import StaffForm from "@/Components/Shop/ManageStaff.jsx/StaffForm";

export default function EditsStaff({ staff, isOwner }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        role: staff.role,
        position: staff.position,
        first_name: staff.first_name,
        last_name: staff.last_name,
        date_of_birth: staff.date_of_birth,
        gender: staff.gender,
        username: staff.username,
        email: staff.email,
        is_active: staff.is_active,
        profile_photo_path: null,
        contact_number: staff.contact_number,
        password: "",
        password_confirmation: "",
        _method: "PATCH",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PATCH");
        formData.append("role", data.role);
        formData.append("position", data.position);
        formData.append("first_name", data.first_name);
        formData.append("last_name", data.last_name);
        formData.append("date_of_birth", data.date_of_birth);
        formData.append("gender", data.gender);
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("is_active", data.is_active);
        formData.append("contact_number", data.contact_number);
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);

        if (data.profile_photo_path) {
            formData.append("profile_photo_path", data.profile_photo_path);
        } else {
            formData.append("profile_photo_path", null);
        }
        post(route("shop.manage.staff.update", staff.id), {
            preserveScroll: true,
            data: formData,
        });
    }

    return (
        <ShopsLayout>
            <Head title="Edit Staff Account" />
            <h1 className="text-2xl font-bold">Edit Staff Account</h1>
            <StaffForm
                isOwner={isOwner}
                data={data}
                setData={setData}
                processing={processing}
                errors={errors}
                handleSubmit={handleSubmit}
                staff={staff}
            />

        </ShopsLayout>
    );
}