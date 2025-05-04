import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Calendar, CheckCircle, Clock, Scissors, Star, MapPin, Phone, X, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/Components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar'
import { Badge } from "@/components/ui/badge"
import { useState, useCallback } from "react"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const AppointmentDetailDialog = ({
    appointment,
    open,
    onOpenChange,
    onReviewClick,
    onViewReview,
    disabled = false,
}) => {
    const [loading, setLoading] = useState(false);
    
    // Format time from appointment.time string (e.g., "14:30:00")
    const formatTime = useCallback((timeString) => {
        if (!timeString) return "";
        try {
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
    }, []);
    
    // Format date from appointment.date (e.g., "2023-05-15")
    const formatDate = useCallback((dateString) => {
        if (!dateString) return "";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "2-digit",
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString;
        }
    }, []);

    // Calculate end time including buffer
    const calculateEndTimeWithBuffer = useCallback((timeString) => {
        if (!timeString || !appointment) return { serviceEnd: "", bufferEnd: "" };
        try {
            // Get total service duration
            let totalDuration = 0;
            appointment.appointment_services?.forEach(service => {
                if (service.shop_service) {
                    totalDuration += (service.shop_service.duration_hour * 60) + 
                                     service.shop_service.duration_minute;
                }
            });
            
            // Ensure minimum duration
            totalDuration = Math.max(30, totalDuration);
            
            // Get buffer time from appointment or use default
            const bufferTime = appointment.buffer_time_minutes || 30;
            
            const startTime = new Date(`1970-01-01T${timeString}`);
            const serviceEndTime = new Date(startTime.getTime() + (totalDuration * 60000));
            const bufferEndTime = new Date(serviceEndTime.getTime() + (bufferTime * 60000));
            
            return {
                serviceEnd: serviceEndTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                }),
                bufferEnd: bufferEndTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                }),
                bufferTime: bufferTime
            };
        } catch (error) {
            console.error("Error calculating end time:", error);
            return { serviceEnd: "", bufferEnd: "", bufferTime: 30 };
        }
    }, [appointment]);
    
    // Get the end times for displaying in the component
    const endTimes = appointment?.time ? calculateEndTimeWithBuffer(appointment.time) : { serviceEnd: "", bufferEnd: "", bufferTime: 30 };

    // Helper to get status badge variant
    const getStatusVariant = useCallback((status) => {
        const variants = {
            pending: "outline",
            upcoming: "secondary",
            started: "default",
            completed: "success",
            cancelled: "destructive",
            declined: "destructive",
            "no-show": "destructive"
        };
        return variants[status] || "outline";
    }, []);

    // Process services to group identical ones and show counts
    const processServices = () => {
        if (!appointment?.appointment_services || !Array.isArray(appointment.appointment_services)) {
            return [];
        }
        
        // Group services by service ID and track attendees
        const serviceGroups = {};
        
        appointment.appointment_services.forEach(service => {
            if (!service.shop_service) return;
            
            const serviceId = service.shop_service.id;
            const serviceName = service.shop_service.service_name;
            const serviceCost = service.shop_service.cost;
            const duration = `${service.shop_service.duration_hour}h ${service.shop_service.duration_minute}m`;
            
            // Enhanced attendee name resolution - check multiple possible paths
            let attendeeName = "Self";
            if (service.attendee && service.attendee.name) {
                attendeeName = service.attendee.name;
            } else if (service.attendee_id) {
                // If we have an attendee_id but no attendee object, try to find it in appointment.attendees
                const attendee = appointment.attendees?.find(a => a.id === service.attendee_id);
                if (attendee) {
                    attendeeName = attendee.name;
                }
            }
            
            if (!serviceGroups[serviceId]) {
                serviceGroups[serviceId] = {
                    id: serviceId,
                    name: serviceName,
                    cost: serviceCost,
                    duration: duration,
                    count: 0,
                    attendees: []
                };
            }
            
            serviceGroups[serviceId].count += 1;
            serviceGroups[serviceId].attendees.push(attendeeName);
        });
        
        return Object.values(serviceGroups);
    };
    
    // Process the services when needed, on each render
    const processedServices = processServices();

    // Check if the appointment data is valid
    if (!appointment) {
        return null;
    }

    const handleReviewClick = () => {
        setLoading(true);
        onReviewClick(appointment);
        setLoading(false);
    };

    const handleViewReview = () => {
        setLoading(true);
        onViewReview(appointment);
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Appointment Details</DialogTitle>
                    <Badge 
                        variant={getStatusVariant(appointment.status)}
                        className="absolute top-6 right-12"
                    >
                        {appointment.status}
                    </Badge>
                </DialogHeader>

                {/* Shop information */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                {appointment.shop?.shop_photo ? (
                                    <AvatarImage 
                                        src={`/${appointment.shop.shop_photo}`}
                                        alt={appointment.shop?.shop_name || "Shop photo"} 
                                    />
                                ) : (
                                    <AvatarFallback>
                                        {appointment.shop?.shop_name?.[0] || "S"}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div>
                                <h2 className="text-lg font-semibold">
                                    {appointment.shop?.shop_name || "Shop information unavailable"}
                                </h2>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span>{appointment.shop?.detailed_address || "Address unavailable"}</span>
                                </div>
                                {appointment.shop?.contact_number && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Phone className="h-3 w-3" />
                                        <span>{appointment.shop.contact_number}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator />
                
                <ScrollArea className="max-h-[350px] pr-4 -mr-4 overflow-auto">
                    {/* Appointment primary details */}
                    <div className="space-y-3 mb-4">
                        {/* Stylist information */}
                        <div className="flex items-center gap-3">
                            <div className="bg-muted p-2 rounded-full">
                                <Scissors className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Stylist</p>
                                <p className="text-sm">
                                    {/* Try multiple paths to find staff info */}
                                    {appointment.staff?.staff?.first_name ? (
                                        `${appointment.staff.staff.first_name} ${appointment.staff.staff.last_name}`
                                    ) : appointment.user_appointments?.[0]?.staff?.staff ? (
                                        `${appointment.user_appointments[0].staff.staff.first_name} ${appointment.user_appointments[0].staff.staff.last_name}`
                                    ) : appointment.appointment_services?.[0]?.staff?.staff ? (
                                        `${appointment.appointment_services[0].staff.staff.first_name} ${appointment.appointment_services[0].staff.staff.last_name}`
                                    ) : (
                                        "Staff information unavailable"
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-3">
                            <div className="bg-muted p-2 rounded-full">
                                <Calendar className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Date</p>
                                <p className="text-sm">{formatDate(appointment.date)}</p>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-3">
                            <div className="bg-muted p-2 rounded-full">
                                <Clock className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Time</p>
                                <p className="text-sm">
                                    {formatTime(appointment.time)}
                                    {endTimes.serviceEnd && ` - ${endTimes.serviceEnd}`}
                                </p>
                                {endTimes.bufferEnd && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                        {endTimes.bufferTime}-minute buffer until {endTimes.bufferEnd}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold mb-3">Services</h3>
                        <div className="space-y-2">
                            {processedServices.length > 0 ? (
                                processedServices.map((service) => (
                                    <div key={service.id} className="grid grid-cols-[1fr_auto] gap-2">
                                        <div>
                                            <p className="text-sm font-medium">
                                                {service.name}
                                                {service.count > 1 && (
                                                    <span className="ml-2 text-xs bg-muted px-2 py-1 rounded-full">
                                                        {service.count}x
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Duration: {service.duration}
                                            </p>
                                            <div className="mt-1 text-xs text-muted-foreground">
                                                <p className="font-medium">For:</p>
                                                <ul className="list-disc list-inside space-y-1 pl-1">
                                                    {service.attendees.map((attendee, idx) => (
                                                        <li key={idx} className="text-xs">
                                                            {attendee}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium">
                                            ₱{parseFloat(service.cost) * service.count}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No services listed</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Notes */}
                    {appointment.note && (
                        <>
                            <Separator className="my-4" />
                            <div>
                                <h3 className="font-semibold mb-2">Notes</h3>
                                <p className="text-sm bg-muted p-2 rounded">{appointment.note}</p>
                            </div>
                        </>
                    )}

                    {/* Total */}
                    <div className="flex items-center justify-between mt-6 mb-2">
                        <h3 className="font-semibold">Total</h3>
                        <p className="font-semibold">₱{appointment.total_price || "0.00"}</p>
                    </div>
                </ScrollArea>

                <Separator />

                <DialogFooter>
                    {/* Action buttons based on status */}
                    {appointment.status === "started" && !appointment.has_review ? (
                        <Button
                            onClick={handleReviewClick}
                            disabled={disabled || loading}
                            aria-label="Rate and review this appointment"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Star className="mr-2 h-4 w-4" />
                                    Rate & Review
                                </>
                            )}
                        </Button>
                    ) : appointment.status === "completed" && appointment.has_review ? (
                        <Button
                            onClick={handleViewReview}
                            variant="outline"
                            disabled={disabled || loading}
                            aria-label="View your review for this appointment"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
                            )}
                            View Your Review
                        </Button>
                    ) : appointment.status === "completed" && !appointment.has_review ? (
                        <Button
                            onClick={handleReviewClick}
                            disabled={disabled || loading}
                            aria-label="Rate and review this appointment"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Star className="mr-2 h-4 w-4" />
                                    Rate & Review
                                </>
                            )}
                        </Button>
                    ) : !["completed", "cancelled", "declined", "no-show"].includes(appointment.status) ? (
                        <div className="flex gap-2 w-full">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button 
                                            variant="secondary" 
                                            className="flex-1"
                                            aria-label="Request to reschedule this appointment"
                                            disabled={disabled}
                                        >
                                            Request Reschedule
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Request a different date or time</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button 
                                            variant="destructive" 
                                            className="flex-1"
                                            aria-label="Cancel this appointment"
                                            disabled={disabled}
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Cancel this appointment</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    ) : (
                        <Button 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                            aria-label="Close appointment details"
                        >
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AppointmentDetailDialog;
