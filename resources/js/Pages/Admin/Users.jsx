import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, EllipsisVertical, Calendar as CalendarIcon } from "lucide-react";
import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { addDays, differenceInDays } from "date-fns";

const DurationCalendarModal = ({ open, onClose, onSelect, startDate, endDate }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] p-6"> {/* Increased max width */}
                <DialogHeader>
                    <DialogTitle>Select Restriction Duration</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6"> {/* Increased gap */}
                    <div className="grid grid-cols-2 gap-8"> {/* Increased gap between calendars */}
                        <div className="space-y-2"> {/* Added vertical spacing */}
                            <p className="text-sm font-medium">Start Date:</p>
                            <div className="p-3 border rounded-lg"> {/* Added padding and border */}
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(date) => onSelect(date, 'start')}
                                    disabled={(date) => date < new Date()}
                                    className="rounded-md"
                                    styles={{
                                        calendar: { width: '100%' },
                                        button: { width: '40px', height: '40px' } // Larger date buttons
                                    }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium">End Date:</p>
                            <div className="p-3 border rounded-lg">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={(date) => onSelect(date, 'end')}
                                    disabled={(date) => date <= startDate}
                                    className="rounded-md"
                                    styles={{
                                        calendar: { width: '100%' },
                                        button: { width: '40px', height: '40px' }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={onClose}>
                            Done
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const RestrictModal = ({ isOpen, onClose, user }) => {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(addDays(new Date(), 7));
    const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
    

    // Calculate duration whenever dates change
    const duration = differenceInDays(endDate, startDate);

    const handleDateSelect = (date, type) => {
        if (type === 'start') {
            setStartDate(date);
            if (date > endDate) {
                setEndDate(addDays(date, 1));
            }
        } else {
            setEndDate(date);
        }
    };

    const handleRestrict = () => {
        setIsSubmitting(true);

        window.axios.post(route('admin.users.restrict'), {
            user_id: user.id,
            reason: reason,
            duration: duration,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString()
        })
        .then((response) => {
            console.log('Success:', response);
            onClose();
            window.location.reload();
        })
        .catch((error) => {
            console.error('Full error details:', error);
            
            if (error.response) {
                if (error.response.data.errors) {
                    const errorMessages = Object.values(error.response.data.errors).flat();
                    alert('Validation errors:\n' + errorMessages.join('\n'));
                } else if (error.response.data.message) {
                    alert('Server error: ' + error.response.data.message);
                }
            } else if (error.request) {
                alert('Network error: Could not connect to server');
            } else {
                alert('Error: ' + error.message);
            }
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
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
                            <p className="text-sm font-medium">Date Restricted:</p>
                            <Input value={new Date().toLocaleDateString()} disabled />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium">Full Name:</p>
                            <Input value={`${user.first_name} ${user.last_name}`} disabled />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Duration:</p>
                            <div className="relative">
                                <Input 
                                    value={`${duration} days`}
                                    disabled 
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0"
                                    onClick={() => setIsDurationModalOpen(true)}
                                >
                                    <CalendarIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium">Email:</p>
                            <Input value={user.email} disabled />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Restricted By:</p>
                            <Input value="Admin" disabled />
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium">Role:</p>
                        <Input value="User" disabled />
                    </div>

                    <div>
                        <p className="text-sm font-medium">Reason for Restriction:</p>
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

            <DurationCalendarModal
                open={isDurationModalOpen}
                onClose={() => setIsDurationModalOpen(false)}
                onSelect={handleDateSelect}
                startDate={startDate}
                endDate={endDate}
            />
        </Dialog>
    );
};
export default function Users({ users }) {  // Accept users prop from backend
    const [data, setData] = useState(users);  // Initialize with backend data
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isRestrictModalOpen, setIsRestrictModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Search functionality
    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            setData(users);  // Reset to original data from backend
        } else {
            const filteredData = users.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(term)
                )
            );
            setData(filteredData);
        }
    };


    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });

        const sortedData = [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setData(sortedData);
    };

    const handleRestrictUser = (user) => {
        setSelectedUser(user);
        setIsRestrictModalOpen(true);
    };

    const handleCloseRestrictModal = () => {
        setIsRestrictModalOpen(false);
        setSelectedUser(null);
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
                    <Button variant="secondary">Search</Button>
                </div>

                <div className="border rounded-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-background">
                            <tr>
                                {['ID', 'Username', 'First Name', 'Last Name', 'Email', 'Date Registered', 'Action'].map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider"
                                    >
                                        <button
                                            onClick={() => handleSort(header.toLowerCase().replace(' ', ''))}
                                            className="flex items-center space-x-1 hover:text-gray-700"
                                        >
                                            <span>{header}</span>
                                            <ArrowUpDown className="h-4 w-4" />
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-background divide-y divide-border">
                            {data.map((row, index) => (
                                <tr key={index} className="hover:bg-secondary/50 hover:text-foreground">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.first_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.last_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.dateRegistered}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button
                                                    variant="ghost"
                                                    radius="round"
                                                    size="icon">
                                                    <EllipsisVertical />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleRestrictUser(row)}>Restrict</DropdownMenuItem>
                                                <DropdownMenuItem>Ban</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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