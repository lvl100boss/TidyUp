import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/Components/ui/avatar"
import { Badge } from "@/Components/ui/badge"
import { Separator } from "@/Components/ui/separator"
import { Info } from "lucide-react"

const AppointmentSummaryCard = ({
    shop,
    shopStaff,
    selectedDate,
    selectedStaff,
    selectedTime,
    selectedServices = []
}) => {
    // Calculate the total price if services are provided
    const totalPrice = selectedServices.length > 0 && shop?.shop_service_categories
        ? shop.shop_service_categories
            .filter(service => selectedServices.includes(service.id))
            .reduce((sum, service) => sum + parseFloat(service.cost || 0), 0)
        : 0;

    return (
        <Card className="w-full">
            <div className="aspect-video overflow-hidden rounded-t-md">
                <img 
                    className="w-full h-full object-cover" 
                    src={shop?.shop_gallery?.[0]?.url ? `/${shop.shop_gallery[0].url}` : ''} 
                    alt={shop?.shop_name + " photo"} 
                />
            </div>
            
            <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={`/${shop?.shop_photo}`} />
                    </Avatar>
                    <div>
                        <CardTitle className="text-xl">{shop?.shop_name}</CardTitle>
                        <CardDescription className="mt-1">
                            {shop?.detailed_address}
                        </CardDescription>
                    </div>
                </div>
            </CardContent>

            <Separator className="my-2" />
            
            {selectedTime && (
                <CardContent>
                    <CardTitle className="text-lg mb-3">Appointment Details</CardTitle>
                    <div className="space-y-3">
                        {selectedStaff !== null && shopStaff?.[selectedStaff] && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Stylist</p>
                                <p className="font-medium">
                                    {`${shopStaff[selectedStaff].staff.first_name} ${shopStaff[selectedStaff].staff.last_name}`}
                                </p>
                            </div>
                        )}
                        
                        {selectedDate && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Date</p>
                                <p className="font-medium">
                                    {new Date(selectedDate).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        )}
                        
                        {selectedTime && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Time</p>
                                <p className="font-medium">
                                    {new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true
                                    })}
                                </p>
                            </div>
                        )}
                        
                        <div className="bg-muted/50 p-3 rounded-lg flex gap-2 text-sm mt-2">
                            <Info className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                            <p>A 30-minute buffer time is added before and after your appointment to ensure quality service.</p>
                        </div>
                    </div>
                </CardContent>
            )}
            
            {selectedServices.length > 0 && (
                <>
                    <Separator className="my-2" />
                    <CardContent>
                        <CardTitle className="text-lg mb-3">Selected Services</CardTitle>
                        <div className="space-y-2">
                            {shop?.shop_service_categories?.map(service => 
                                selectedServices.includes(service.id) && (
                                    <div key={service.id} className="flex justify-between">
                                        <p className="font-medium">{service.service_name}</p>
                                        <p className="font-medium">₱{service.cost}</p>
                                    </div>
                                )
                            )}
                            
                            <Separator className="my-3" />
                            
                            <div className="flex justify-between">
                                <p className="font-bold text-lg">Total</p>
                                <p className="font-bold text-lg">₱{totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </CardContent>
                </>
            )}
        </Card>
    );
}

export default AppointmentSummaryCard;