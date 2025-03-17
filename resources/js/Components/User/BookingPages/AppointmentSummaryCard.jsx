import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/Components/ui/avatar"

const AppointmentSummaryCard = ({
    shop,
    shopStaff,
    selectedDate,
    selectedStaff,
    selectedTime
}) => {
    return (
        <Card className="max-w-sm">
            <div className="aspect-video overflow-hidden rounded-t-md">
                <img className="w-full h-ful object-cover" src={`/${shop.shop_gallery[0].url}`} alt={shop.shop_name + " photo"} />
            </div>
            <CardContent className="overflow-hidden">

            </CardContent>
            <CardContent>
                <div className="inline-flex gap-3">
                    <Avatar className="size-14">
                        <AvatarImage src={`/${shop.shop_photo}`} />
                    </Avatar>
                    <div className="space-y-1">
                        <CardTitle>{shop.shop_name}</CardTitle>
                        <CardDescription>
                            <p className="text-xs text-muted-foreground">{shop.detailed_address}</p>
                            <p className="text-xs text-muted-foreground">{shop.contact_number}</p>
                        </CardDescription>
                    </div>
                </div>
            </CardContent>
            <CardContent>
                {selectedTime && (
                    <div className="space-y-1">
                        <CardTitle>Appointment Details</CardTitle>
                        <CardDescription>
                            <p>
                                Staff: {shopStaff[selectedStaff]?.staff.first_name + ' ' + shopStaff[selectedStaff]?.staff.last_name}
                            </p>
                            <p>Date: {new Date(selectedDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}</p>
                            <p>Time: {new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            })}</p>
                        </CardDescription>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default AppointmentSummaryCard;