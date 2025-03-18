import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, EllipsisVertical, Calendar as CalendarIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { addDays, differenceInDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { router } from "@inertiajs/react";

const RestrictModal = ({ isOpen, onClose, user }) => {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(addDays(new Date(), 7));
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setReason("");
            setStartDate(new Date());
            setEndDate(addDays(new Date(), 7));
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleRestrict = async () => {
        try {
            setIsSubmitting(true);
            await window.axios.post(route('admin.users.restrict'), {
                user_id: user.id,
                reason: reason,
                duration: differenceInDays(endDate, startDate),
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString()
            });
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
            // ...existing error handling...
        } finally {
            setIsSubmitting(false);
        }
    };

    const durationSection = (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="text-sm font-medium">Full Name:</p>
                <Input value={`${user.first_name} ${user.last_name}`} disabled />
            </div>
            <div className="space-y-2">
                <p className="text-sm font-medium">Duration:</p>
                <div className="relative" ref={calendarRef}>
                    <Input 
                        value={`${differenceInDays(endDate, startDate)} days`}
                        disabled 
                        className="pr-10"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setShowCalendar(!showCalendar)}
                    >
                        <CalendarIcon className="h-4 w-4" />
                    </Button>
                    
                    {showCalendar && (
                        <div className="absolute right-0 mt-2 p-4 bg-background border rounded-lg shadow-lg z-50">
                            <div className="flex gap-4">
                                <div>
                                    <p className="text-sm font-medium mb-2">Start Date</p>
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={(date) => {
                                            if (date) {
                                                setStartDate(date);
                                                if (date >= endDate) {
                                                    setEndDate(addDays(date, 1));
                                                }
                                            }
                                        }}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium mb-2">End Date</p>
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={(date) => date && setEndDate(date)}
                                        disabled={(date) => date <= startDate}
                                        initialFocus
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setShowCalendar(false)}
                                >
                                    Done
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    From {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                </p>
            </div>
        </div>
    );

    return (
        <Dialog 
            open={isOpen} 
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DialogContent className="max-w-lg p-6">
                <DialogHeader>
                    <DialogTitle>User Restriction</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium">Username:</p>
                            <Input value={user.username} disabled />
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                Date Restricted:
                            </p>
                            <Input
                                value={new Date().toLocaleDateString()}
                                disabled
                            />
                        </div>
                    </div>

                    {durationSection}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium">Email:</p>
                            <Input value={user.email} disabled />
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                Restricted By:
                            </p>
                            <Input value="Admin" disabled />
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium">Role:</p>
                        <Input value="User" disabled />
                    </div>

                    <div>
                        <p className="text-sm font-medium">
                            Reason for Restriction:
                        </p>
                        <Textarea
                            placeholder="Enter the reason..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button 
                            variant="outline" 
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>

                        <Button 
                            className="bg-red-500 text-foreground" 
                            onClick={handleRestrict}
                            disabled={!reason || isSubmitting}
                        >
                            {isSubmitting ? 'Restricting...' : 'Restrict User'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default function Users({ users, links }) {  // Add links prop
    const [data, setData] = useState(users);  // Initialize with backend data
    const [searchTerm, setSearchTerm] = useState("");
    const [isRestrictModalOpen, setIsRestrictModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [dateRange, setDateRange] = useState({
        from: null,
        to: null
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDateFilter = (range) => {
        // Validate the date range
        if (range.from && range.to && range.to < range.from) {
            // If end date is before start date, adjust it
            range.to = range.from;
        }
        
        setDateRange(range);
        
        const filteredData = users.filter(user => {
            if (!range.from && !range.to) return true;
            
            const userDate = new Date(user.dateRegistered);
            if (range.from && range.to) {
                return userDate >= range.from && userDate <= range.to;
            } else if (range.from) {
                return userDate >= range.from;
            } else if (range.to) {
                return userDate <= range.to;
            }
            return true;
        });
        setData(filteredData);
    };

    const formatDateRange = () => {
        if (!dateRange.from && !dateRange.to) return "Filter by Date";
        if (dateRange.from && dateRange.to) {
            return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
        }
        return dateRange.from ? 
            `From ${dateRange.from.toLocaleDateString()}` : 
            `Until ${dateRange.to.toLocaleDateString()}`;
    };

    // Modified search functionality with date filtering
    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            setData(users);
        } else {
            const filteredData = users.filter(item => {
                // Special handling for date
                const dateMatch = item.dateRegistered?.toLowerCase().includes(term);
                
                // Check other fields
                const otherFieldsMatch = ["username", "first_name", "last_name", "email"]
                    .some(field => item[field]?.toLowerCase().includes(term));

                return dateMatch || otherFieldsMatch;
            });
            setData(filteredData);
        }
    };

    const handleRestrictUser = (user) => {
        // Ensure we set the user first before opening the modal
        setSelectedUser(user);
        setTimeout(() => {
            setIsRestrictModalOpen(true);
        }, 0);
    };

    const handleCloseRestrictModal = () => {
        setIsRestrictModalOpen(false);
        setTimeout(() => {
            setSelectedUser(null);
        }, 100); // Give time for modal animation
    };

    const handleReset = () => {
        setSearchTerm("");
        setDateRange({ from: null, to: null });
        setData(users);
    };

    return (
        <AdminLayout>
            <Head title="Users" />
            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold">User Management</h1>

                <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search for a User"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-8"
                        />
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[250px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formatDateRange()}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <div className="flex gap-4 p-3">
                                <div>
                                    <p className="text-sm font-medium mb-2">From</p>
                                    <Calendar
                                        mode="single"
                                        selected={dateRange.from}
                                        onSelect={(date) => handleDateFilter({ ...dateRange, from: date })}
                                        disabled={(date) => date > new Date()} // Prevent future dates
                                        initialFocus
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium mb-2">To</p>
                                    <Calendar
                                        mode="single"
                                        selected={dateRange.to}
                                        onSelect={(date) => handleDateFilter({ ...dateRange, to: date })}
                                        disabled={(date) => 
                                          (dateRange.from && date < dateRange.from) || // Prevent dates before start date
                                          date > new Date() // Prevent future dates
                                        }
                                        initialFocus
                                    />
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button 
                        variant="outline" 
                        onClick={handleReset}
                        className="px-4"
                    >
                        Reset
                    </Button>
                </div>

                <div className="border rounded-md">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-background">
                            <tr>
                                {[
                                    "No.",
                                    "Username",
                                    "First Name",
                                    "Last Name",
                                    "Email",
                                    "Date Registered",
                                    "Actions",
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-background divide-y divide-border">
                            {paginatedData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-secondary/50 hover:text-foreground"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        {((currentPage - 1) * itemsPerPage) + index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        {row.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        {row.first_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        {row.last_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        {row.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        {row.dateRegistered}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button
                                                    variant="ghost"
                                                    radius="round"
                                                    size="icon"
                                                >
                                                    <EllipsisVertical />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleRestrictUser(row)
                                                    }
                                                >
                                                    Restrict
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Ban
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add pagination controls */}
                <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </Button>
                    ))}
                </div>
            </div>

            {selectedUser && (
                <RestrictModal
                    isOpen={isRestrictModalOpen}
                    onClose={handleCloseRestrictModal}
                    user={selectedUser}
                />
            )}
        </AdminLayout>
    );
}
