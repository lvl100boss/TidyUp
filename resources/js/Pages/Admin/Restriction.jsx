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
import { Card } from "@/components/ui/card";
import axios from 'axios';

export default function Restriction({ restrictedUsers }) {
    const [data, setData] = useState(restrictedUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleLiftRestriction = async (row) => {
        if (isSubmitting) return;
        setSelectedId(row.id);
        setIsSubmitting(true);
        
        try {
            await axios.post(route('admin.restrictions.lift'), {
                restriction_id: row.id
            });

            setData(data.filter(item => item.id !== row.id));
        } catch (error) {
            console.error('Error lifting restriction:', error);
        } finally {
            setIsSubmitting(false);
            setSelectedId(null);
        }
    };

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            setData(restrictedUsers);
        } else {
            const filteredData = restrictedUsers.filter(item =>
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
                </div>

                <div className="border rounded-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-background">
                            <tr>
                                {[
                                    { key: 'id', label: 'ID' },
                                    { key: 'username', label: 'Username' },
                                    { key: 'committedBy', label: 'Committed By' },
                                    { key: 'duration', label: 'Duration' },
                                    { key: 'dateRestricted', label: 'Date Restricted' },
                                    { key: 'action', label: 'Action' }
                                ].map((column) => (
                                    <th
                                        key={column.key}
                                        className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider"
                                    >
                                        {column.key !== 'action' ? (
                                            <button
                                                onClick={() => handleSort(column.key)}
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span>{column.label}</span>
                                                <ArrowUpDown className="h-4 w-4" />
                                            </button>
                                        ) : (
                                            column.label
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-background divide-y divide-border">
                            {data.map((row) => (
                                <tr key={row.id} className="hover:bg-secondary/50 hover:text-foreground">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.committedBy}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-red-500">{row.duration}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        {new Date(row.dateRestricted).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="secondary">
                                                    Lift Restriction
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>User Information</DialogTitle>
                                                    <DialogDescription>
                                                        Review the user's restriction details before lifting the restriction.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <Card className="p-4 space-y-4">
                                                    <div className="grid grid-cols-2 gap-2 text-sm w-full">
                                                        <div>
                                                            <p><strong>Username:</strong> {row.username}</p>
                                                            <p><strong>Full Name:</strong> {`${row.first_name} ${row.last_name}`}</p>
                                                            <p><strong>Email:</strong> {row.email}</p>
                                                        </div>
                                                        <div>
                                                            <p><strong>Date Restricted:</strong> {new Date(row.dateRestricted).toLocaleDateString()}</p>
                                                            <p><strong>Duration:</strong> <span className="text-red-500">{row.duration}</span></p>
                                                            <p><strong>Restricted by:</strong> {row.committedBy}</p>
                                                        </div>
                                                    </div>
                                                </Card>

                                                <div className="space-y-2">
                                                    <h3 className="font-semibold">Reason for Restriction</h3>
                                                    <div className="p-3 border rounded-lg bg-background text-sm">
                                                        {row.reason}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-2 mt-4">
                                                    <DialogTrigger asChild>
                                                        <Button variant="secondary">
                                                            Cancel
                                                        </Button>
                                                    </DialogTrigger>
                                                    <Button 
                                                        onClick={() => handleLiftRestriction(row)}
                                                        disabled={isSubmitting && selectedId === row.id}
                                                    >
                                                        {isSubmitting && selectedId === row.id ? 'Processing...' : 'Lift Restriction'}
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}