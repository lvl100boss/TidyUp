import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search, EllipsisVertical } from "lucide-react";
import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const RestrictModal = ({ isOpen, onClose, user }) => {
    const [reason, setReason] = useState("");

    const handleRestrict = () => {
        console.log({
            username: user.username,
            fullName: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: "User",
            dateRestricted: new Date().toLocaleDateString(),
            duration: "7 Days",
            restrictedBy: "Admin",
            reason,
        });
        onClose();
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
                            <Input value="7 Days" disabled />
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
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button className="bg-red-500 text-white" onClick={handleRestrict}>
                            Restrict User
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default function Users() {
    const initialData = [
        { id: "01", username: "paulstyle", first_name: "Paul", last_name: "Phoenix", email: "paul@example.com", dateRegistered: "10/5/24", status: "Processing" },
        { id: "02", username: "gupitjohn", first_name: "John", last_name: "Doe", email: "john@example.com", dateRegistered: "10/5/24", status: "Verified" },
        { id: "03", username: "lindabeauty", first_name: "Linda", last_name: "Batumbakal", email: "linda@example.com", dateRegistered: "10/5/24", status: "Rejected" },
        // ... add more data as needed
    ];

    const [data, setData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isRestrictModalOpen, setIsRestrictModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Search functionality
    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            setData(initialData);
        } else {
            const filteredData = initialData.filter(item =>
                Object.values(item).some(value =>
                    value.toLowerCase().includes(term)
                )
            );
            setData(filteredData);
        }
    };

    // Sorting functionality
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