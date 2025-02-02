import UserLayout from "@/Layouts/UserLayout";
import { Head } from "@inertiajs/react";

export default function Popular() {
    return (
        <UserLayout>
            <Head title="Popular" />
            <h1 className="">This is Popular Page</h1>
        </UserLayout>
    );
}
