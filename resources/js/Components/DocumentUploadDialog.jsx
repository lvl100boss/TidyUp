import React from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Loader2 } from 'lucide-react';

const DocumentUploadDialog = ({ isOpen, onClose, documentType, shopId, changeDetected, setChangeDetected }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        document: null,
        shop_id: shopId
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.document) {
            return;
        }

        const formData = new FormData();
        formData.append('document', data.document);
        formData.append('shop_id', shopId);

        post(route('shop.resubmission.legalDocument.update', { documentType }), {
            data: formData,
            onSuccess: () => {
                reset();
                onClose();
                if (changeDetected) return;
                setChangeDetected(true);
            },
            onError: (errors) => {
                console.error('Upload failed:', errors);
            },
            preserveScroll: true,
            preserveState: true,
            forceFormData: true
        });
    };

    if (!documentType) return null;

    const formattedTitle = documentType
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload {formattedTitle}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="document">Document</Label>
                        <Input
                            id="document"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('document', e.target.files[0])}
                            className="cursor-pointer"
                        />
                        {errors.document && (
                            <p className="text-sm text-red-500">{errors.document}</p>
                        )}
                        {errors.shop_id && (
                            <p className="text-sm text-red-500">{errors.shop_id}</p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.document}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                'Upload'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentUploadDialog; 