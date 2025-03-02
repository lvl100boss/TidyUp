import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
export default function ShopProfileHeader({ shop }) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <Avatar className="w-24 h-24">
                        <AvatarImage
                            src={`/${shop.shop_photo}`}
                            className="object-cover"
                        />
                        <AvatarFallback>
                            {shop.shop_name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight">
                            {shop.shop_name}
                        </h2>
                        <p className="text-muted-foreground">
                            {shop.bio}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}