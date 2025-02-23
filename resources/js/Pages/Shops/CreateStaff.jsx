import ShopsLayout from "@/Layouts/ShopsLayout";
import { Head, useForm } from "@inertiajs/react";
import StaffForm from "@/Components/Shop/ManageStaff.jsx/StaffForm";


export default function CreateStaff({ isOwner }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        role: "",
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
        post(route("shop.manage.staff.store"));
    }


    return (
        <ShopsLayout>
            <Head title="Create Staff Account" />
            <h1 className="text-2xl font-bold">Create Staff Account</h1>
            <StaffForm
                isOwner={isOwner}
                data={data}
                setData={setData}
                processing={processing}
                errors={errors}
                handleSubmit={handleSubmit}
                create
            />
        </ShopsLayout>
    );
}