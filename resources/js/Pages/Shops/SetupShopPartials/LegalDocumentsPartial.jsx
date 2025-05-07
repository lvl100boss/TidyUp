import React, { useState, useEffect } from 'react';
import ResubmitForm from '@/Components/ResubmitForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Eye, Upload, X } from 'lucide-react';
import { Label } from '@/Components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

// Document types we need to collect
const requiredDocuments = ['business_permit', 'dti_registration', 'valid_id'];

const LegalDocumentsPartial = ({ data, setData, errors }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

    // Initialize documents in parent form data if not present
    useEffect(() => {
        if (!data.legal_documents) {
            setData('legal_documents', {
                business_permit: null,
                dti_registration: null,
                valid_id: null
            });
        }
    }, []);

    const formatTitle = (key) => {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleFileChange = (e, documentType) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setData(prevData => ({
                ...prevData,
                legal_documents: {
                    ...prevData.legal_documents,
                    [documentType]: {
                        file,
                        preview: reader.result,
                        name: file.name
                    }
                }
            }));
        };
        reader.readAsDataURL(file);
        e.target.value = null;
    };

    const handleRemoveFile = (documentType) => {
        setData(prevData => ({
            ...prevData,
            legal_documents: {
                ...prevData.legal_documents,
                [documentType]: null
            }
        }));
    };

    const handlePreviewClick = (fileData, type) => {
        if (!fileData || !fileData.preview) return;

        setSelectedImage({ ...fileData, type });
        setIsImageViewerOpen(true);
    };

    return (
        <ResubmitForm
            title="Legal Documents"
            icon="FileUser"
        >
            <Card className="-my-4 -mx-5 border-0 shadow-none bg-background/0">
                <CardHeader>
                    <CardTitle>Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {data.legal_documents && requiredDocuments.map((documentType) => (
                            <div key={documentType} className="space-y-2">
                                <Label htmlFor={documentType}>{formatTitle(documentType)}</Label>

                                {!data.legal_documents[documentType] ? (
                                    <div className="flex items-center">
                                        <input
                                            type="file"
                                            id={documentType}
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, documentType)}
                                        />
                                        <Label
                                            htmlFor={documentType}
                                            className="flex h-32 w-full cursor-pointer items-center justify-center rounded-md border border-dashed"
                                        >
                                            <div className="flex flex-col items-center">
                                                <Upload className="h-8 w-8 text-muted-foreground" />
                                                <span className="mt-2 text-sm font-medium text-muted-foreground">Select {formatTitle(documentType)}</span>
                                            </div>
                                        </Label>
                                        {errors[`legal_documents.${documentType}`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`legal_documents.${documentType}`]}</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="group relative h-48 rounded-md overflow-hidden border">
                                            <img
                                                src={data.legal_documents[documentType].preview}
                                                alt={formatTitle(documentType)}
                                                className="h-full w-full object-contain"
                                            />
                                            <div
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                                onClick={() => handlePreviewClick(data.legal_documents[documentType], documentType)}
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
                                            onClick={() => handleRemoveFile(documentType)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            {data.legal_documents[documentType].name}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {errors.legal_documents && typeof errors.legal_documents === 'string' && (
                            <p className="text-red-500 text-xs mt-2">{errors.legal_documents}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>{selectedImage && formatTitle(selectedImage.type)}</DialogTitle>
                    </DialogHeader>
                    {selectedImage && selectedImage.preview && (
                        <div className="overflow-auto p-4">
                            <img
                                src={selectedImage.preview}
                                alt={formatTitle(selectedImage.type)}
                                className="w-full h-auto max-h-[calc(90vh-8rem)] object-contain rounded-md"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </ResubmitForm>
    );
};

export default LegalDocumentsPartial;
