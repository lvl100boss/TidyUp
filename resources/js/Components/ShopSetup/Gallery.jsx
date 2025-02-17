import React, { useState, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";

export default function Gallery({
    data,
    handleMainImageChange,
    handleGalleryImagesChange,
    removeGalleryImage,
    previewMainImage,
    previewGalleryImages,
    setAllFieldsFilled,
    allFieldsFilled,
    errors,
}) {
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertAnimate, setAlertAnimate] = useState(false);

    const handleGalleryImagesChangeWithLimit = (e) => {
        if (e.target.files.length + previewGalleryImages.length > 6) {
            setAlertVisible(true);
            setAlertAnimate(true);
            return;
        }
        handleGalleryImagesChange(e);
    };

    useEffect(() => {
        let timer1, timer2;
        if (alertVisible) {
            // After 4 seconds, trigger the fade out animation.
            timer1 = setTimeout(() => {
                setAlertAnimate(false);
            }, 4000);
            // Remove the alert from the DOM after fade out (0.5s later).
            timer2 = setTimeout(() => {
                setAlertVisible(false);
            }, 4500);
        }
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [alertVisible]);

    if (data.shop_photo && data.shop_gallery.length > 0 && !allFieldsFilled) {
        setAllFieldsFilled(true);
    } else if (
        !data.shop_photo &&
        data.shop_gallery.length === 0 &&
        allFieldsFilled
    ) {
        setAllFieldsFilled(false);
    }
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Shop Gallery</h2>

            {alertVisible && (
                <Alert
                    className={`bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 fixed bottom-10 right-5 max-w-lg transform transition-all duration-500 ${
                        alertAnimate
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-5"
                    }`}
                >
                    <Terminal className="h-4 w-4 stroke-yellow-700" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                        You can only upload up to 6 images.
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
                <div>
                    <Label htmlFor="shop_photo">Main Profile Picture</Label>
                    <Input
                        type="file"
                        id="shop_photo"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="cursor-pointer pt-2"
                    />
                </div>
                <div className="grid gap-4">
                    {previewMainImage && (
                        <div className="relative aspect-video h-40">
                            <img
                                src={previewMainImage}
                                alt="Main profile preview"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    )}
                    <InputError field="shop_photo" errors={errors} />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="shop_gallery">Shop Gallery</Label>
                    <Input
                        type="file"
                        id="shop_gallery"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImagesChangeWithLimit}
                        className="cursor-pointer pt-2"
                    />
                </div>
                <div className="grid gap-4">
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
                    <InputError field="shop_gallery" errors={errors} />
                </div>
            </div>
        </div>
    );
}
