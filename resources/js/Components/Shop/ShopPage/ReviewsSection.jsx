import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { format } from "date-fns";

const ReviewsSection = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return (
            <Card className="my-6">
                <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No reviews yet. Be the first to leave a review!</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate average ratings
    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 0;
        
        // Check if reviews use the new dual rating system or legacy single rating
        if (reviews[0].service_rating !== undefined) {
            // New dual rating system
            const totalServiceRating = reviews.reduce((acc, review) => acc + review.service_rating, 0);
            const totalStaffRating = reviews.reduce((acc, review) => acc + review.staff_rating, 0);
            const serviceAvg = totalServiceRating / reviews.length;
            const staffAvg = totalStaffRating / reviews.length;
            
            // Return combined average
            return {
                combined: (serviceAvg + staffAvg) / 2,
                service: serviceAvg,
                staff: staffAvg
            };
        } else {
            // Legacy single rating system
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            return {
                combined: totalRating / reviews.length,
                service: null,
                staff: null
            };
        }
    };

    const ratings = calculateAverageRating(reviews);

    return (
        <Card className="my-6">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Customer Reviews</CardTitle>
                    <div className="flex items-center space-x-2">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-5 w-5 ${
                                        star <= Math.round(ratings.combined)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="font-medium">
                            {ratings.combined.toFixed(1)} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                        </span>
                    </div>
                </div>
                
                {ratings.service !== null && (
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                            <p className="text-muted-foreground mb-1">Service Quality</p>
                            <div className="flex items-center">
                                <div className="flex mr-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-4 w-4 ${
                                                star <= Math.round(ratings.service)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span>{ratings.service.toFixed(1)}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-muted-foreground mb-1">Staff Performance</p>
                            <div className="flex items-center">
                                <div className="flex mr-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-4 w-4 ${
                                                star <= Math.round(ratings.staff)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span>{ratings.staff.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="pb-6">
                            <div className="flex justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarFallback>
                                            {review.user.first_name?.charAt(0)}
                                            {review.user.last_name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {review.user.first_name} {review.user.last_name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(review.created_at), "MMM d, yyyy")}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Show appropriate rating based on review type */}
                                {review.service_rating !== undefined ? (
                                    <div className="flex flex-col items-end space-y-1">
                                        <div className="flex items-center">
                                            <span className="text-xs mr-1">Service:</span>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-3 w-3 ${
                                                            star <= review.service_rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-xs mr-1">Staff:</span>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-3 w-3 ${
                                                            star <= review.staff_rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${
                                                    star <= review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-4">
                                <p className="text-sm">{review.comment}</p>
                            </div>
                            
                            {review.appointment && review.appointment.services && review.appointment.services.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium mb-2">Services Availed:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {review.appointment.services.map((service) => {
                                            // Handle both potential property names
                                            const serviceName = 
                                                (service.shop_service && service.shop_service.service_name) || 
                                                (service.shopService && service.shopService.service_name) || 
                                                "Service";
                                            
                                            return (
                                                <Badge key={service.id} variant="outline">
                                                    {serviceName}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            
                            <Separator className="mt-6" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ReviewsSection;
