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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Separator } from "@/Components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Progress } from "@/Components/ui/progress";

import {
    CheckCircle, Eye, MessageCircle, Upload, Star,
    HelpCircle, ThumbsUp, Lightbulb, AlertCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { motion } from "framer-motion";

export default function SendFeedback() {
    const [submitted, setSubmitted] = useState(false);
    const [rating, setRating] = useState(0);
    const [fileSelected, setFileSelected] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000); // Auto-hide after 3s
    };

    const handleFileChange = (e) => {
        setFileSelected(e.target.files.length > 0);
    };

    return (
        <UserLayout>
            <Head title="Send Feedback" />
            <div className="mx-auto min-h-screen pb-10">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg mb-8 shadow-sm border ">
                    <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
                        <div className="md:w-1/2 mb-6 md:mb-0">
                            <h1 className="text-3xl font-bold text-black mb-4">Help Us Improve Your Experience</h1>
                            <p className="text-lg text-muted-foreground">
                                Your feedback is invaluable to us. We're committed to continuous improvement
                                and your insights help shape our services.
                            </p>
                            <div className="mt-6 flex items-center">
                                <div className="flex -space-x-2 mr-4">
                                    {['A', 'B', 'C'].map((letter, i) => (
                                        <Avatar key={i} className="border-2 border-background">
                                            <AvatarFallback>{letter}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground">Joined by 2,500+ users providing feedback</p>
                            </div>
                        </div>
                        <div className="md:w-1/2 md:pl-8">
                            <img
                                src="https://illustrations.popsy.co/amber/web-design.svg"
                                alt="Feedback Illustration"
                                className="w-full max-w-md mx-auto"
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-screen-2xl mx-auto space-y-6">
                    {/* Success Message */}
                    {submitted && (
                        <Alert className="bg-success/10 border-success text-success-foreground">
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>
                                Your feedback has been submitted. We appreciate your input!
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Feedback Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Send Feedback</CardTitle>
                                    <CardDescription>
                                        Share your thoughts with us to help improve our service
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
                                            <Label>Feedback Category</Label>
                                            <RadioGroup defaultValue="feature" className="grid grid-cols-2 gap-2">
                                                {[
                                                    { value: "feature", label: "Feature Request" },
                                                    { value: "bug", label: "Bug Report" },
                                                    { value: "improvement", label: "Improvement" },
                                                    { value: "other", label: "Other" }
                                                ].map((item) => (
                                                    <div key={item.value} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={item.value} id={item.value} />
                                                        <Label htmlFor={item.value}>{item.label}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Rate Your Experience</Label>
                                            <div className="flex items-center space-x-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`cursor-pointer h-6 w-6 ${star <= rating ? "fill-primary text-primary" : "text-muted-foreground"
                                                            }`}
                                                        onClick={() => setRating(star)}
                                                    />
                                                ))}
                                                <span className="ml-2 text-sm text-muted-foreground">
                                                    {rating > 0 ? `${rating} out of 5` : "Click to rate"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">
                                                Your Message
                                            </Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Write your feedback here... Please include as much detail as possible."
                                                className="min-h-[150px]"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Attachments (Optional)</Label>
                                            <div className="border-2 border-dashed rounded-md p-4 text-center hover:bg-muted/50 cursor-pointer">
                                                <input
                                                    type="file"
                                                    id="file"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    multiple
                                                />
                                                <Label htmlFor="file" className="cursor-pointer">
                                                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">
                                                        {fileSelected ? "Files selected" : "Drop files here or click to upload"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground/70 mt-1">
                                                        Supports images, PDFs, and documents (max 5MB)
                                                    </p>
                                                </Label>
                                            </div>
                                        </div>

                                        <Button type="submit" className="w-full mt-4">
                                            Submit Feedback
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar with Stats & Tips */}
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle>Feedback Impact</CardTitle>
                                <CardDescription>How your feedback helps us</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1 text-sm">
                                            <span>Feature Requests Implemented</span>
                                            <span>68%</span>
                                        </div>
                                        <Progress value={68} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1 text-sm">
                                            <span>Bugs Resolved</span>
                                            <span>92%</span>
                                        </div>
                                        <Progress value={92} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1 text-sm">
                                            <span>Average Response Time</span>
                                            <span>24h</span>
                                        </div>
                                        <Progress value={75} />
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="space-y-3">
                                        <h4 className="font-medium">Tips for Effective Feedback</h4>
                                        <ul className="space-y-2 text-sm">
                                            {[
                                                "Be specific about what you experienced",
                                                "Include steps to reproduce issues",
                                                "Suggest solutions if you have ideas",
                                                "Attach screenshots if relevant"
                                            ].map((tip, i) => (
                                                <li key={i} className="flex items-start">
                                                    <CheckCircle className="h-4 w-4 mr-2 text-success shrink-0 mt-0.5" />
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
