import { buttonVariants } from "@/Components/ui/button";
import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { AtSign } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function Explore() {
    return (
        <UserLayout>
            <Head title="Explore" />
            <h1 className="">This is Explore Page</h1>
        </UserLayout>
    );
}
