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
            <div className="mx-auto min-h-screen">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
                        <div className="md:w-1/2 mb-6 md:mb-0">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">Help Us Improve Your Experience</h1>
                            <p className="text-lg text-gray-600">
                                Your feedback is invaluable to us. We're committed to continuous improvement
                                and your insights help shape our services.
                            </p>
                            <div className="mt-6 flex items-center">
                                <div className="flex -space-x-2 mr-4">
                                    {['A', 'B', 'C'].map((letter, i) => (
                                        <Avatar key={i} className="border-2 border-white">
                                            <AvatarFallback>{letter}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">Joined by 2,500+ users providing feedback</p>
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

                <div className="max-w-6xl mx-auto space-y-6 px-4">
                    {/* Success Message */}
                    {submitted && (
                        <Alert className="bg-green-100 border-green-500 text-green-700">
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
                                                        className={`cursor-pointer h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                            }`}
                                                        onClick={() => setRating(star)}
                                                    />
                                                ))}
                                                <span className="ml-2 text-sm text-gray-500">
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
                                            <div className="border-2 border-dashed rounded-md p-4 text-center hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="file"
                                                    id="file"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    multiple
                                                />
                                                <Label htmlFor="file" className="cursor-pointer">
                                                    <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                                                    <p className="text-sm text-gray-500">
                                                        {fileSelected ? "Files selected" : "Drop files here or click to upload"}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
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
                                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 shrink-0 mt-0.5" />
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Testimonials Section */}
                    <div className="my-12">
                        <h2 className="text-2xl font-bold text-center mb-8">What Others Are Saying</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    name: "Alex Johnson",
                                    role: "Regular User",
                                    avatar: "AJ",
                                    content: "I suggested a feature for task organization and was amazed to see it implemented in just two weeks! This team really listens."
                                },
                                {
                                    name: "Sarah Miller",
                                    role: "Premium User",
                                    avatar: "SM",
                                    content: "The responsiveness to feedback is why I remain a loyal user. My experience has improved dramatically based on the changes made."
                                },
                                {
                                    name: "Marcus Chen",
                                    role: "New User",
                                    avatar: "MC",
                                    content: "Even as a new user, I felt my input was valued. The team addressed my concerns promptly and made the onboarding process smoother."
                                }
                            ].map((testimonial, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="flex items-start space-x-4">
                                                <Avatar>
                                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                                        {testimonial.avatar}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{testimonial.name}</p>
                                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <Card className="my-8">
                        <CardHeader>
                            <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
                            <CardDescription className="text-center">Common questions about our feedback process</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {[
                                    {
                                        question: "What happens after I submit feedback?",
                                        answer: "Your feedback is reviewed by our product team within 1-3 business days. If actionable, it's prioritized in our development roadmap. You may receive follow-up questions via email if we need clarification."
                                    },
                                    {
                                        question: "Can I track the status of my feedback?",
                                        answer: "Currently, you cannot track individual feedback items, but we send monthly updates about implemented suggestions and fixes via our newsletter."
                                    },
                                    {
                                        question: "Are there any rewards for valuable feedback?",
                                        answer: "While we don't have a formal rewards program, users whose feedback leads to significant improvements may receive premium account upgrades or early access to new features."
                                    },
                                    {
                                        question: "How do you decide which feedback to implement?",
                                        answer: "We evaluate feedback based on user impact, alignment with product vision, technical feasibility, and how many users have requested similar features or improvements."
                                    }
                                ].map((item, i) => (
                                    <AccordionItem key={i} value={`item-${i}`}>
                                        <AccordionTrigger>{item.question}</AccordionTrigger>
                                        <AccordionContent>
                                            {item.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>

                    {/* Why Feedback Matters Section */}
                    <div className="text-center my-12">
                        <h3 className="text-xl font-semibold mb-4">
                            Why Your Feedback Matters
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {[
                                {
                                    icon: CheckCircle,
                                    title: "Improve Service",
                                    description: "Help us serve you better",
                                    tooltip: "Your input helps us make better decisions!",
                                },
                                {
                                    icon: Eye,
                                    title: "Shape the Future",
                                    description: "Influence our roadmap",
                                    tooltip: "Your ideas help shape upcoming features!",
                                },
                                {
                                    icon: Lightbulb,
                                    title: "Inspire Innovation",
                                    description: "Spark new ideas",
                                    tooltip: "Your feedback can lead to breakthrough features!",
                                },
                                {
                                    icon: MessageCircle,
                                    title: "Stay Connected",
                                    description: "Be part of our community",
                                    tooltip: "Join discussions and give us feedback!",
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

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-8 my-8 text-center text-black">
                        <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
                        <p className="mb-6 max-w-2xl mx-auto ">
                            Your voice matters to us. Every piece of feedback contributes to making our platform better for everyone.
                        </p>
                        <Button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700"
                        >
                            Share Your Thoughts Now
                        </Button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
