import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";

export default function Gallery({
    handleMainImageChange,
    handleGalleryImagesChange,
    removeGalleryImage,
    previewMainImage,
    previewGalleryImages,
    errors,
}) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Shop Gallery</h2>

            <div className="space-y-4">
                <Label htmlFor="main_image">Main Profile Picture</Label>
                <div className="grid gap-4">
                    <Input
                        type="file"
                        id="main_image"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="cursor-pointer"
                    />
                    {previewMainImage && (
                        <div className="relative w-40 h-40">
                            <img
                                src={previewMainImage}
                                alt="Main profile preview"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    )}
                    <InputError field="main_image" errors={errors} />
                </div>
            </div>

            <div className="space-y-4">
                <Label htmlFor="gallery_images">Shop Gallery</Label>
                <div className="grid gap-4">
                    <Input
                        type="file"
                        id="gallery_images"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImagesChange}
                        className="cursor-pointer"
                    />
                    <div className="grid grid-cols-3 gap-4">
                        {previewGalleryImages.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview}
                                    alt={`Gallery preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeGalleryImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <InputError field="gallery_images" errors={errors} />
                </div>
            </div>
        </div>
    );
}
