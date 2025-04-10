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

    // Calculate average rating
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

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
                                        star <= Math.round(averageRating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="font-medium">
                            {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                        </span>
                    </div>
                </div>
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
                            </div>
                            
                            <div className="mt-4">
                                <p className="text-sm">{review.comment}</p>
                            </div>
                            
                            {review.appointment && review.appointment.services && review.appointment.services.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium mb-2">Services Availed:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {review.appointment.services.map((service) => (
                                            <Badge key={service.id} variant="outline">
                                                {service.shop_service && service.shop_service.service_name}
                                            </Badge>
                                        ))}
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
