import ShopsLayout from "@/Layouts/ShopsLayout";
import { Button, buttonVariants } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Head, Link, usePage } from "@inertiajs/react";
import { Terminal, EllipsisVertical } from "lucide-react"
import { useEffect, useState } from "react";
import { FlashMessage } from "@/Components/FlashMessage"
import ViewInfoModal from "@/Components/Shop/ManageStaff.jsx/ViewInfoModal";
import DeleteStaffModal from "@/Components/Shop/ManageStaff.jsx/DeleteStaffModal";

export default function ManageStaff({ staffs, shop, isOwner }) {
    const { flash } = usePage().props;
    const [flashMsg, setFlashMsg] = useState(flash.message);
    const [flashSuccess, setFlashSuccess] = useState(flash.success);
    useEffect(() => {
        if (flash.message) {
            setFlashMsg(flash.message);
            setFlashSuccess(flash.success);
            const timer = setTimeout(() => setFlashMsg(""), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash.message, flash.success]);

    return (
        <ShopsLayout>
            <Head title="Manage Staff" />
            <FlashMessage message={flashMsg} success={flashSuccess} />
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Manage Staff</h1>
                    <Link
                        href="/shop/manage/staff/create"
                        className={`flex items-center ${buttonVariants({ variant: "default", size: "sm", })}`}
                    >
                        Add New Staff
                    </Link>
                </div>
                <div>
                    <Table>
                        <TableCaption>List of {shop.name}'s Staffs </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staffs.map((member, index) => (
                                <TableRow key={member.staff_id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{`${member.staff.first_name} ${member.staff.last_name}`}</TableCell>
                                    <TableCell>{member.role[0].toUpperCase() + member.role.slice(1)}</TableCell>
                                    <TableCell>{member.position[0].toUpperCase() + member.position.slice(1)}</TableCell>
                                    <TableCell>{member.staff.email}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-sm figtree-semibold uppercase ${member.is_active
                                                ? "bg-green-400 text-background"
                                                : "bg-secondary "
                                                }`}
                                        >
                                            {member.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Button variant="ghost" radius="round" size="icon">
                                                        <EllipsisVertical className="size-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <Dialog>
                                                        <DialogTrigger className="w-full" asChild>
                                                            <DropdownMenuItem
                                                                onSelect={(e) => { e.preventDefault() }}
                                                            >
                                                                View
                                                            </DropdownMenuItem>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle className="mb-3">Staff Info</DialogTitle>
                                                                <ViewInfoModal staff={member} />
                                                            </DialogHeader>
                                                        </DialogContent>
                                                    </Dialog>
                                                    {member.position === 'owner'
                                                        ? (
                                                            isOwner
                                                                ? <Link
                                                                    href={`/shop/manage/staff/${member.staff_id}/edit`}>
                                                                    <DropdownMenuItem>
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                :
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <DropdownMenuItem
                                                                                disabled
                                                                            >
                                                                                Edit
                                                                            </DropdownMenuItem>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Only the Owner can edit this info.</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>

                                                        )
                                                        : (
                                                            <Link
                                                                href={`/shop/manage/staff/${member.staff_id}/edit`}
                                                            >
                                                                <DropdownMenuItem className="">
                                                                    Edit
                                                                </DropdownMenuItem>
                                                            </Link>
                                                        )
                                                    }

                                                    <DeleteStaffModal
                                                        staff={member}
                                                        shopId={shop.id}
                                                        trigger={
                                                            <DropdownMenuItem
                                                                onSelect={(e) => { e.preventDefault() }}
                                                            >
                                                                <span className="text-red-500 group-hover:text-red-500">Delete</span>
                                                            </DropdownMenuItem>
                                                        }
                                                    />
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </ShopsLayout >
    );
}
