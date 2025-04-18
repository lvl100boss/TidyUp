import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Check } from "lucide-react";
import { toast } from "sonner";

export function EditShopProfileForm({ shop, setOpen }) {
    // Use a proper path for the image with prefixing for storage urls
    const initialImageUrl = shop.shop_photo
        ? (shop.shop_photo.startsWith('http')
            ? shop.shop_photo
            : `/${shop.shop_photo}`)
        : null;

    const [previewUrl, setPreviewUrl] = useState(initialImageUrl);

    const form = useForm({
        shop_name: shop.shop_name || "",
        bio: shop.bio || "",
        shop_photo: null,
        shop_categories: shop.shop_categories?.map(category => category.category_id.toString()) || [],
    });

    useEffect(() => {
        // Log form data for debugging
        console.log("Form data:", form.data);
    }, [form.data]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            form.setData("shop_photo", file);

            // Create a preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Log what we're submitting
        console.log("Submitting form with data:", form.data);

        form.post(route("shop.update-shop-profile"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Edit Shop Profile</DialogTitle>
                <DialogDescription>
                    Update your shop's name, bio, and profile picture.
                </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <Avatar className="w-24 h-24 cursor-pointer relative group">
                            <AvatarImage src={previewUrl} className="object-cover" />
                            <AvatarFallback>{shop.shop_name ? shop.shop_name[0] : 'S'}</AvatarFallback>
                            <label
                                htmlFor="shop_photo"
                                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                            >
                                Change
                            </label>
                        </Avatar>
                        <Input
                            id="shop_photo"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('shop_photo').click()}
                        >
                            Upload Photo
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="shop_name"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Shop Name
                        </label>
                        <Input
                            id="shop_name"
                            name="shop_name"
                            value={form.data.shop_name}
                            onChange={(e) => form.setData("shop_name", e.target.value)}
                            placeholder="Enter shop name"
                            className={form.errors.shop_name ? "border-red-500" : ""}
                        />
                        {form.errors.shop_name && (
                            <p className="text-sm font-medium text-red-500">
                                {form.errors.shop_name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="bio"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Bio
                        </label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={form.data.bio || ""}
                            onChange={(e) => form.setData("bio", e.target.value)}
                            placeholder="Tell customers about your shop"
                            rows={4}
                            className={form.errors.bio ? "border-red-500" : ""}
                        />
                        {form.errors.bio && (
                            <p className="text-sm font-medium text-red-500">
                                {form.errors.bio}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Shop Categories
                        </label>
                        <ToggleGroup
                            type="multiple"
                            variant="outline"
                            className="w-fit"
                            onValueChange={(value) => {
                                form.setData("shop_categories", value);
                            }}
                            value={form.data.shop_categories}
                        >
                            <ToggleGroupItem value="1" className="flex items-center gap-2">
                                {form.data.shop_categories.includes("1") && <Check size={16} />}
                                <span>Barbershop</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="2" className="flex items-center gap-2">
                                {form.data.shop_categories.includes("2") && <Check size={16} />}
                                <span>Hair Salon</span>
                            </ToggleGroupItem>
                        </ToggleGroup>
                        {form.errors.shop_categories && (
                            <p className="text-sm font-medium text-red-500">
                                {form.errors.shop_categories}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing}
                        >
                            {form.processing ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
