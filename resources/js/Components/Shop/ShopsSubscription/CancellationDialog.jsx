import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Loader2 } from "lucide-react";

export default function CancellationDialog({ isOpen, onClose, onCancel, processing }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Cancel Your Subscription</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel your current subscription? You'll lose access to premium features at the end of your billing period.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Keep Subscription
                    </Button>
                    <Button variant="destructive" onClick={onCancel} disabled={processing}>
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelling...
                            </>
                        ) : (
                            "Yes, Cancel Subscription"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}