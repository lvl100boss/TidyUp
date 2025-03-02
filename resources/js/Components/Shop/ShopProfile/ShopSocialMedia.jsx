import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Instagram, Facebook, Twitter, Youtube, Globe } from "lucide-react";

const ShopSocialMedia = ({ shop }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                        {shop.social.instagram}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                        {shop.social.facebook}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                        {shop.social.website}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
export default ShopSocialMedia;