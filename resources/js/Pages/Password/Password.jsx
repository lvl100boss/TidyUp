import UserSettingsLayout from "@/Layouts/UserSettingsLayout";
import UpdatePasswordForm from "@/Pages/Profile/Partials/UpdatePasswordForm";
import { Head } from "@inertiajs/react";

export default function Theme() {
    return (
        <UserSettingsLayout>
            <Head title="Password" />
            <div className="min-h-screen">
                <UpdatePasswordForm className="max-w-xl" />
            </div>
        </UserSettingsLayout>
    );
}




