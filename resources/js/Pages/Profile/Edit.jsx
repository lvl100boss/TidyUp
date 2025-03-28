import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import UserSettingsLayout from "@/Layouts/UserSettingsLayout";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <UserSettingsLayout>
            <Head title="Profile" />

            <div className="">
                <div className=" max-w-7xl space-y-6">
                    <div className="p-4">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </UserSettingsLayout>
    );
}
