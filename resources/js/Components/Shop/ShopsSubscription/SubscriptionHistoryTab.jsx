import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

export default function SubscriptionHistoryTab({ subscriptionHistory }) {
    if (!subscriptionHistory.length) {
        return <p className="text-gray-500">No subscription history available.</p>;
    }

    // Helper function to format dates
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Plan</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subscriptionHistory.map((history) => (
                        <TableRow key={history.id}>
                            <TableCell>{history.subscription.tier}</TableCell>
                            <TableCell>{formatDate(history.start_date)}</TableCell>
                            <TableCell>{formatDate(history.end_date)}</TableCell>
                            <TableCell className="capitalize">{history.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}