import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { AlertCircle, Star, Upload, CheckCircle, X, Image, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
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
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Progress } from "@/Components/ui/progress";
import { Separator } from "@/Components/ui/separator";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/Components/ui/dialog";

export default function SendFeedback() {
    const [fileSelected, setFileSelected] = useState(false);
    const [feedbackAlert, setFeedbackAlert] = useState({ show: false, type: 'success', message: '' });
    const [filePreviews, setFilePreviews] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        subject: '',
        category: 'feature',
        rating: 0,
        message: '',
        priority: 'Low',
        attachments: []
    });

    // Function to generate file previews - modified to only allow images
    const generatePreviews = (files) => {
        return Array.from(files).map(file => {
            const fileType = file.type.split('/')[0];
            const isImage = fileType === 'image';
            
            if (!isImage) return null;
            
            return {
                name: file.name,
                size: (file.size / 1024).toFixed(1) + ' KB',
                type: fileType,
                file: file,
                preview: URL.createObjectURL(file)
            };
        }).filter(Boolean); // Remove null items (non-images)
    };

    // Handle removing a file from the selection
    const removeFile = (indexToRemove) => {
        const newFilePreviews = filePreviews.filter((_, index) => index !== indexToRemove);
        setFilePreviews(newFilePreviews);
        
        const newFiles = newFilePreviews.map(preview => preview.file);
        setData('attachments', newFiles);
        setFileSelected(newFiles.length > 0);
    };

    // Handle showing enlarged preview
    const showEnlargedPreview = (previewUrl) => {
        setPreviewImage(previewUrl);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Set priority based on category if not already set
        if (data.category === "bug" && data.priority !== 'High') {
            setData('priority', 'High');
        } else if (data.category === "improvement" && data.priority !== 'Medium') {
            setData('priority', 'Medium');
        }

        post('/user/feedback', {
            onSuccess: () => {
                // Show success message
                setFeedbackAlert({
                    show: true,
                    type: 'success',
                    message: 'Your feedback has been submitted successfully.'
                });
                
                // Reset form
                reset();
                setFileSelected(false);
                setFilePreviews([]);
                
                // Clear alert after delay
                setTimeout(() => {
                    setFeedbackAlert({ show: false, type: 'success', message: '' });
                }, 5000);
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                
                // Show error message
                const errorMessage = Object.entries(errors)
                    .map(([field, error]) => `${field}: ${error}`)
                    .join(', ');
                
                setFeedbackAlert({
                    show: true,
                    type: 'destructive',
                    message: `Validation errors: ${errorMessage}`
                });
                
                // Clear alert after delay
                setTimeout(() => {
                    setFeedbackAlert({ show: false, type: 'destructive', message: '' });
                }, 8000);
            }
        });
    };

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            filePreviews.forEach(preview => {
                if (preview.preview) {
                    URL.revokeObjectURL(preview.preview);
                }
            });
        };
    }, [filePreviews]);

    return (
        <UserLayout>
            <Head title="Send Feedback" />
            <div className="mx-auto min-h-screen pb-10">
                {/* Hero section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg mb-8 shadow-sm border ">
                    <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
                        <div className="md:w-1/2 mb-6 md:mb-0">
                            <h1 className="text-3xl font-bold text-black mb-4">Help Us Improve Your Experience</h1>
                            <p className="text-sm md:text-lg text-muted-foreground">
                                Your feedback is invaluable to us. We're committed to continuous improvement
                                and your insights help shape our services.
                            </p>
                            <div className="mt-6 md:flex items-center hidden ">
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
                        <div className="hidden md:block md:w-1/2 md:pl-8">
                            <img
                                src="https://illustrations.popsy.co/amber/web-design.svg"
                                alt="Feedback Illustration"
                                className="w-full max-w-md mx-auto"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="max-w-screen-2xl mx-auto space-y-6">
                    {feedbackAlert.show && (
                        <Alert variant={feedbackAlert.type}>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>
                                {feedbackAlert.type === 'success' ? 'Success' : 'Error'}
                            </AlertTitle>
                            <AlertDescription>
                                {feedbackAlert.message}
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                                        <div>
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input
                                                id="subject"
                                                placeholder="Enter feedback subject"
                                                value={data.subject}
                                                onChange={e => setData('subject', e.target.value)}
                                            />
                                            {errors.subject && (
                                                <p className="text-sm text-destructive mt-1">{errors.subject}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <Label>Feedback Category</Label>
                                            <RadioGroup
                                                value={data.category}
                                                onValueChange={value => setData('category', value)}
                                                className="grid grid-cols-2 gap-2"
                                            >
                                                {[
                                                    { value: "feature", label: "Feature Request" },
                                                    { value: "bug", label: "Bug Report" },
                                                    { value: "improvement", label: "Improvement" },
                                                    { value: "other", label: "Other" },
                                                ].map((item) => (
                                                    <div key={item.value} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={item.value} id={item.value} />
                                                        <Label htmlFor={item.value}>{item.label}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                            {errors.category && (
                                                <p className="text-sm text-destructive mt-1">{errors.category}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <Label>Rate Your Experience</Label>
                                            <div className="flex items-center space-x-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`cursor-pointer h-6 w-6 ${star <= data.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                                                        onClick={() => setData('rating', star)}
                                                    />
                                                ))}
                                                <span className="ml-2 text-sm text-muted-foreground">
                                                    {data.rating > 0 ? `${data.rating} out of 5` : "Required"}
                                                </span>
                                            </div>
                                            {errors.rating && (
                                                <p className="text-sm text-destructive mt-1">{errors.rating}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="message">Your Message</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Write your feedback here... Please include as much detail as possible."
                                                className="min-h-[150px]"
                                                value={data.message}
                                                onChange={e => setData('message', e.target.value)}
                                            />
                                            {errors.message && (
                                                <p className="text-sm text-destructive mt-1">{errors.message}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <Label>Attachments (Optional)</Label>
                                            <div className="border-2 border-dashed rounded-md p-4 text-center hover:bg-muted/50 cursor-pointer">
                                                <input
                                                    type="file"
                                                    id="file"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files);
                                                        
                                                        if (files.length > 0) {
                                                            const newPreviews = generatePreviews(files);
                                                            
                                                            if (newPreviews.length === 0) {
                                                                setFeedbackAlert({
                                                                    show: true,
                                                                    type: 'destructive',
                                                                    message: 'Please select only image files (JPEG, PNG, GIF).'
                                                                });
                                                                
                                                                setTimeout(() => {
                                                                    setFeedbackAlert({ show: false, type: 'destructive', message: '' });
                                                                }, 5000);
                                                                return;
                                                            }
                                                            
                                                            setFilePreviews([...filePreviews, ...newPreviews]);
                                                            
                                                            const allFiles = [...(data.attachments || []), ...newPreviews.map(p => p.file)];
                                                            setData('attachments', allFiles);
                                                            setFileSelected(true);
                                                        }
                                                    }}
                                                    multiple
                                                    accept="image/*"
                                                />
                                                <Label htmlFor="file" className="cursor-pointer">
                                                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">
                                                        {fileSelected ? "Files selected" : "Drop images here or click to upload"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground/70 mt-1">
                                                        Supports images only (JPEG, PNG, GIF) - max 5MB each
                                                    </p>
                                                </Label>
                                            </div>
                                            {errors.attachments && (
                                                <p className="text-sm text-destructive mt-1">{errors.attachments}</p>
                                            )}
                                            
                                            {filePreviews.length > 0 && (
                                                <div className="mt-4">
                                                    <Label className="text-sm">Selected Images</Label>
                                                    <ScrollArea className="h-[160px] mt-2 rounded-md border">
                                                        <div className="p-4 space-y-3">
                                                            {filePreviews.map((preview, index) => (
                                                                <div key={index} className="flex items-center gap-3 group">
                                                                    <div 
                                                                        className="w-16 h-16 rounded overflow-hidden flex-shrink-0 cursor-pointer" 
                                                                        onClick={() => showEnlargedPreview(preview.preview)}
                                                                    >
                                                                        <img 
                                                                            src={preview.preview} 
                                                                            alt={preview.name}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center justify-between">
                                                                            <p className="text-sm font-medium truncate">{preview.name}</p>
                                                                            <Button 
                                                                                type="button"
                                                                                variant="ghost" 
                                                                                size="icon" 
                                                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                onClick={() => removeFile(index)}
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                        <div>
                                                                            <Badge variant="outline" className="text-xs">
                                                                                {preview.size}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </ScrollArea>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <Button type="submit" className="w-full mt-4" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Submit Feedback"
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
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
                                                "Attach screenshots if relevant",
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

            <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>Image Preview</DialogTitle>
                        <DialogDescription>
                            View the full-size image
                        </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-auto max-h-[calc(90vh-10rem)]">
                        {previewImage && (
                            <img 
                                src={previewImage} 
                                alt="Enlarged preview" 
                                className="w-full h-auto rounded-md"
                            />
                        )}
                    </div>
                    <div className="flex justify-end">
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </UserLayout>
    );
}