import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const AppointmentSummaryCard = ({ shop }) => {
    return (
        <Card className="max-w-sm sticky top-20">
            <CardHeader>
                <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-video overflow-hidden rounded-md">
                    <img className="w-full h-ful object-cover" src={`/${shop.shop_gallery[0].url}`} alt={shop.shop_name + " photo"} />
                </div>
            </CardContent>
            <CardContent>
                <div className="space-y-1">
                    <p className="text-lg figtree-medium ">{shop.shop_name}</p>
                    <p className="text-sm text-muted-foreground">{shop.detailed_address}</p>
                    <p className="text-sm text-muted-foreground">{shop.contact_number}</p>
                </div>
            </CardContent>
            <CardContent>
                {/* <div className="space-y-1">
                    <p className="text-lg figtree-medium">Service</p>
                    <p className="text-sm text-muted-foreground">Service Name</p>
                    <p className="text-sm text-muted-foreground">Service Price</p>
                </div> */}
            </CardContent>
            <CardFooter>
                <p>Total Amount:</p>
            </CardFooter>
        </Card>

    );
}

export default AppointmentSummaryCard;