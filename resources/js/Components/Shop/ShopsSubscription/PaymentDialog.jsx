import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";

export default function PaymentDialog({ isOpen, onClose, selectedPlan, data, setData, onPayment, processing }) {
    if (!selectedPlan) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Subscribe to {selectedPlan.tier}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Select your billing cycle for the <strong>{selectedPlan.tier}</strong> plan.
                    </p>
                    <RadioGroup
                        value={data.billing_cycle}
                        onValueChange={(value) => setData("billing_cycle", value)} // Update billing cycle dynamically
                        className="space-y-2"
                    >
                        {/* Monthly Option */}
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="monthly" id="monthly" />
                            <label htmlFor="monthly" className="text-sm">
                                Monthly - ₱{selectedPlan.monthly_price}
                            </label>
                        </div>

                        {/* Yearly Option */}
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yearly" id="yearly" />
                            <label htmlFor="yearly" className="text-sm">
                                Yearly - ₱{selectedPlan.yearly_price}
                            </label>
                        </div>
                    </RadioGroup>
                </div>
                <DialogFooter>
                    <Button onClick={onPayment} disabled={processing}>
                        Confirm Subscription
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}