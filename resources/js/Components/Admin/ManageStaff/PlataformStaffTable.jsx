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
import ViewInfoModal from "@/Components/Admin/ManageStaff/PlatformViewInfoModal";
import DeleteStaffModal from "@/Components/Admin/ManageStaff/PlatformDeleteStaffModal";

const PlatformStaffTable = ({ staffs = [], isAdmin }) => {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [positionFilter, setPositionFilter] = useState("all");

    const uniquePositions = useMemo(() => {
        // Add null check for staffs
        if (!staffs || staffs.length === 0) return [];
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
                        {member.user.profile_photo_path ? (
                            <img src={`/storage/${member.user.profile_photo_path}`} className="size-20 object-cover rounded-md" alt=""/>
                        ) : (
                            <div className="size-20 bg-secondary rounded-md flex items-center justify-center">
                                <span className="text-2xl font-bold">{member.user.first_name[0] + member.user.last_name[0]}</span>
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
                return <div>{`${member.user.first_name} ${member.user.last_name}`}</div>;
            },
            accessorFn: (row) => `${row.user.first_name} ${row.user.last_name}`,
        },
        {
            accessorKey: "position",
            header: "Position",
            cell: ({ row }) => {
                const position = row.original.position;
                return <div>{position[0].toUpperCase() + position.slice(1)}</div>;
            },
            accessorFn: (row) => row.position,
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div>{row.original.user.email}</div>,
            accessorFn: (row) => row.user.email,
        },
        {
            accessorKey: "contact",
            header: "Contact Number",
            cell: ({ row }) => <div>{row.original.user.contact_number}</div>,
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
                                <Link
                                    href={`/admin/platform-staff/${member.id}/edit`}
                                >
                                    <DropdownMenuItem className="">
                                        Edit
                                    </DropdownMenuItem>
                                </Link>
                                {isAdmin && (
                                    <DeleteStaffModal
                                        staff={member}
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
        table.getColumn("position")?.setFilterValue("");
    };

    return (
        <div>
            <div className="flex items-center justify-between py-4 gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
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
                    {positionFilter !== "all" && (
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

export default PlatformStaffTable;