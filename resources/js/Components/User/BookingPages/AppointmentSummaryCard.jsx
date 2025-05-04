import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

const AppointmentSummaryCard = ({
    shop,
    shopStaff,
    selectedDate,
    selectedStaff,
    selectedTime,
    bookingMembers = []
}) => {
    // Add buffer time constant (can be moved to shop settings later)
    const BUFFER_TIME_MINUTES = 15;

    // Calculate total duration for all selected services
    const calculateTotalDuration = (serviceIds = []) => {
        if (!serviceIds.length || !shop?.shop_service_categories) return 0;
        
        // Sum all service durations
        return serviceIds.reduce((total, serviceId) => {
            const service = shop.shop_service_categories.find(s => s.id === serviceId);
            if (!service) return total;
            
            const serviceDuration = (service.duration_hour * 60) + service.duration_minute;
            return total + serviceDuration;
        }, 0);
    };

    // Calculate end time with buffer based on total duration
    const calculateEndTime = (time) => {
        if (!time || !shop?.shop_service_categories) return null;
        
        // Get selected service IDs (assuming they come from elsewhere in the app)
        const serviceIds = Array.isArray(shop.selected_services) 
            ? shop.selected_services 
            : [];
            
        // Calculate total duration (at least 30 minutes)
        const totalDuration = Math.max(30, calculateTotalDuration(serviceIds));
        
        try {
            // Parse start time
            const [hours, minutes] = time.split(':').map(Number);
            
            // Create date object for start time
            const startTime = new Date();
            startTime.setHours(hours, minutes, 0);
            
            // Calculate service end time
            const endTime = new Date(startTime.getTime() + totalDuration * 60000);
            
            // Calculate buffer end time
            const bufferEndTime = new Date(endTime.getTime() + BUFFER_TIME_MINUTES * 60000);
            
            return {
                serviceEnd: endTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true
                }),
                bufferEnd: bufferEndTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true
                })
            };
        } catch (e) {
            console.error("Error calculating end time:", e);
            return null;
        }
    };

    const endTimes = selectedTime ? calculateEndTime(selectedTime) : null;
    
    // Format selected date if available
    const formattedDate = selectedDate 
        ? new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) 
        : null;
    
    // Format selected time if available
    const formattedTime = selectedTime 
        ? new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
        : null;

    return (
        <Card className="max-w-sm">
            <div className="aspect-video overflow-hidden rounded-t-md">
                {shop?.shop_gallery?.[0]?.url && (
                    <img 
                        className="w-full h-full object-cover" 
                        src={`/${shop.shop_gallery[0].url}`} 
                        alt={shop.shop_name + " photo"} 
                    />
                )}
            </div>
            <CardContent className="pt-6">
                <div className="flex gap-3">
                    <Avatar className="h-14 w-14">
                        {shop?.shop_photo ? (
                            <AvatarImage src={`/${shop.shop_photo}`} alt={shop.shop_name} />
                        ) : (
                            <AvatarFallback>{shop?.shop_name?.charAt(0) || 'S'}</AvatarFallback>
                        )}
                    </Avatar>
                    <div className="space-y-1">
                        <CardTitle>{shop?.shop_name}</CardTitle>
                        <CardDescription>
                            <p className="text-xs text-muted-foreground">{shop?.detailed_address}</p>
                            <p className="text-xs text-muted-foreground">{shop?.contact_number}</p>
                        </CardDescription>
                    </div>
                </div>
            </CardContent>
            
            {(selectedTime && selectedStaff !== null && shopStaff?.[selectedStaff]) && (
                <CardContent className="space-y-3 border-t pt-4">
                    <CardTitle className="text-base">Appointment Details</CardTitle>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Staff:</span>
                            <span className="text-sm">
                                {shopStaff[selectedStaff]?.staff.first_name} {shopStaff[selectedStaff]?.staff.last_name}
                            </span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Date:</span>
                            <span className="text-sm">{formattedDate}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Time:</span>
                            <span className="text-sm">
                                {formattedTime} - {endTimes?.serviceEnd}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3 bg-amber-50 p-2 rounded">
                            <Clock className="h-4 w-4 text-amber-600" />
                            <div className="text-xs text-amber-800">
                                <span className="font-medium">Buffer time:</span> Until {endTimes?.bufferEnd}
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}

export default AppointmentSummaryCard;