import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";

export default function SubscriptionStatusCard({ currentSubscription, onCancel }) {
    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Add a check here
    if (!currentSubscription) {
        return (
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>No Active Subscription</CardTitle>
                    <CardDescription>
                        You currently do not have an active subscription. Choose a plan below to get started.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>You do not have an active subscription.</p>
                </CardContent>
            </Card>
        );
    }

    const { subscription, start_date, end_date, billing_cycle, status } = currentSubscription;
    const formattedStartDate = formatDate(start_date);
    const formattedEndDate = formatDate(end_date);
    const isCancelled = status === "cancelled"; // Assuming 'cancelled' is the status string

    return (
        <Card className="shadow-md border">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Current Subscription</CardTitle>
                <CardDescription className="text-gray-600">
                    Your current plan details and status.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Plan:</p>
                    <p className="text-sm font-medium">{subscription?.tier || "N/A"} ({billing_cycle})</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Start Date:</p>
                    <p className="text-sm font-medium">{formattedStartDate}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">End Date:</p>
                    <p className="text-sm font-medium">{formattedEndDate}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Status:</p>
                    <Badge variant="success" className="capitalize">
                        {status}
                    </Badge>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                {!isCancelled && (
                    <Button variant="destructive" onClick={onCancel}>
                        Cancel Subscription
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}