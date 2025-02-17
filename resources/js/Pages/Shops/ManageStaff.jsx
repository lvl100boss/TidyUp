import ShopsLayout from "@/Layouts/ShopsLayout";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Head } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { router } from "@inertiajs/react";
import { useState } from "react";

const formSchema = z.object({
    first_name: z.string().min(2, { message: "First name is required" }),
    last_name: z.string().min(2, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    position: z.string().min(1, { message: "Position is required" }),
    title: z.string().min(1, { message: "Title is required" }),
});

export default function ManageStaff({ staffs }) {
    console.log(staffs);
    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            position: "",
            title: "",
        },
    });

    function onSubmit(values) {
        router.post(route("shop.manage.staff.store"), values, {
            onSuccess: () => {
                setOpen(false);
                form.reset();
            },
        });
    }

    return (
        <ShopsLayout>
            <Head title="Manage Staff" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Manage Staff</h1>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default">Add New Staff</Button>
                        </DialogTrigger>
                        <DialogContent className="">
                            <DialogHeader>
                                <DialogTitle>Add New Staff</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <FormField
                                        control={form.control}
                                        name="first_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    First Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter first name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="last_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter last name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="Enter email address"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="position"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Position</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select position" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="manager">
                                                            Manager
                                                        </SelectItem>
                                                        <SelectItem value="staff">
                                                            Staff
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter Title"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={
                                                form.formState.isSubmitting
                                            }
                                        >
                                            {form.formState.isSubmitting
                                                ? "Adding..."
                                                : "Add Staff"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staffs.map((member) => (
                                <TableRow key={member.staff_id}>
                                    <TableCell>{`${member.staff.first_name} ${member.staff.last_name}`}</TableCell>
                                    <TableCell>
                                        {member.role[0].toUpperCase() +
                                            member.role.slice(1)}
                                    </TableCell>
                                    <TableCell>
                                        {member.position[0].toUpperCase() +
                                            member.position.slice(1)}
                                    </TableCell>

                                    <TableCell>{member.staff.email}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-sm figtree-semibold uppercase ${
                                                member.is_active
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
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </ShopsLayout>
    );
}
