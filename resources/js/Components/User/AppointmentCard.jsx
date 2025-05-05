import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, Star, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AppointmentCard = ({ appointment, onReviewClick, onViewReview }) => {
    const shopImg = appointment.shop.shop_gallery[0].url;
    const shopName = appointment.shop.shop_name;
    const location = appointment.shop.detailed_address;
    const totalPrice = appointment.total_price;
    const date = new Date(appointment.date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
    
    // Format the time string properly using a fixed date to avoid timezone issues
    const formatTime = (timeString) => {
        if (!timeString) return "";
        try {
            // Use 1970-01-01 as a fixed base date to avoid timezone issues
            return new Date(`1970-01-01T${timeString}`).toLocaleTimeString(
                "en-US",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }
            );
        } catch (error) {
            console.error("Error formatting time:", error);
            return timeString;
        }
    };
    
    const time = formatTime(appointment.time);

    // Calculate service end time with consistent format
    const calculateEndTime = () => {
        try {
            if (!appointment.time) return null;
            
            // Parse the time using a fixed date
            const baseTime = new Date(`1970-01-01T${appointment.time}`);
            
            // Get total duration from all services
            let totalDuration = 0;
            appointment.appointment_services?.forEach(service => {
                if (service.shop_service) {
                    totalDuration += (service.shop_service.duration_hour * 60) + 
                                     service.shop_service.duration_minute;
                }
            });

            // Use 30 min as minimum duration
            totalDuration = Math.max(30, totalDuration);
            
            // Create end time by adding duration to start time
            const endTime = new Date(baseTime.getTime() + totalDuration * 60000);
            
            return endTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error("Error calculating end time:", error);
            return null;
        }
    };
    
    const endTime = calculateEndTime();
    
    // Calculate buffer end time with consistent format
    const calculateBufferEndTime = () => {
        try {
            if (!appointment.time) return null;
            
            // Parse the time using a fixed date
            const baseTime = new Date(`1970-01-01T${appointment.time}`);
            
            // Get total duration from all services
            let totalDuration = 0;
            appointment.appointment_services?.forEach(service => {
                if (service.shop_service) {
                    totalDuration += (service.shop_service.duration_hour * 60) + 
                                    service.shop_service.duration_minute;
                }
            });

            // Ensure minimum duration and get buffer time
            const bufferTime = appointment.buffer_time_minutes || 30;
            totalDuration = Math.max(30, totalDuration);
            
            // Calculate service end time
            const serviceEndTime = new Date(baseTime.getTime() + totalDuration * 60000);
            
            // Add buffer time to get buffer end time
            const bufferEndTime = new Date(serviceEndTime.getTime() + bufferTime * 60000);
            
            return bufferEndTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error("Error calculating buffer end time:", error);
            return null;
        }
    };

    const bufferEndTime = calculateBufferEndTime();
    
    const statusVariants = {
        pending: "border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100",
        upcoming: "border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100",
        completed: "border-green-300 bg-green-50 text-green-800 hover:bg-green-100",
        started: "border-indigo-300 bg-indigo-50 text-indigo-800 hover:bg-indigo-100",
        cancelled: "border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100",
        declined: "border-red-300 bg-red-50 text-red-800 hover:bg-red-100",
        "no-show": "border-red-300 bg-red-50 text-red-800 hover:bg-red-100",
    };

    // Get staff assigned to this appointment
    const getStaffName = () => {
        if (appointment.user_appointments && appointment.user_appointments[0]?.staff?.staff) {
            const staff = appointment.user_appointments[0].staff.staff;
            return `${staff.first_name} ${staff.last_name}`;
        }
        return null;
    };
    
    const staffName = getStaffName();

    // Get primary service name
    const getPrimaryService = () => {
        if (appointment.appointment_services && appointment.appointment_services.length > 0) {
            return appointment.appointment_services[0].shop_service?.service_name;
        }
        return null;
    };

    // Count additional services
    const additionalServiceCount = appointment.appointment_services 
        ? Math.max(0, appointment.appointment_services.length - 1) 
        : 0;

    return (
        <Card className={`overflow-hidden transition-all border-l-4 ${statusVariants[appointment.status] || ''}`}>
            <div className="grid md:grid-cols-[1fr_auto] gap-4">
                <div className="p-4 md:p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-[70px] h-[70px] md:w-20 md:h-20 rounded-md overflow-hidden flex-shrink-0">
                            <img
                                className="w-full h-full object-cover"
                                src={shopImg}
                                alt={shopName}
                            />
                        </div>
                        <div className="space-y-1 flex-grow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{shopName}</h3>
                                    <p className="text-sm text-muted-foreground">{location}</p>
                                </div>
                                <Badge variant="outline" className={`capitalize ml-2 ${statusVariants[appointment.status] || ''}`}>
                                    {appointment.status === "no-show" ? "No Show" : appointment.status}
                                </Badge>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                                {staffName && (
                                    <div className="flex items-center">
                                        <Avatar className="h-5 w-5 mr-1">
                                            <AvatarFallback className="text-[10px]">
                                                {staffName.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        {staffName}
                                    </div>
                                )}
                                
                                <div className="flex items-center">
                                    <Calendar className="h-3.5 w-3.5 mr-1" />
                                    {date}
                                </div>
                                
                                <div className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                    {time}{endTime ? ` - ${endTime}` : ''}
                                    {bufferEndTime ? ` (Buffer: ${bufferEndTime})` : ''}
                                </div>
                            </div>
                            
                            <div className="mt-3">
                                <p className="text-sm">
                                    <span className="font-medium">{getPrimaryService()}</span>
                                    {additionalServiceCount > 0 && (
                                        <span className="text-muted-foreground"> +{additionalServiceCount} more service{additionalServiceCount > 1 ? 's' : ''}</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                        <div className="font-medium">₱{parseFloat(totalPrice).toFixed(2)}</div>
                        
                        <div className="flex items-center gap-2">
                            {appointment.has_review && (
                                <div className="flex items-center text-yellow-500">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="ml-1 text-sm">{appointment.review?.service_rating || 5}</span>
                                </div>
                            )}
                            
                            {(onReviewClick || onViewReview) && (
                                <Button 
                                    variant={appointment.has_review ? "outline" : "default"} 
                                    size="sm"
                                    className="ml-2"
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        appointment.has_review ? onViewReview() : onReviewClick();
                                    }}
                                >
                                    {appointment.has_review ? (
                                        <>
                                            <Star className="h-3.5 w-3.5 mr-1 fill-yellow-500 text-yellow-500" />
                                            View Review
                                        </>
                                    ) : (
                                        <>
                                            <Star className="h-3.5 w-3.5 mr-1" />
                                            Leave Review
                                        </>
                                    )}
                                </Button>
                            )}
                            
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AppointmentCard;
