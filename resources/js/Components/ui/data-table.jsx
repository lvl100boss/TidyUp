import { useState, useEffect } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { X, FilterX } from "lucide-react";

export function DataTable({
    columns,
    data,
    statusOptions,
    stylistOptions,
}) {
    const [sorting, setSorting] = useState([{ id: "date", desc: true }]); // Default sort by date, newest first
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState([]);
    const [stylistFilter, setStylistFilter] = useState([]);

    // Apply filters to the table
    useEffect(() => {
        // Customer name filter
        if (searchQuery) {
            table.getColumn("customer.name")?.setFilterValue(searchQuery);
        }

        // Status filter
        if (statusFilter.length > 0) {
            table.getColumn("status")?.setFilterValue(statusFilter);
        }

        // Stylist filter
        if (stylistFilter.length > 0) {
            table.getColumn("stylist.name")?.setFilterValue(stylistFilter);
        }
    }, [searchQuery, statusFilter, stylistFilter]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: {
            pagination: {
                pageSize: 10,
            },
            sorting: [{ id: "date", desc: true }], // Default sort by date, newest first
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const resetFilters = () => {
        setColumnFilters([]);
        setSearchQuery("");
        setStatusFilter([]);
        setStylistFilter([]);
        table.getColumn("status")?.setFilterValue(undefined);
        table.getColumn("stylist.name")?.setFilterValue(undefined);
        table.getColumn("customer.name")?.setFilterValue(undefined);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        table.getColumn("customer.name")?.setFilterValue(value || undefined);
    };

    // Status filter handler
    const handleStatusFilterChange = (status, checked) => {
        if (checked) {
            const newFilter = [...statusFilter, status];
            setStatusFilter(newFilter);
            table.getColumn("status")?.setFilterValue(newFilter);
        } else {
            const newFilter = statusFilter.filter(s => s !== status);
            setStatusFilter(newFilter);
            table.getColumn("status")?.setFilterValue(newFilter.length ? newFilter : undefined);
        }
    };

    // Stylist filter handler
    const handleStylistFilterChange = (stylistName, checked) => {
        if (checked) {
            const newFilter = [...stylistFilter, stylistName];
            setStylistFilter(newFilter);
            table.getColumn("stylist.name")?.setFilterValue(newFilter);
        } else {
            const newFilter = stylistFilter.filter(s => s !== stylistName);
            setStylistFilter(newFilter);
            table.getColumn("stylist.name")?.setFilterValue(newFilter.length ? newFilter : undefined);
        }
    };

    // Function to check if any filter is active
    const hasActiveFilters = () => {
        return columnFilters.length > 0 || searchQuery || statusFilter.length > 0 || stylistFilter.length > 0;
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                <div className="flex flex-col md:flex-row md:items-center gap-3 flex-wrap">
                    <div className="relative max-w-sm">
                        <Input
                            placeholder="Search by customer..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pr-8"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    table.getColumn("customer.name")?.setFilterValue(undefined);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {statusOptions && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" >
                                    Filter by Status
                                    {statusFilter.length > 0 && <span className="ml-1">({statusFilter.length})</span>}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                {statusOptions.map((status) => (
                                    <DropdownMenuCheckboxItem
                                        key={status}
                                        checked={statusFilter.includes(status)}
                                        onCheckedChange={(value) => handleStatusFilterChange(status, value)}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {stylistOptions && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" >
                                    Filter by Stylist
                                    {stylistFilter.length > 0 && <span className="ml-1">({stylistFilter.length})</span>}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                {stylistOptions.map((stylist) => (
                                    <DropdownMenuCheckboxItem
                                        key={stylist.id}
                                        checked={stylistFilter.includes(stylist.name)}
                                        onCheckedChange={(value) => handleStylistFilterChange(stylist.name, value)}
                                    >
                                        {stylist.name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {hasActiveFilters() && (
                        <Button
                            variant="outline"
                            onClick={resetFilters}
                            className="h-9 px-2 lg:px-3"
                            size="sm"
                        >
                            <FilterX className="mr-1 h-4 w-4" />
                            Clear Filters
                        </Button>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
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
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2">
                <div className="text-sm text-muted-foreground">
                    Showing {table.getFilteredRowModel().rows.length} of {data.length} appointments
                </div>
                <div className="space-x-2">
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
