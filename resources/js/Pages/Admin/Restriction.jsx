import React, { useState } from 'react';
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default function Restriction() {
    const [rows, setRows] = useState([
        { id: '01', username: '@SubaruNatsuki', dateRestricted: '09/10/2024', duration: '7 days', committedBy: 'Emilia' },
        { id: '02', username: '@SubaruNatsuki', dateRestricted: '09/15/2024', duration: '7 days', committedBy: 'Rem' },
        { id: '03', username: '@SubaruNatsuki', dateRestricted: '09/22/2024', duration: '7 days', committedBy: 'Ram' },
        { id: '04', username: '@SubaruNatsuki', dateRestricted: '09/05/2024', duration: '7 days', committedBy: 'Beatrice' },
        { id: '05', username: '@SubaruNatsuki', dateRestricted: '09/12/2024', duration: '7 days', committedBy: 'Roswaal' },
        { id: '06', username: '@SubaruNatsuki', dateRestricted: '09/30/2024', duration: '7 days', committedBy: 'Echidna' },
        { id: '07', username: '@SubaruNatsuki', dateRestricted: '09/18/2024', duration: '7 days', committedBy: 'Garfiel' },
        { id: '08', username: '@SubaruNatsuki', dateRestricted: '09/25/2024', duration: '7 days', committedBy: 'Otto' },
    ]);

    const [selectedRestriction, setSelectedRestriction] = useState(null);

    const openDialog = (restriction) => {
        setSelectedRestriction(restriction);
    };

    const handleLiftRestriction = () => {
        // Implement lift restriction logic here
        console.log(`Restriction lifted for row ${selectedRestriction.id}`);
        setRows(rows.filter(row => row.id !== selectedRestriction.id));
        setSelectedRestriction(null);
    };

    return (
        <AdminLayout>
            <Head title="Restriction" />
            <div className="space-y-6 h-full">
                <Card className="bg-background text-foreground h-full">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Restricted Accounts</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <input type="search" placeholder="Search" className="h-10 w-11/12 py-1 pl-10 pr-2 rounded-full border-neutral-300 border-2 text-black" />
                            <button className="flex items-center gap-2 hover:bg-neutral-700 py-1 px-2 rounded-md text-foreground">
                                <svg className="stroke-1 stroke-foreground size-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 16L8 19M8 19L5 16M8 19V5M13 8L16 5M16 5L19 8M16 5V19" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-foreground">Sort by</span>
                            </button>
                        </div>
                        <div className="flex-grow overflow-auto">
                            <Table className="w-full min-w-full divide-y divide-background rounded-lg overflow-hidden shadow">
                                <TableHeader className="bg-background">
                                    <TableRow>
                                        <TableHead className="px-6 py-3 text-left text-base font-semibold text-foreground uppercase tracking-wider">ID</TableHead>
                                        <TableHead className="px-6 py-3 text-left text-base font-semibold text-foreground uppercase tracking-wider">Username</TableHead>
                                        <TableHead className="px-6 py-3 text-left text-base font-semibold text-foreground uppercase tracking-wider">Committed By</TableHead>
                                        <TableHead className="px-6 py-3 text-left text-base font-semibold text-foreground uppercase tracking-wider">Duration</TableHead>
                                        <TableHead className="px-6 py-3 text-left text-base font-semibold text-foreground uppercase tracking-wider">Date Restricted</TableHead>
                                        <TableHead className="px-6 py-3 text-left text-base font-semibold text-foreground uppercase tracking-wider">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="bg-background divide-y divide-background">
                                    {rows.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.id}</TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.username}</TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.committedBy}</TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-red-500 text-sm">{row.duration}</TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{row.dateRestricted}</TableCell>
                                            <TableCell className="px-6 py-4 whitespace-nowrap flex items-center justify-between gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button onClick={() => openDialog(row)} variant="secondary" className="inline-flex items-center gap-1 py-2 px-4 rounded-full shadow hover:shadow-md hover:scale-105 transition ease-in-out group">
                                                            <span className="text-sm">Lift Restriction</span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>User Information</DialogTitle>
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
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}