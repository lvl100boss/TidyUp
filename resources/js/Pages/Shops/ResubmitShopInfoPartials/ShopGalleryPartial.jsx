import React, { useState } from 'react';
import ResubmitForm from '@/Components/ResubmitForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Eye, FileEdit, Plus, Trash2 } from 'lucide-react';
import GalleryUploadDialog from '@/Components/GalleryUploadDialog';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

const ShopGalleryPartial = ({ shop, changeDetected, setChangeDetected }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState(null);
    const [uploadType, setUploadType] = useState('main');
    const { delete: destroy } = useForm();
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const handleImageClick = (path, type) => {
        setSelectedImage({ path, type });
        setIsImageViewerOpen(true);
    };

    const handleEditPhoto = (type) => {
        setUploadType(type);
        setUploadDialogOpen(true);
    };

    const handleDelete = (photoId) => {
        setPhotoToDelete(photoId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (photoToDelete) {
            destroy(route('shop.resubmission.gallery.delete', { photoId: photoToDelete }), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Photo deleted successfully');
                    setIsDeleteDialogOpen(false);
                    setPhotoToDelete(null);
                    if (changeDetected) return;
                    setChangeDetected(true);
                },
                onError: (errors) => {
                    Object.values(errors).forEach(error => {
                        toast.error(error);
                    });
                },
            });
        }
    };

    const handleSuccess = () => {
        setIsUploadDialogOpen(false);
    };

    return (
        <ResubmitForm
            title="Shop Gallery"
            icon="Image"
        >
            <div className='grid grid-cols-1 gap-4'>
                {/* Main Photo */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Main Photo</CardTitle>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditPhoto('main')}
                            className="h-8 w-8"
                        >
                            <FileEdit className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {shop.shop_photo ? (
                            <div
                                className="relative cursor-pointer group"
                                onClick={() => handleImageClick(shop.shop_photo, 'Main Photo')}
                            >
                                <img
                                    src={`/${shop.shop_photo}`}
                                    alt="Main Photo"
                                    className="object-cover h-64 rounded-lg w-full"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                    <div className="text-white flex items-center gap-2">
                                        <Eye className="h-5 w-5" />
                                        <span>Click to view full image</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>No main photo uploaded.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Gallery Photos */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Gallery Photos</CardTitle>
                        {shop.shop_gallery && shop.shop_gallery.length < 6 && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditPhoto('gallery')}
                                className="h-8 w-8"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {shop.shop_gallery && shop.shop_gallery.length > 0 ? (
                                shop.shop_gallery.map((photo, index) => (
                                    <div
                                        key={photo.id}
                                        className="relative group"
                                    >
                                        <div
                                            className="relative cursor-pointer"
                                            onClick={() => handleImageClick(photo.url, `Gallery Photo ${index + 1}`)}
                                        >
                                            <img
                                                src={`/${photo.url}`}
                                                alt={`Gallery Photo ${index + 1}`}
                                                className="object-cover h-48 rounded-lg w-full"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                                <div className="text-white flex items-center gap-2">
                                                    <Eye className="h-5 w-5" />
                                                    <span>Click to view full image</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() => handleDelete(photo.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p>No gallery photos uploaded.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Image Viewer Dialog */}
            <Dialog
                open={isImageViewerOpen}
                onOpenChange={setIsImageViewerOpen}

            >
                <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{selectedImage && selectedImage.type}</DialogTitle>
                    </DialogHeader>
                    {selectedImage && (
                        <div className="overflow-auto p-4">
                            <img
                                src={`/${selectedImage.path}`}
                                alt={selectedImage.type}
                                className="w-full h-auto max-h-[calc(90vh-8rem)] object-contain rounded-lg"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Photo</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this photo? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setPhotoToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Gallery Upload Dialog */}
            <GalleryUploadDialog
                isOpen={uploadDialogOpen}
                onClose={() => {
                    setUploadDialogOpen(false);
                    setUploadType(null);
                }}
                type={uploadType}
                shopId={shop.id}
                currentGalleryCount={shop.shop_gallery?.length || 0}
                changeDetected={changeDetected}
                setChangeDetected={setChangeDetected}
            />
        </ResubmitForm>
    );
}

export default ShopGalleryPartial; 