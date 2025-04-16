import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditShopProfileForm } from "./EditShopProfileForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function ShopProfileHeader({ shop }) {
    const [open, setOpen] = useState(false);
    const [shopPhotoUrl, setShopPhotoUrl] = useState('');

    useEffect(() => {
        // Format the image URL correctly
        if (shop.shop_photo) {
            if (shop.shop_photo.startsWith('http')) {
                setShopPhotoUrl(shop.shop_photo);
            } else {
                setShopPhotoUrl(`/${shop.shop_photo}`);
            }
        }
    }, [shop.shop_photo]);

    // Get the first category ID if available, otherwise use null
    const defaultCategoryId = shop.shop_categories?.length > 0
        ? shop.shop_categories[0].category_id
        : null;

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <Avatar className="w-24 h-24">
                        <AvatarImage
                            src={shopPhotoUrl}
                            className="object-cover"
                            onError={(e) => {
                                console.log("Image failed to load:", e.target.src);
                                e.target.src = "/placeholder-image.jpg"; // Fallback image path
                            }}
                        />
                        <AvatarFallback>
                            {shop.shop_name ? shop.shop_name[0] : 'S'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h2 className="text-3xl font-semibold tracking-tight">
                            {shop.shop_name}
                        </h2>
                        <p className="text-muted-foreground">
                            {shop.bio}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {shop.shop_categories?.map((category) => (
                            <Badge
                                key={category.category_id}
                                variant="secondary"
                            >
                                {category.categories?.name || 'Uncategorized'}
                            </Badge>
                        ))}
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Pencil className="h-4 w-4" />
                                Edit Profile
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <EditShopProfileForm shop={shop} setOpen={setOpen} />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}