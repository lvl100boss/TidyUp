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
import ViewInfoModal from "@/Components/Shop/ManageStaff.jsx/ViewInfoModal";
import DeleteStaffModal from "@/Components/Shop/ManageStaff.jsx/DeleteStaffModal";
import { toast, Toaster } from 'sonner';

export default function ManageStaff({ staffs, shop, isOwner }) {
    const { flash } = usePage().props;
    useEffect(() => {
        if (flash.message) {
            if (flash.success) {
                toast("Heads up!", {
                    description: flash.message,
                    duration: 5000,
                });
            } else {
                toast.error("Uh oh! Something went wrong.", {
                    description: flash.message,
                    duration: 5000,
                });
            }
        }
    }, [flash.message]);

    return (
        <ShopsLayout>
            <Head title="Manage Staff" />
            <Toaster />
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Manage Staff</h1>
                    <Link
                        href="/shop/manage/staff/create"
                        className={`flex items-center font-bold ${buttonVariants({ variant: "default", size: "sm", })}`}
                    >
                        Add New Staff
                    </Link>
                </div>
                <div>
                    <Table>
                        <TableCaption>List of {shop.name}'s Staffs ({staffs.length}) </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Avatar</TableHead>
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
                                    <TableCell className>{index + 1}</TableCell>
                                    <TableCell>
                                        {member.staff.profile_photo_path ? (
                                            <img src={`/storage/${member.staff.profile_photo_path}`} className="size-20 object-cover rounded-md" />
                                        ) : (
                                            <div className="size-20 bg-secondary rounded-md flex items-center justify-center">
                                                <span className="text-2xl font-bold3q">{member.staff.first_name[0] + member.staff.last_name[0]}</span>
                                            </div>
                                        )}
                                    </TableCell>
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
                                                    {isOwner && (
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
                                                    )}
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
