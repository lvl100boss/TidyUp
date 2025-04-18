import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from 'sonner';

const GalleryUploadDialog = ({ isOpen, onClose, type, shopId, currentGalleryCount, changeDetected, setChangeDetected }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        shop_id: shopId,
        photos: null
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const maxFiles = type === 'main' ? 1 : 6 - currentGalleryCount;

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (type === 'main') {
            // For main photo, only take the first file
            setSelectedFiles(files.slice(0, 1));
            setData('photos', files.slice(0, 1));
        } else {
            // For gallery, limit to available slots
            if (files.length > maxFiles) {
                toast.error(`You can only upload ${maxFiles} more photo${maxFiles !== 1 ? 's' : ''} to reach the maximum of 6 photos.`);
                return;
            }
            setSelectedFiles(files);
            setData('photos', files);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedFiles.length) {
            toast.error('Please select at least one photo to upload');
            return;
        }

        const formData = new FormData();
        formData.append('shop_id', shopId);
        selectedFiles.forEach((file, index) => {
            formData.append(`photos[${index}]`, file);
        });

        post(route('shop.resubmission.gallery.update', { type }), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Photos uploaded successfully');
                reset();
                setSelectedFiles([]);
                onClose();
                if (changeDetected) return;
                setChangeDetected(true);
            },
            onError: (errors) => {
                console.error('Upload failed:', errors);
                toast.error('Failed to upload photos. Please try again.');
            }
        });
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload {type === 'main' ? 'Main Photo' : 'Gallery Photos'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="photos">Select Photos</Label>
                        <Input
                            id="photos"
                            type="file"
                            multiple={type !== 'main'}
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                        />
                        {type !== 'main' && (
                            <p className="text-sm text-muted-foreground">
                                You can upload up to {maxFiles} more photo{maxFiles !== 1 ? 's' : ''} (current: {currentGalleryCount}/6)
                            </p>
                        )}
                        {selectedFiles.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                            </p>
                        )}
                        {errors.photos && (
                            <p className="text-sm text-red-500">{errors.photos}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !selectedFiles.length}>
                            {processing ? 'Uploading...' : 'Upload'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default GalleryUploadDialog; 