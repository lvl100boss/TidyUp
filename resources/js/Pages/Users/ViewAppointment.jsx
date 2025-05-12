import UserLayout from '@/Layouts/UserLayout'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { Head, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Star, Upload, CheckCircle, X, Send, Loader2, ZoomIn } from 'lucide-react'
import axios from 'axios'

const ViewAppointment = ({
    appointmentId,
    appointment,
    shop,
    shopGallery: gallery,
    staff,
    appointmentServices,
    review,
    status
}) => {
    const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
    const [serviceRating, setServiceRating] = useState(review ? review.service_rating : 0);
    const [staffRating, setStaffRating] = useState(review ? review.staff_rating : 0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(review?.image_url || null);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const staffName = `${staff.staff.first_name} ${staff.staff.last_name}`
    const formattedDate = format(new Date(appointment.date), 'MMMM dd, yyyy')
    const formattedTime = format(new Date(`${appointment.date}T${appointment.time}`), 'hh:mm a')
    const shopAddress = `${shop.detailed_address}, ${shop.barangay}, ${shop.city}, ${shop.province}, ${shop.region}`
    const statusVariants = {
        upcoming: "border-blue-300/30 bg-blue-50/50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
        pending: "border-yellow-300/30 bg-yellow-50/50 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300",
        completed: "border-green-300/30 bg-green-50/50 text-green-800 dark:bg-green-950/50 dark:text-green-300",
        cancelled: "border-gray-300/30 bg-gray-50/50 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300",
        "no-show": "border-red-300/30 bg-red-50/50 text-red-800 dark:bg-red-950/50 dark:text-red-300",
        declined: "border-red-300/30 bg-red-50/50 text-red-800 dark:bg-red-950/50 dark:text-red-300",
        started: "border-indigo-300/30 bg-indigo-50/50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300",
    };
    
    const { data, setData, post, processing, errors, reset } = useForm({
        appointment_id: appointment.id,
        user_id: appointment.user_id,
        shop_id: shop.id,
        service_rating: review ? review.service_rating : 0,
        staff_rating: review ? review.staff_rating : 0,
        comment: review ? review.comment : '',
        image: null,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setData('image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const submitReview = (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        const formData = new FormData();
        formData.append('appointment_id', appointment.id);
        formData.append('user_id', appointment.user_id);
        formData.append('shop_id', shop.id);
        formData.append('service_rating', serviceRating);
        formData.append('staff_rating', staffRating);
        formData.append('comment', data.comment || '');
        
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        // Use Inertia's post method
        post(route('appointments.review'), formData, {
            forceFormData: true,
            onSuccess: () => {
                setSubmitSuccess(true);
                setSubmitting(false);
                
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            },
            onError: (errors) => {
                setSubmitting(false);
                
                // Display error message to user
                const errorMessage = errors.message || 'An error occurred while submitting your review.';
                alert(errorMessage);
            }
        });
    };
    
    return (
        <UserLayout>
            <Head title="Appointment" />
            
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Appointment Details</CardTitle>
                    <CardDescription>Review the details of your appointment.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Shop Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Shop Information</h3>
                        <Card>
                            <CardHeader>
                                <CardTitle>{shop.shop_name}</CardTitle>
                                <CardDescription>{shopAddress}</CardDescription>
                                <div className='max-w-md mx-auto'>
                                    <img src={`/${gallery[0].url}`} className='size-full object-cover' />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p>Contact: {shop.contact_number}</p>
                                <p>Email: {shop.email}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Separator className="my-4" />

                    {/* Appointment Details */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Appointment Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium">Date:</p>
                                <p>{formattedDate}</p>
                            </div>
                            <div>
                                <p className="font-medium">Time:</p>
                                <p>{formattedTime}</p>
                            </div>
                            <div>
                                <p className="font-medium">Status:</p>
                                <Badge className={statusVariants[status]}>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</Badge>
                            </div>
                            <div>
                                <p className="font-medium">Total Price:</p>
                                <p>₱{parseFloat(appointment.total_price).toFixed(2)}</p>
                            </div>
                            {appointment.note && (
                                <div className="md:col-span-2">
                                    <p className="font-medium">Note:</p>
                                    <p>{appointment.note}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Staff Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Stylist</h3>
                        <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-4">
                                <AvatarImage src={`/storage/${staff.staff.profile_photo_path}`} alt={staffName} />
                                <AvatarFallback>{staffName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <p>{staffName}</p>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Services</h3>
                        {appointmentServices.map((serviceItem) => (
                            <Card key={serviceItem.id} className="mb-2 background-background/50">
                                <CardContent className="pt-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{serviceItem.shop_service.service_name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Duration: {serviceItem.shop_service.duration_hour > 0 ? `${serviceItem.shop_service.duration_hour}h ` : ''}
                                                {serviceItem.shop_service.duration_minute > 0 ? `${serviceItem.shop_service.duration_minute}m` : ''}
                                            </p>
                                        </div>
                                        <p>₱{parseFloat(serviceItem.shop_service.cost).toFixed(2)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Review Section - Enhanced UI */}
                    {status === 'completed' && (
                        <>
                            <Separator className="my-6" />
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Your Feedback</h3>
                                {review ? (
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle>Your Review</CardTitle>
                                                    <CardDescription>Submitted on {format(new Date(review.created_at), 'MMMM d, yyyy')}</CardDescription>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="flex space-x-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star 
                                                                key={star}
                                                                className={`h-5 w-5 ${
                                                                    star <= ((review.service_rating + review.staff_rating) / 2) 
                                                                    ? "fill-yellow-400 text-yellow-400" 
                                                                    : "text-gray-300"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="ml-2 text-sm font-medium">
                                                        {((review.service_rating + review.staff_rating) / 2).toFixed(1)}/5
                                                    </span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <h4 className="font-medium text-sm">Service Rating</h4>
                                                    <div className="flex items-center">
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star 
                                                                    key={star}
                                                                    className={`h-4 w-4 ${star <= review.service_rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="ml-2 text-sm">{review.service_rating}/5</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="font-medium text-sm">Staff Rating</h4>
                                                    <div className="flex items-center">
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star 
                                                                    key={star}
                                                                    className={`h-4 w-4 ${star <= review.staff_rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="ml-2 text-sm">{review.staff_rating}/5</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {review.comment && (
                                                <div>
                                                    <h4 className="font-medium text-sm mb-2">Your Comment:</h4>
                                                    <div className="bg-muted/30 p-4 rounded-md">
                                                        <p className="italic">{review.comment}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {review.image_path && (
                                                <div>
                                                    <h4 className="font-medium text-sm mb-2">Your Photo:</h4>
                                                    <div className="relative group overflow-hidden rounded-md max-w-[200px]">
                                                        <img 
                                                            src={review.image_url}
                                                            alt="Review Image"
                                                            className="w-full h-auto object-cover rounded-md border shadow-sm"
                                                            onClick={() => setIsImageModalOpen(true)}
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                            <ZoomIn className="h-6 w-6 text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="bg-muted/30 p-8 rounded-lg text-center">
                                        <div className="max-w-md mx-auto space-y-4">
                                            <p className="text-muted-foreground">Share your experience to help others and improve our service</p>
                                            <Button 
                                                onClick={() => setIsReviewDialogOpen(true)}
                                                className="px-6"
                                                size="lg"
                                            >
                                                <Star className="mr-2 h-5 w-5" />
                                                Leave a Review
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Image Modal Dialog */}
            {review && review.image_path && (
                <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
                    <DialogContent className="sm:max-w-[800px] p-1">
                        <div className="relative">
                            <img 
                                src={review.image_url}
                                alt="Review Image Full Size"
                                className="w-full h-auto object-contain max-h-[80vh]"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full p-0"
                                onClick={() => setIsImageModalOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Review Dialog */}
            <Dialog open={isReviewDialogOpen} onOpenChange={(open) => {
                if (!submitting && !submitSuccess) {
                    setIsReviewDialogOpen(open);
                }
            }}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Rate Your Experience</DialogTitle>
                        <DialogDescription>
                            Share your feedback about the service you received at {shop.shop_name}
                        </DialogDescription>
                    </DialogHeader>

                    {submitSuccess ? (
                        <div className="py-8 text-center space-y-4">
                            <div className="mx-auto rounded-full bg-green-100 p-4 w-fit">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-green-600">Thank you for your review!</h3>
                            <p className="text-muted-foreground">
                                Your feedback has been submitted successfully and helps us improve our services.
                            </p>
                            <p className="text-sm text-muted-foreground">Refreshing page...</p>
                        </div>
                    ) : (
                        <form onSubmit={submitReview} className="space-y-6">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">How was your experience?</h3>
                                    
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="service-rating" className="text-sm">Service Quality</Label>
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`cursor-pointer h-6 w-6 transition-transform ${
                                                            star <= serviceRating 
                                                                ? "fill-yellow-400 text-yellow-400 scale-110" 
                                                                : "text-gray-300 hover:text-yellow-200"
                                                        }`}
                                                        onClick={() => {
                                                            setServiceRating(star);
                                                            setData('service_rating', star);
                                                        }}
                                                    />
                                                ))}
                                                {serviceRating > 0 && 
                                                    <span className="ml-2 text-sm font-medium">{serviceRating}/5</span>
                                                }
                                            </div>
                                            {errors.service_rating && 
                                                <p className="text-destructive text-xs">{errors.service_rating}</p>
                                            }
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="staff-rating" className="text-sm">Staff Performance</Label>
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`cursor-pointer h-6 w-6 transition-transform ${
                                                            star <= staffRating 
                                                                ? "fill-yellow-400 text-yellow-400 scale-110" 
                                                                : "text-gray-300 hover:text-yellow-200"
                                                        }`}
                                                        onClick={() => {
                                                            setStaffRating(star);
                                                            setData('staff_rating', star);
                                                        }}
                                                    />
                                                ))}
                                                {staffRating > 0 && 
                                                    <span className="ml-2 text-sm font-medium">{staffRating}/5</span>
                                                }
                                            </div>
                                            {errors.staff_rating && 
                                                <p className="text-destructive text-xs">{errors.staff_rating}</p>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="comment" className="text-sm">Share Your Experience (Optional)</Label>
                                    <Textarea
                                        id="comment"
                                        placeholder="What did you like or dislike about your experience?"
                                        value={data.comment}
                                        onChange={(e) => setData('comment', e.target.value)}
                                        rows={4}
                                    />
                                    {errors.comment && 
                                        <p className="text-destructive text-xs">{errors.comment}</p>
                                    }
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image" className="text-sm">Add a Photo (Optional)</Label>
                                    <div className="mt-1 space-y-3">
                                        {!previewUrl ? (
                                            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                                 onClick={() => document.getElementById('image').click()}>
                                                <input
                                                    id="image"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                                <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    Click to upload an image
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Max size: 2MB (JPEG, PNG)
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <img 
                                                    src={previewUrl}
                                                    alt="Preview" 
                                                    className="max-h-48 rounded-md border mx-auto"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2 h-8 w-8 rounded-full p-0"
                                                    onClick={() => {
                                                        setPreviewUrl(null);
                                                        setSelectedImage(null);
                                                        setData('image', null);
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                        {errors.image && 
                                            <p className="text-destructive text-xs">{errors.image}</p>
                                        }
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsReviewDialogOpen(false)}
                                    disabled={submitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting || !serviceRating || !staffRating}
                                    className="gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Submit Review
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </UserLayout>
    )
}

export default ViewAppointment