import { useState } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Head } from "@inertiajs/react";
import { Textarea } from "@/Components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

import { CheckCircle, Eye, MessageCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { motion } from "framer-motion";

export default function SendFeedback() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000); // Auto-hide after 3s
    };

    return (
        <UserLayout>
            <Head title="Send Feedback" />
            <div className="container mx-auto p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Success Message */}
                    {submitted && (
                        <Alert className="bg-green-100 border-green-500 text-green-700">
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>
                                Your feedback has been submitted.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Feedback Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Send Feedback</CardTitle>
                            <CardDescription>
                                Share your thoughts with us
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        type="text"
                                        placeholder="Enter feedback subject"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="message">
                                        Your Message
                                    </Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Write your feedback here..."
                                        className="min-h-[150px]"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full mt-4">
                                    Submit Feedback
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Divider */}
                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-400 text-sm">
                            Why Feedback Matters
                        </span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Why Feedback Matters Section */}
                    <div className="text-center ">
                        <h3 className="text-lg font-semibold mb-4">
                            Why Your Feedback Matters
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                            {[
                                {
                                    icon: CheckCircle,
                                    title: "Improve Service",
                                    description: "Help us serve you better",
                                    tooltip:
                                        "Your input helps us make better decisions!",
                                },
                                {
                                    icon: Eye,
                                    title: "Shape the Future",
                                    description: "Influence our roadmap",
                                    tooltip:
                                        "Your ideas help shape upcoming features!",
                                },
                                {
                                    icon: MessageCircle,
                                    title: "Stay Connected",
                                    description: "Be part of our community",
                                    tooltip:
                                        "Join discussions and give us feedback!",
                                },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                    }}
                                >
                                    <Card className="">
                                        <CardHeader className="flex items-center justify-center">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <item.icon className="w-8 h-8 text-primary" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {item.tooltip}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </CardHeader>
                                        <CardContent className="text-center">
                                            <CardTitle className="text-base">
                                                {item.title}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
