import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

export default function SubscriptionPlansTab({ subscriptionPlans, currentSubscription, onSelectPlan }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
                <Card key={plan.id}>
                    <CardHeader>
                        <CardTitle>{plan.tier}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Monthly Price: ₱{plan.monthly_price}</p>
                        <p>Yearly Price: ₱{plan.yearly_price}</p>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={() => onSelectPlan(plan)}
                            disabled={currentSubscription?.subscription?.id === plan.id}
                        >
                            {currentSubscription?.subscription?.id === plan.id ? "Current Plan" : "Subscribe"}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}