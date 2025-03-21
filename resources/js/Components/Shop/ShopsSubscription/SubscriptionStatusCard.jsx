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

    if (!currentSubscription) {
        return (
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>No Active Subscription</CardTitle>
                    <CardDescription>
                        You currently do not have an active subscription. Choose a plan below to get started.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="shadow-md border">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Current Subscription</CardTitle>
                <CardDescription className="text-gray-600">
                    You are subscribed to the <strong>{currentSubscription.subscription.tier}</strong> plan.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Start Date:</p>
                    <p className="text-sm font-medium">{formatDate(currentSubscription.start_date)}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">End Date:</p>
                    <p className="text-sm font-medium">{formatDate(currentSubscription.end_date)}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Billing Cycle:</p>
                    <Badge variant="outline" className="capitalize">
                        {currentSubscription.billing_cycle}
                    </Badge>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Status:</p>
                    <Badge variant="success" className="capitalize">
                        {currentSubscription.status}
                    </Badge>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button variant="destructive" onClick={onCancel}>
                    Cancel Subscription
                </Button>
            </CardFooter>
        </Card>
    );
}