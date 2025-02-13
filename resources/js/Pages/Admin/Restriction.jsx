import React, { useState } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export default function Restriction() {
    const initialData = [
        { id: '01', username: '@SubaruNatsuki', dateRestricted: '09/10/2024', duration: '7 days', committedBy: 'Emilia' },
        { id: '02', username: '@SubaruNatsuki', dateRestricted: '09/15/2024', duration: '7 days', committedBy: 'Rem' },
        { id: '03', username: '@SubaruNatsuki', dateRestricted: '09/22/2024', duration: '7 days', committedBy: 'Ram' },
        { id: '04', username: '@SubaruNatsuki', dateRestricted: '09/05/2024', duration: '7 days', committedBy: 'Beatrice' },
        { id: '05', username: '@SubaruNatsuki', dateRestricted: '09/12/2024', duration: '7 days', committedBy: 'Roswaal' },
        { id: '06', username: '@SubaruNatsuki', dateRestricted: '09/30/2024', duration: '7 days', committedBy: 'Echidna' },
        { id: '07', username: '@SubaruNatsuki', dateRestricted: '09/18/2024', duration: '7 days', committedBy: 'Garfiel' },
        { id: '08', username: '@SubaruNatsuki', dateRestricted: '09/25/2024', duration: '7 days', committedBy: 'Otto' },
    ];

    const [data, setData] = useState(initialData);
    const [selectedRestriction, setSelectedRestriction] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const openDialog = (restriction) => {
        setSelectedRestriction(restriction);
    };

    const handleLiftRestriction = () => {
        // Implement lift restriction logic here
        console.log(`Restriction lifted for row ${selectedRestriction.id}`);
        setData(data.filter(row => row.id !== selectedRestriction.id));
        setSelectedRestriction(null);
    };

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

    return (
        <AdminLayout>
            <Head title="Restriction" />
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Restricted Accounts</h1>

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
                    <Button variant="outline" size="sm">
                        Sort by
                    </Button>
                </div>

                <div className="border rounded-md overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {['ID', 'Username', 'Committed By', 'Duration', 'Date Restricted', 'Action'].map((header) => (
                                    <TableHead key={header} className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort(header.toLowerCase().replace(' ', ''))}
                                            className="flex items-center space-x-1 hover:text-gray-700"
                                        >
                                            <span>{header}</span>
                                            <ArrowUpDown className="h-4 w-4" />
                                        </button>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row, index) => (
                                <TableRow key={index} className="hover:bg-background hover:text-foreground transition-colors">
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.id}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.username}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.committedBy}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-red-500 text-sm">{row.duration}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.dateRestricted}</TableCell>
                                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button onClick={() => openDialog(row)} variant="secondary" className="inline-flex items-center gap-1 py-2 px-4 rounded-full shadow hover:shadow-md hover:scale-105 transition ease-in-out group">
                                                    <span className="text-sm">Lift Restriction</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>User Information</DialogTitle>
                                                    <DialogDescription>
                                                        This action cannot be undone. This will permanently delete your account
                                                        and remove your data from our servers.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <Card className="p-4 space-y-4">
                                                    <div className="flex items-center space-x-4">
                                                        {/* User Profile Image */}
                                                        <Avatar className="w-16 h-16">
                                                            <AvatarImage src="https://via.placeholder.com/150" alt="User Profile" />
                                                            <AvatarFallback>SN</AvatarFallback>
                                                        </Avatar>

                                                        {/* User Details */}
                                                        <div className="grid grid-cols-2 gap-2 text-sm w-full">
                                                            <div>
                                                                <p><strong>Username:</strong> {selectedRestriction?.username}</p>
                                                                <p><strong>Full Name:</strong> Subaru Natsuki</p>
                                                                <p><strong>Email:</strong> subaru@example.com</p>
                                                                <p><strong>Role:</strong> User</p>
                                                            </div>
                                                            <div>
                                                                <p><strong>Date Restricted:</strong> {selectedRestriction?.dateRestricted}</p>
                                                                <p><strong>Duration:</strong> <span className="text-red-500">{selectedRestriction?.duration}</span></p>
                                                                <p><strong>Restricted by:</strong> {selectedRestriction?.committedBy}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>

                                                {/* Restriction Reason */}
                                                <div className="space-y-2">
                                                    <h3 className="font-semibold">Reason for Restriction</h3>
                                                    <div className="p-3 border rounded-lg bg-gray-100 text-sm">
                                                        The user violated the rules and regulations of the app. We have determined that this user frequently cancels appointments and detected suspicious activities on his/her account.
                                                    </div>
                                                </div>

                                                {/* Lift Restriction Button */}
                                                <div className="flex justify-end gap-2 mt-4">
                                                    <Button onClick={() => setSelectedRestriction(null)} variant="secondary">Cancel</Button>
                                                    <Button onClick={handleLiftRestriction} variant="primary">Confirm</Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
}