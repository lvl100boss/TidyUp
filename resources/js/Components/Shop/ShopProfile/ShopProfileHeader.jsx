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

export default function ShopProfileHeader({ shop, isOwnerOrManager }) {
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
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                        <AvatarImage
                            src={shopPhotoUrl}
                            className="object-cover"
                            onError={(e) => {
                                console.log("Image failed to load:", e.target.src);
                                e.target.src = "/placeholder-image.jpg";
                            }}
                        />
                        <AvatarFallback>
                            {shop.shop_name ? shop.shop_name[0] : 'S'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight break-words">
                            {shop.shop_name}
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base mt-1 break-words">
                            {shop.bio}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-3 justify-center sm:justify-start">
                            {shop.shop_categories?.map((category) => (
                                <Badge
                                    key={category.category_id}
                                    variant="secondary"
                                    className="text-xs sm:text-sm"
                                >
                                    {category.categories?.name || 'Uncategorized'}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    {isOwnerOrManager && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 w-full sm:w-auto mt-4 sm:mt-0"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <EditShopProfileForm shop={shop} setOpen={setOpen} />
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}