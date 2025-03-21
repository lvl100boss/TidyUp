import React, { useState } from "react";
import ShopsLayout from "@/Layouts/ShopsLayout";
import { Head, useForm } from "@inertiajs/react";
import SubscriptionStatusCard from "@/Components/Shop/ShopsSubscription/SubscriptionStatusCard";
import SubscriptionPlansTab from "@/Components/Shop/ShopsSubscription/SubscriptionPlansTab";
import SubscriptionHistoryTab from "@/Components/Shop/ShopsSubscription/SubscriptionHistoryTab";
import PaymentDialog from "@/Components/Shop/ShopsSubscription/PaymentDialog";
import CancellationDialog from "@/Components/Shop/ShopsSubscription/CancellationDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";

export default function ShopSubscriptions({ shop, subscriptionPlans, currentSubscription: initialSubscription, subscriptionHistory }) {
    // State for managing the current subscription
    const [currentSubscription, setCurrentSubscription] = useState(initialSubscription);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);

    const { data, setData, post, processing } = useForm({
        subscription_id: "",
        billing_cycle: "monthly", // Default to monthly
    });

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setData("subscription_id", plan.id);
        setData("billing_cycle", "monthly"); // Default to monthly
        setPaymentDialogOpen(true);
    };

    const handlePayment = () => {
        // Key change: Use axios directly instead of Inertia post
        axios.post(route("shop.subscriptions.subscribe"), data)
            .then(response => {
                console.log("Raw response:", response);
                
                // Close the dialog
                setPaymentDialogOpen(false);
                
                // Get data from response
                const responseData = response.data;
                
                // Update the subscription state
                setCurrentSubscription({
                    subscription: responseData.subscription,
                    start_date: responseData.start_date,
                    end_date: responseData.end_date,
                    billing_cycle: responseData.billing_cycle,
                    status: responseData.status,
                });
                
                // Show success message
                toast.success(`Successfully subscribed to ${responseData.subscription.tier} (${responseData.billing_cycle})`);
            })
            .catch(error => {
                console.error("Subscription Error:", error);
                toast.error("Failed to subscribe. Please try again.");
            });
    };

    const handleCancelSubscription = () => {
        // Similarly use axios for cancellation
        axios.post(route("shop.subscriptions.cancel"))
            .then(response => {
                setCancellationDialogOpen(false);
                setCurrentSubscription(null);
                toast.success("Subscription canceled successfully");
            })
            .catch(error => {
                console.error("Cancellation Error:", error);
                toast.error("Failed to cancel subscription. Please try again.");
            });
    };
    


    return (
        <ShopsLayout>
            <Head title="Subscription Management" />

            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Subscription Management</h1>

                {/* Current Subscription Status */}
                <SubscriptionStatusCard
                    currentSubscription={currentSubscription}
                    onCancel={() => setCancellationDialogOpen(true)}
                />

                {/* Tabs for Plans and History */}
                <Tabs defaultValue="plans" className="mt-8">
                    <TabsList>
                        <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
                        <TabsTrigger value="history">Subscription History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="plans">
                        <SubscriptionPlansTab
                            subscriptionPlans={subscriptionPlans}
                            currentSubscription={currentSubscription}
                            onSelectPlan={handleSelectPlan}
                        />
                    </TabsContent>

                    <TabsContent value="history">
                        <SubscriptionHistoryTab subscriptionHistory={subscriptionHistory} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Payment Dialog */}
            <PaymentDialog
                isOpen={paymentDialogOpen}
                onClose={() => setPaymentDialogOpen(false)}
                selectedPlan={selectedPlan}
                data={data}
                setData={setData}
                onPayment={handlePayment}
                processing={processing}
            />

            {/* Cancellation Dialog */}
            <CancellationDialog
                isOpen={cancellationDialogOpen}
                onClose={() => setCancellationDialogOpen(false)}
                onCancel={handleCancelSubscription}
                processing={processing}
            />
        </ShopsLayout>
    );
}