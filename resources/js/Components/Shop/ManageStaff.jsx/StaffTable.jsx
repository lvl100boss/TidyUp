import { useState, useMemo } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/Components/ui/table";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ChevronDown, EllipsisVertical, X } from "lucide-react";
import { Link } from "@inertiajs/react";
import ViewInfoModal from "@/Components/Shop/ManageStaff.jsx/ViewInfoModal";
import DeleteStaffModal from "@/Components/Shop/ManageStaff.jsx/DeleteStaffModal";

const StaffTable = ({ staffs, shop, isOwner }) => {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [positionFilter, setPositionFilter] = useState("all");

    // Extract unique roles and positions for filter options
    const uniqueRoles = useMemo(() => {
        const roles = [...new Set(staffs.map(staff => staff.role))];
        return roles.sort();
    }, [staffs]);

    const uniquePositions = useMemo(() => {
        const positions = [...new Set(staffs.map(staff => staff.position))];
        return positions.sort();
    }, [staffs]);

    const columns = [
        {
            accessorKey: "index",
            header: "No.",
            cell: ({ row }) => <div>{row.index + 1}</div>,
        },
        {
            accessorKey: "avatar",
            header: "Avatar",
            cell: ({ row }) => {
                const member = row.original;
                return (
                    <>
                        {member.staff.profile_photo_path ? (
                            <img src={`/storage/${member.staff.profile_photo_path}`} className="size-20 object-cover rounded-md" />
                        ) : (
                            <div className="size-20 bg-secondary rounded-md flex items-center justify-center">
                                <span className="text-2xl font-bold">{member.staff.first_name[0] + member.staff.last_name[0]}</span>
                            </div>
                        )}
                    </>
                );
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const member = row.original;
                return <div>{`${member.staff.first_name} ${member.staff.last_name}`}</div>;
            },
            accessorFn: (row) => `${row.staff.first_name} ${row.staff.last_name}`,
        },
        {
            accessorKey: "role",
            header: "Role", // Fixed: Removed the button to avoid nesting button issue
            cell: ({ row }) => {
                const role = row.original.role;
                return <div>{role[0].toUpperCase() + role.slice(1)}</div>;
            },
            accessorFn: (row) => row.role,
        },
        {
            accessorKey: "position",
            header: "Position", // Fixed: Removed the button to avoid nesting button issue
            cell: ({ row }) => {
                const position = row.original.position;
                return <div>{position[0].toUpperCase() + position.slice(1)}</div>;
            },
            accessorFn: (row) => row.position,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div>{row.original.staff.email}</div>,
            accessorFn: (row) => row.staff.email,
        },
        {
            accessorKey: "contact",
            header: "Contact Number",
            cell: ({ row }) => <div>{row.original.staff.contact_number}</div>,
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const member = row.original;
                return (
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
                );
            },
            accessorFn: (row) => row.is_active ? "Active" : "Inactive",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const member = row.original;

                return (
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
                );
            },
        },
    ];

    const table = useReactTable({
        data: staffs,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
            globalFilter: searchTerm,
        },
        initialState: {
            pagination: { pageSize: 10 }
        },
    });

    // Apply role and position filters
    const handleRoleFilter = (value) => {
        setRoleFilter(value);
        if (value === "all") {
            table.getColumn("role")?.setFilterValue("");
        } else {
            table.getColumn("role")?.setFilterValue(value);
        }
    };

    const handlePositionFilter = (value) => {
        setPositionFilter(value);
        if (value === "all") {
            table.getColumn("position")?.setFilterValue("");
        } else {
            table.getColumn("position")?.setFilterValue(value);
        }
    };

    // Handle search by name or email
    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const clearFilters = () => {
        setRoleFilter("all");
        setPositionFilter("all");
        table.getColumn("role")?.setFilterValue("");
        table.getColumn("position")?.setFilterValue("");
    };

    return (
        <div>
            <div className="flex items-center justify-between py-4 gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                    <div>
                        <Select
                            value={roleFilter}
                            onValueChange={handleRoleFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All roles</SelectItem>
                                {uniqueRoles.map(role => (
                                    <SelectItem key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Select
                            value={positionFilter}
                            onValueChange={handlePositionFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by position" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All positions</SelectItem>
                                {uniquePositions.map(position => (
                                    <SelectItem key={position} value={position}>
                                        {position.charAt(0).toUpperCase() + position.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {(roleFilter !== "all" || positionFilter !== "all") && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={clearFilters}
                            className="mt-1"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(event) => handleSearch(event.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} of {staffs.length} staff members
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default StaffTable;