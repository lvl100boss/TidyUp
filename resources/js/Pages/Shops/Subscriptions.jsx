import React, { useState } from 'react';
import ShopsLayout from "@/Layouts/ShopsLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { toast } from "sonner";
import {
    CheckCircle2,
    Clock,
    CreditCard,
    X,
    Calendar,
    Package,
    Loader2,
    AlertCircle
} from "lucide-react";
import { format } from "date-fns";

export default function Subscriptions({ shop, subscriptionPlans, currentSubscription, subscriptionHistory }) {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);
    
    const { data, setData, post, processing } = useForm({
        subscription_id: '',
        payment_method: 'credit_card',  // default payment method
    });
    
    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setData('subscription_id', plan.id);
        setPaymentDialogOpen(true);
    };
    
    const handlePayment = () => {
        post(route('shop.subscriptions.subscribe'), {
            onSuccess: () => {
                setPaymentDialogOpen(false);
                toast.success(`Successfully subscribed to ${selectedPlan.name}`);
            }
        });
    };
    
    const handleCancelSubscription = () => {
        post(route('shop.subscriptions.cancel'), {
            onSuccess: () => {
                setCancellationDialogOpen(false);
                toast.success('Subscription canceled successfully');
            }
        });
    };
    
    const formatDuration = (duration, unit) => {
        if (duration === 1) {
            return `1 ${unit.slice(0, -1)}`;
        }
        return `${duration} ${unit}`;
    };
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };
    
    return (
        <ShopsLayout>
            <Head title="Subscription Plans" />
            
            <div className="container mx-auto py-8">
                <div className="flex flex-col space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Subscription Plans</h1>
                    </div>
                    
                    {/* Current Subscription Status Card */}
                    {currentSubscription ? (
                        <Card>
                            <CardHeader className="bg-secondary/50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-semibold flex items-center">
                                        <CreditCard className="h-5 w-5 mr-2" />
                                        Current Subscription
                                    </CardTitle>
                                    <Badge variant="success" className="px-2 py-1">Active</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <h3 className="font-medium text-muted-foreground text-sm mb-1">Plan</h3>
                                        <p className="text-lg font-semibold">{currentSubscription.subscription.name}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-muted-foreground text-sm mb-1">Period</h3>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                            <span>
                                                {format(new Date(currentSubscription.start_date), 'MMM d, yyyy')} - 
                                                {format(new Date(currentSubscription.end_date), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-muted-foreground text-sm mb-1">Price</h3>
                                        <p className="text-lg font-semibold">{formatCurrency(currentSubscription.subscription.price)}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <Button 
                                        variant="destructive" 
                                        onClick={() => setCancellationDialogOpen(true)}
                                    >
                                        Cancel Subscription
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader className="bg-muted/50">
                                <CardTitle className="text-xl font-semibold flex items-center">
                                    <AlertCircle className="h-5 w-5 mr-2" />
                                    No Active Subscription
                                </CardTitle>
                                <CardDescription>
                                    You don't have an active subscription. Choose a plan below to get started.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    )}
                    
                    <Tabs defaultValue="plans" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="plans">Available Plans</TabsTrigger>
                            <TabsTrigger value="history">Subscription History</TabsTrigger>
                        </TabsList>
                        
                        {/* Available Plans Tab */}
<TabsContent value="plans" className="pt-4">
    {subscriptionPlans && subscriptionPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="mb-4">
                            <p className="text-3xl font-bold">
                                {formatCurrency(plan.price)}
                                <span className="text-sm font-normal text-muted-foreground">
                                    /{formatDuration(plan.duration, plan.duration_unit)}
                                </span>
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 flex justify-center pt-4 pb-4">
                        <Button 
                            className="w-full" 
                            onClick={() => handleSelectPlan(plan)}
                            disabled={currentSubscription && currentSubscription.subscription.id === plan.id}
                        >
                            {currentSubscription && currentSubscription.subscription.id === plan.id 
                                ? 'Current Plan' 
                                : 'Subscribe'}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    ) : (
        <div className="text-center py-10 text-muted-foreground">
            <Package className="mx-auto h-12 w-12 opacity-50 mb-3" />
            <h3 className="text-lg font-medium">No subscription plans currently available</h3>
            <p className="mt-2">
                Please check back later for new subscription options.
            </p>
        </div>
    )}
</TabsContent>
                        
                        {/* Subscription History Tab */}
                        <TabsContent value="history" className="pt-4">
                            {subscriptionHistory && subscriptionHistory.length > 0 ? (
                                <div className="border rounded-md overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-muted text-left">
                                            <tr>
                                                <th className="p-4 font-medium">Plan</th>
                                                <th className="p-4 font-medium">Start Date</th>
                                                <th className="p-4 font-medium">End Date</th>
                                                <th className="p-4 font-medium">Status</th>
                                                <th className="p-4 font-medium">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {subscriptionHistory.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="p-4">{item.subscription.name}</td>
                                                    <td className="p-4">{format(new Date(item.start_date), 'MMM d, yyyy')}</td>
                                                    <td className="p-4">{format(new Date(item.end_date), 'MMM d, yyyy')}</td>
                                                    <td className="p-4">
                                                        <Badge 
                                                            variant={
                                                                item.status === 'active' ? 'success' : 
                                                                item.status === 'canceled' ? 'destructive' : 
                                                                'outline'
                                                            }
                                                        >
                                                            {item.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4">{formatCurrency(item.subscription.price)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    <Package className="mx-auto h-12 w-12 opacity-50 mb-3" />
                                    <h3 className="text-lg font-medium">No subscription history</h3>
                                    <p className="mt-2">
                                        You haven't subscribed to any plans yet.
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            
            {/* Payment Dialog */}
            <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Complete Your Subscription</DialogTitle>
                        <DialogDescription>
                            You're subscribing to {selectedPlan?.name} for {formatCurrency(selectedPlan?.price)}.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="payment-method" className="text-sm font-medium">
                                Payment Method
                            </label>
                            <Select 
                                value={data.payment_method} 
                                onValueChange={(value) => setData('payment_method', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="credit_card">Credit Card</SelectItem>
                                    <SelectItem value="gcash">GCash</SelectItem>
                                    <SelectItem value="paymaya">PayMaya</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handlePayment} disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Complete Payment'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Cancellation Confirmation Dialog */}
            <Dialog open={cancellationDialogOpen} onOpenChange={setCancellationDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Cancel Your Subscription</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel your current subscription? You'll lose access to premium features at the end of your billing period.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancellationDialogOpen(false)}>
                            Keep Subscription
                        </Button>
                        <Button variant="destructive" onClick={handleCancelSubscription} disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Cancelling...
                                </>
                            ) : (
                                'Yes, Cancel Subscription'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ShopsLayout>
    );
}