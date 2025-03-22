import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/Components/ui/alert-dialog";

export default function SubscriptionList({ subscriptions, onEdit, onDelete }) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);

    const handleDeleteClick = (subscription) => {
        setSelectedSubscription(subscription);
        setIsAlertOpen(true);
    };

    const confirmDelete = () => {
        if (selectedSubscription) {
            onDelete(selectedSubscription.id);
        }
        setIsAlertOpen(false);
        setSelectedSubscription(null);
    };

    if (subscriptions.length === 0) {
        return (
            <div className="text-center py-10">
                <h3 className="text-lg font-semibold text-muted-foreground">
                    No subscription plans available.
                </h3>
                <p className="text-sm text-muted-foreground">
                    Add a new subscription plan to get started.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map((sub) => (
                    <Card key={sub.id} className="relative">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">{sub.tier}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Monthly Price:</span>
                                <span className="text-sm font-semibold">₱{sub.monthly_price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Yearly Price:</span>
                                <span className="text-sm font-semibold">₱{sub.yearly_price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Monthly Discount:</span>
                                <span className="text-sm font-semibold">{sub.monthly_discount}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Yearly Discount:</span>
                                <span className="text-sm font-semibold">{sub.yearly_discount}%</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(sub)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(sub)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the subscription plan{" "}
                            <strong>{selectedSubscription?.tier}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setIsAlertOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}