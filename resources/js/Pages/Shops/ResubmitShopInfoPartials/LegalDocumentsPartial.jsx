import React, { useState } from 'react';
import ResubmitForm from '@/Components/ResubmitForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { FileEdit, Eye } from 'lucide-react';
import DocumentUploadDialog from '@/Components/DocumentUploadDialog';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

const LegalDocumentsPartial = ({ legalDocuments, shopId, changeDetected, setChangeDetected }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDocumentType, setSelectedDocumentType] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

    const formatTitle = (key) => {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleEdit = (documentType) => {
        setSelectedDocumentType(documentType);
        setIsDialogOpen(true);
    };

    const handleImageClick = (path, type) => {
        setSelectedImage({ path, type });
        setIsImageViewerOpen(true);
    };

    return (
        <ResubmitForm
            title="Legal Documents"
            icon="FileUser"
        >
            <div className='grid grid-cols-1 gap-4'>
                {Object.entries(legalDocuments).map(([key, path]) => (
                    <Card key={key}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="">{formatTitle(key)}</CardTitle>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(key)}
                                className="h-8 w-8"
                            >
                                <FileEdit className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {path ? (
                                <div
                                    className="relative cursor-pointer group"
                                    onClick={() => handleImageClick(path, key)}
                                >
                                    <img
                                        src={`/storage/${path}`}
                                        alt={formatTitle(key)}
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
                                <p>No document uploaded.</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <DocumentUploadDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                documentType={selectedDocumentType}
                shopId={shopId}
                changeDetected={changeDetected}
                setChangeDetected={setChangeDetected}
            />

            <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{selectedImage && formatTitle(selectedImage.type)}</DialogTitle>
                    </DialogHeader>
                    {selectedImage && (
                        <div className="overflow-auto p-4">
                            <img
                                src={`/storage/${selectedImage.path}`}
                                alt={formatTitle(selectedImage.type)}
                                className="w-full h-auto max-h-[calc(90vh-8rem)] object-contain rounded-lg"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </ResubmitForm>
    );
}

export default LegalDocumentsPartial;
