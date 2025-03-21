import React from "react";
import { Button } from "@/Components/ui/button";
import { PlusCircle } from "lucide-react";

export default function SubscriptionHeader({ onAddPlan }) {
    return (
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Subscription Plans</h2>
            <Button onClick={onAddPlan}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Plan
            </Button>
        </div>
    );
}