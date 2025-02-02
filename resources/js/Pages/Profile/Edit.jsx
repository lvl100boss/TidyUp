import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import UserLayout from "@/Layouts/UserLayout";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <UserLayout>
            <Head title="Profile" />

            <div className="py-12">
                <div className=" max-w-7xl space-y-6">
                    <div className="p-4">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
