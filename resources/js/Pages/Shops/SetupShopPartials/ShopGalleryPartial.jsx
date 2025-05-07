import React, { useState, useEffect } from 'react';
import ResubmitForm from '@/Components/ResubmitForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Eye, Upload, X, Plus } from 'lucide-react';
import { Label } from '@/Components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

const MAX_GALLERY_PHOTOS = 6;

const ShopGalleryPartial = ({ data, setData, errors }) => {
    // Local UI state
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

    // Initialize gallery data in parent form if not present
    useEffect(() => {
        if (!data.shop_gallery) {
            setData('shop_gallery', {
                main_photo: null,
                gallery_photos: []
            });
        }
    }, []);

    const formatTitle = (type, index = null) => {
        if (type === 'main') return 'Main Photo';
        if (type === 'gallery' && index !== null) return `Gallery Photo ${index + 1}`;
        return 'Photo';
    };

    const handleFileChange = (e, type) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (type === 'main') {
            // Handle single file for main photo
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setData('shop_gallery', {
                    ...data.shop_gallery,
                    main_photo: {
                        file,
                        preview: reader.result,
                        name: file.name,
                    }
                });
            };
            reader.readAsDataURL(file);
        } else if (type === 'gallery') {
            // Get current gallery photos or initialize empty array
            const currentPhotos = data.shop_gallery?.gallery_photos || [];

            // Handle multiple files for gallery
            const filesToProcess = Array.from(files).slice(0, MAX_GALLERY_PHOTOS - currentPhotos.length);

            // Process each file and update state after all files are processed
            const newPhotos = [...currentPhotos];

            const processFiles = async () => {
                for (const file of filesToProcess) {
                    // Process file and add to array
                    const photoData = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve({
                                file,
                                preview: reader.result,
                                name: file.name,
                                id: Date.now() + Math.random()
                            });
                        };
                        reader.readAsDataURL(file);
                    });

                    newPhotos.push(photoData);
                }

                // Update parent form state with all new photos
                setData('shop_gallery', {
                    ...data.shop_gallery,
                    gallery_photos: newPhotos
                });
            };

            processFiles();
        }

        e.target.value = null; // Reset input
    };

    const handleRemovePhoto = (type, id = null) => {
        if (type === 'main') {
            setData('shop_gallery', {
                ...data.shop_gallery,
                main_photo: null
            });
        } else if (type === 'gallery' && id !== null) {
            setData('shop_gallery', {
                ...data.shop_gallery,
                gallery_photos: data.shop_gallery.gallery_photos.filter(photo => photo.id !== id)
            });
        }
    };

    const handlePreviewClick = (photoData, type, index = null) => {
        if (!photoData || !photoData.preview) return;
        setSelectedImage({ ...photoData, type: formatTitle(type, index) });
        setIsImageViewerOpen(true);
    };

    // Safety check for accessing shop_gallery
    const mainPhoto = data.shop_gallery?.main_photo || null;
    const galleryPhotos = data.shop_gallery?.gallery_photos || [];

    return (
        <ResubmitForm
            title="Shop Gallery"
            icon="Image"
        >
            <div className='grid grid-cols-1 gap-6'>
                {/* Main Photo */}
                <Card className="-my-4 -mx-5 border-0 shadow-none bg-background/0">
                    <CardHeader>
                        <CardTitle>Main Photo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!mainPhoto ? (
                            <div className="flex items-center">
                                <input
                                    type="file"
                                    id="main_photo_input"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'main')}
                                />
                                <Label
                                    htmlFor="main_photo_input"
                                    className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md border border-dashed"
                                >
                                    <div className="flex flex-col items-center">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <span className="mt-2 text-sm font-medium text-muted-foreground">Select Main Photo</span>
                                    </div>
                                </Label>
                                {errors.shop_gallery?.main_photo && (
                                    <p className="text-red-500 text-xs mt-1">{errors.shop_gallery.main_photo}</p>
                                )}
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="group relative h-64 rounded-md overflow-hidden border">
                                    <img
                                        src={mainPhoto.preview}
                                        alt={formatTitle('main')}
                                        className="h-full w-full object-contain"
                                    />
                                    <div
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                        onClick={() => handlePreviewClick(mainPhoto, 'main')}
                                    >
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 bg-background"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6"
                                    onClick={() => handleRemovePhoto('main')}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                                <div className="mt-2 text-sm text-muted-foreground">
                                    {mainPhoto.name}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Gallery Photos */}
                <Card className="-my-4 -mx-5 border-0 shadow-none bg-background/0">
                    <CardHeader>
                        <CardTitle>Gallery Photos (Max {MAX_GALLERY_PHOTOS})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {galleryPhotos.map((photo, index) => (
                                <div key={photo.id} className="relative">
                                    <div className="group relative h-48 rounded-md overflow-hidden border">
                                        <img
                                            src={photo.preview}
                                            alt={formatTitle('gallery', index)}
                                            className="h-full w-full object-contain"
                                        />
                                        <div
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                            onClick={() => handlePreviewClick(photo, 'gallery', index)}
                                        >
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8 bg-background"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6"
                                        onClick={() => handleRemovePhoto('gallery', photo.id)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                    <div className="mt-1 text-xs text-muted-foreground truncate" title={photo.name}>
                                        {photo.name}
                                    </div>
                                </div>
                            ))}

                            {/* Add Photo Button/Input */}
                            {galleryPhotos.length < MAX_GALLERY_PHOTOS && (
                                <div className="flex items-center justify-center">
                                    <input
                                        type="file"
                                        id="gallery_photo_input"
                                        className="sr-only"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleFileChange(e, 'gallery')}
                                    />
                                    <Label
                                        htmlFor="gallery_photo_input"
                                        className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md border border-dashed"
                                    >
                                        <div className="flex flex-col items-center">
                                            <Plus className="h-8 w-8 text-muted-foreground" />
                                            <span className="mt-2 text-sm font-medium text-muted-foreground">Add Gallery Photo</span>
                                            <span className="text-xs text-muted-foreground">({galleryPhotos.length}/{MAX_GALLERY_PHOTOS})</span>
                                        </div>
                                    </Label>
                                </div>
                            )}
                        </div>
                        {galleryPhotos.length === 0 && galleryPhotos.length < MAX_GALLERY_PHOTOS && (
                            <p className="text-sm text-muted-foreground mt-4 text-center">No gallery photos added yet.</p>
                        )}
                        {errors.shop_gallery?.gallery_photos && (
                            <p className="text-red-500 text-xs mt-2">{errors.shop_gallery.gallery_photos}</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Image Viewer Dialog */}
            <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{selectedImage && selectedImage.type}</DialogTitle>
                    </DialogHeader>
                    {selectedImage && selectedImage.preview && (
                        <div className="overflow-auto p-4">
                            <img
                                src={selectedImage.preview}
                                alt={selectedImage.type}
                                className="w-full h-auto max-h-[calc(90vh-8rem)] object-contain rounded-md"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </ResubmitForm>
    );
};

export default ShopGalleryPartial;