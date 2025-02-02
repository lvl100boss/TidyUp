import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <h1 className="text-2xl figtree-medium">Dashboard</h1>
        </AdminLayout>
    );
}
