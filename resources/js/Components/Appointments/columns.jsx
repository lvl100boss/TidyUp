import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";

// Helper function to format the duration
const formatDuration = (duration) => {
    if (!duration) return "N/A";
    let result = "";
    if (duration.hours > 0) {
        result += `${duration.hours}h `;
    }
    if (duration.minutes > 0) {
        result += `${duration.minutes}m`;
    }
    return result.trim() || "0m";
};

// Helper function to format services
const formatServices = (services) => {
    if (!services || services.length === 0) return "None";
    return services.map(service => service.name).join(", ");
};

// Format date helper function
const formatDate = (dateStr, timeStr) => {
    if (!dateStr) return "N/A";

    const date = new Date(`${dateStr}T${timeStr || '00:00:00'}`);

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Format time
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // hour '0' should be '12'
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${month}. ${day}, ${year} at ${hours}:${minutes}${ampm}`;
};

// Updated Status badge component with new color coding
const StatusBadge = ({ status }) => {
    const statusStyles = {
        upcoming: "border-blue-300/30 bg-blue-50/50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
        pending: "border-yellow-300/30 bg-yellow-50/50 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300",
        completed: "border-green-300/30 bg-green-50/50 text-green-800 dark:bg-green-950/50 dark:text-green-300",
        cancelled: "border-gray-300/30 bg-gray-50/50 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300",
        "no-show": "border-red-300/30 bg-red-50/50 text-red-800 dark:bg-red-950/50 dark:text-red-300",
        declined: "border-red-300/30 bg-red-50/50 text-red-800 dark:bg-red-950/50 dark:text-red-300",
        started: "border-indigo-300/30 bg-indigo-50/50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300",
        confirmed: "border-blue-300/30 bg-blue-50/50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
        rescheduled: "border-purple-300/30 bg-purple-50/50 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300",
    };

    return (
        <Badge className={cn("border", statusStyles[status] || "border-gray-300/30 bg-gray-50/50 text-gray-800")}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

// Status order for sorting (lower number = higher priority)
const statusOrder = {
    'upcoming': 1,
    'confirmed': 2,
    'pending': 3,
    'started': 4,
    'completed': 5,
    'rescheduled': 6,
    'declined': 7,
    'cancelled': 8,
    'no-show': 9
};

export const columns = [
    {
        id: "no",
        header: "No.",
        cell: ({ row }) => <div>{row.index + 1}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorFn: (row) => row.customer?.name || "N/A", // Use accessorFn for nested data
        id: "customer.name", // Keep id consistent for filtering
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Customer
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        filterFn: (row, id, value) => {
            const name = row.getValue(id);
            if (!name || !value) return true;
            return name.toLowerCase().includes(value.toLowerCase());
        },
    },
    {
        accessorFn: (row) => row.stylist?.name || "N/A", // Use accessorFn for nested data
        id: "stylist.name", // Keep id consistent for filtering
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stylist
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        filterFn: (row, id, value) => {
            const name = row.getValue(id);
            if (!name || !value || value.length === 0) return true;
            return value.includes(name);
        },
    },
    {
        // Use a timestamp for proper date sorting
        accessorFn: (row) => {
            const date = row.date;
            const time = row.time;
            if (!date) return null;
            return new Date(`${date}T${time || '00:00:00'}`).getTime();
        },
        id: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date & Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = row.original.date;
            const time = row.original.time;
            return <div>{formatDate(date, time)}</div>;
        },
        sortingFn: "datetime"
    },
    {
        // Use status order for proper status sorting
        accessorFn: (row) => statusOrder[row.status] || 999,
        id: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.original.status;
            return <StatusBadge status={status} />;
        },
        filterFn: (row, id, value) => {
            const status = row.original.status;
            if (!status || !value || value.length === 0) return true;
            return value.includes(status);
        },
    },
    {
        accessorKey: "services",
        header: "Services",
        cell: ({ row }) => {
            const services = row.original.services;
            return <div>{formatServices(services)}</div>;
        },
    },
    {
        accessorKey: "total_cost",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Cost
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const amount = row.getValue("total_cost");
            return <div>${amount.toFixed(2)}</div>;
        },
    },
    {
        accessorKey: "total_duration",
        header: "Duration",
        cell: ({ row }) => {
            const duration = row.getValue("total_duration");
            return <div>{formatDuration(duration)}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const appointment = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(appointment.id.toString())}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
