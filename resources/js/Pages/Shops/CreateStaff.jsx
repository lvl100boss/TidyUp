import ShopsLayout from "@/Layouts/ShopsLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
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

    const [passwordStrength, setPasswordStrength] = useState("");
    const [objectURL, setObjectURL] = useState(null);

    useEffect(() => {
        if (data.profile_photo_path) {
            const newObjectURL = URL.createObjectURL(data.profile_photo_path);
            setObjectURL(newObjectURL);
            return () => URL.revokeObjectURL(newObjectURL);
        }
    }, [data.profile_photo_path]);
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const checkPasswordStrength = (password) => {
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8;

        const conditions = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough];
        const metConditions = conditions.filter(Boolean).length;

        if (password.length === 0) return "";
        if (metConditions === 5) return "strong";
        if (metConditions >= 4) return "good";
        if (metConditions >= 3) return "moderate";
        return "weak";
    };

    const getStrengthColor = (strength) => {
        switch (strength) {
            case "strong": return "bg-green-500";
            case "good": return "bg-blue-500";
            case "moderate": return "bg-yellow-500";
            case "weak": return "bg-red-500";
            default: return "bg-gray-200";
        }
    };

    useEffect(() => {
        setPasswordStrength(checkPasswordStrength(data.password));
        setPasswordsMatch(
            data.password !== "" &&
            data.password_confirmation !== "" &&
            data.password === data.password_confirmation
        );
    }, [data.password, data.password_confirmation]);

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
                passwordStrength={passwordStrength}
                passwordsMatch={passwordsMatch}
                getStrengthColor={getStrengthColor}
                handleSubmit={handleSubmit}
            />
        </ShopsLayout>
    );
}