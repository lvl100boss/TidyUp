import React, { useState, useRef } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";
import { Camera, Pencil, X, Upload, Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";

const ShopGalleryCard = ({ shop_gallery }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleImageSelect = (imageId) => {
        setSelectedImages((prev) =>
            prev.includes(imageId)
                ? prev.filter((id) => id !== imageId)
                : [...prev, imageId]
        );
    };

    const handleDelete = () => {
        if (!selectedImages.length) return;

        router.delete(route("shop.gallery.delete"), {
            data: { images: selectedImages },
            onSuccess: () => {
                setSelectedImages([]);
                setIsEditing(false);
            },
        });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        // Create preview URLs
        const newPreviewImages = files.map((file) => ({
            url: URL.createObjectURL(file),
            file: file,
        }));

        setPreviewImages([...previewImages, ...newPreviewImages]);

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images[]", file);
        });

        router.post(route("shop.gallery.upload"), formData, {
            forceFormData: true,
            onSuccess: () => {
                e.target.value = "";
                setPreviewImages([]); // Clear previews after successful upload
            },
            onError: () => {
                // Remove previews if upload fails
                newPreviewImages.forEach((preview) =>
                    URL.revokeObjectURL(preview.url)
                );
                setPreviewImages(
                    previewImages.filter((p) => !newPreviewImages.includes(p))
                );
            },
        });
    };

    const cancelUpload = (previewToRemove) => {
        URL.revokeObjectURL(previewToRemove.url);
        setPreviewImages(
            previewImages.filter((preview) => preview !== previewToRemove)
        );
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Gallery
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setIsEditing(!isEditing);
                            setSelectedImages([]);
                        }}
                    >
                        {isEditing ? (
                            <X className="h-4 w-4" />
                        ) : (
                            <Pencil className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                <CardDescription>
                    Browse our salon's portfolio and facilities
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {shop_gallery.map((galleryImage) => (
                        <div key={galleryImage.id} className="relative">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div
                                        className={`aspect-square cursor-pointer relative group overflow-hidden rounded-lg ${isEditing &&
                                            selectedImages.includes(
                                                galleryImage.id
                                            )
                                            ? "ring-2 ring-red-500"
                                            : ""
                                            }`}
                                        onClick={(e) => {
                                            if (isEditing) {
                                                e.preventDefault();
                                                handleImageSelect(
                                                    galleryImage.id
                                                );
                                            }
                                        }}
                                    >
                                        <img
                                            src={`/${galleryImage.url}`}
                                            alt={`Gallery image ${galleryImage.id}`}
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {isEditing && (
                                            <div className="absolute top-2 right-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedImages.includes(
                                                        galleryImage.id
                                                    )}
                                                    onChange={() =>
                                                        handleImageSelect(
                                                            galleryImage.id
                                                        )
                                                    }
                                                    className="w-4 h-4 invisible"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </DialogTrigger>
                                {!isEditing && (
                                    <DialogContent className="max-w-3xl">
                                        <img
                                            src={`/${galleryImage.url}`}
                                            alt={`Gallery image ${galleryImage.id}`}
                                            className="w-full h-auto rounded-lg"
                                        />
                                    </DialogContent>
                                )}
                            </Dialog>
                        </div>
                    ))}

                    {/* Preview Images */}
                    {previewImages.map((preview, index) => (
                        <div key={index} className="relative aspect-square">
                            <div className="w-full h-full rounded-lg overflow-hidden">
                                <img
                                    src={preview.url}
                                    alt={`Preview ${index}`}
                                    className="object-cover w-full h-full"
                                />
                                <button
                                    onClick={() => cancelUpload(preview)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Upload Button */}
                    {isEditing && (
                        <div className="aspect-square relative">
                            <Button
                                variant="outline"
                                className="w-full h-full flex flex-col items-center justify-center gap-2"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Plus className="h-8 w-8" />
                                <span>Add Images</span>
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
            {isEditing && selectedImages.length > 0 && (
                <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete Selected ({selectedImages.length})
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};

export default ShopGalleryCard;
