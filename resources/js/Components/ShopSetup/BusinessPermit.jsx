import React, { useState, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import { Info, CheckCircle, X, Calendar } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";

export default function BusinessPermit({
    data,
    handlePermitImageChange,
    handleDtiRegistrationImageChange,
    handleValidIdImageChange,
    previewPermitImage,
    previewDtiRegistrationImage,
    previewValidIdImage,
    errors,
    setAllFieldsFilled,
    allFieldsFilled,
}) {
    // State to track which image is being viewed in expanded mode
    const [expandedImage, setExpandedImage] = useState(null);
    
    // Track uploaded documents status
    const [uploadStatus, setUploadStatus] = useState({
        business_permit: null,
        dti_registration: null,
        valid_id: null
    });

    // Set allFieldsFilled based on document uploads
    useEffect(() => {
        if (
            data.business_permit &&
            data.dti_registration &&
            data.valid_id &&
            !allFieldsFilled
        ) {
            setAllFieldsFilled(true);
        } else if (
            (!data.business_permit ||
            !data.dti_registration ||
            !data.valid_id) &&
            allFieldsFilled
        ) {
            setAllFieldsFilled(false);
        }
    }, [data.business_permit, data.dti_registration, data.valid_id, allFieldsFilled, setAllFieldsFilled]);

    // Add event listener to close expanded image when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (expandedImage && !e.target.closest('.expanded-image-content')) {
                setExpandedImage(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        // Clean up event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [expandedImage]);

    // Update document upload status
    const updateUploadStatus = (documentType, file) => {
        if (file) {
            setUploadStatus(prev => ({
                ...prev,
                [documentType]: 'uploaded'
            }));
        } else {
            setUploadStatus(prev => ({
                ...prev,
                [documentType]: null
            }));
        }
    };

    // Handle file changes with status updates
    const handleFileChangeWithStatus = (e, originalHandler, documentType) => {
        // Call the original handler to update the preview
        originalHandler(e);

        // Update the upload status
        if (e.target.files && e.target.files.length > 0) {
            updateUploadStatus(documentType, e.target.files[0]);
        } else {
            updateUploadStatus(documentType, null);
        }
    };

    // Function to toggle image expansion
    const toggleImageExpand = (imageType) => {
        let imageUrl = null;
        switch (imageType) {
            case 'business_permit':
                imageUrl = previewPermitImage;
                break;
            case 'dti_registration':
                imageUrl = previewDtiRegistrationImage;
                break;
            case 'valid_id':
                imageUrl = previewValidIdImage;
                break;
            default:
                break;
        }

        if (imageUrl) {
            setExpandedImage(expandedImage === imageType ? null : imageType);
        }
    };

    // Get the appropriate image URL for expanded view
    const getExpandedImageUrl = () => {
        switch (expandedImage) {
            case 'business_permit':
                return previewPermitImage;
            case 'dti_registration':
                return previewDtiRegistrationImage;
            case 'valid_id':
                return previewValidIdImage;
            default:
                return null;
        }
    };

    // Get the title for expanded image modal
    const getExpandedImageTitle = () => {
        switch (expandedImage) {
            case 'business_permit':
                return 'Business Permit';
            case 'dti_registration':
                return 'DTI Registration';
            case 'valid_id':
                return 'Valid ID';
            default:
                return '';
        }
    };

    // Render upload status
    const renderUploadStatus = (documentType) => {
        const status = uploadStatus[documentType];
        
        if (!status) return null;
        
        return (
            <Alert className="bg-green-950 border-green-900 text-green-100 dark:bg-green-100 dark:border-green-200 dark:text-green-800 mt-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center flex-wrap">
                        Document uploaded successfully
                        <Badge variant="outline" className="ml-2 text-xs font-normal bg-blue-100 text-blue-800 border-blue-300">
                            Will be reviewed by admin
                        </Badge>
                    </AlertDescription>
                </div>
                <div className="mt-2 text-sm">
                    <p className="font-medium">Information:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Please ensure your document is clearly readable</li>
                        <li>The document should not be expired</li>
                        <li>Our team will manually verify your documents</li>
                    </ul>
                </div>
            </Alert>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold">Legal Documents</h1>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Business Permit</h2>
                <Label htmlFor="business_permit">Upload Business Permit</Label>
                <div className="grid gap-4">
                    <Input
                        type="file"
                        id="business_permit"
                        accept="image/*"
                        onChange={(e) => handleFileChangeWithStatus(e, handlePermitImageChange, 'business_permit')}
                        className="cursor-pointer pt-2"
                    />
                    {previewPermitImage && (
                        <div className="relative w-full max-w-md mx-auto">
                            <img
                                src={previewPermitImage}
                                alt="Business permit preview"
                                className="w-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => toggleImageExpand('business_permit')}
                            />
                            <div className="text-xs text-center mt-1 text-muted-foreground">Click to enlarge</div>
                        </div>
                    )}
                    {renderUploadStatus('business_permit')}
                    <InputError field="business_permit" errors={errors} />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">DTI Registration</h2>
                <Label htmlFor="dti_registration">
                    Upload DTI Registration
                </Label>
                <Input
                    type="file"
                    id="dti_registration"
                    accept="image/*"
                    onChange={(e) => handleFileChangeWithStatus(e, handleDtiRegistrationImageChange, 'dti_registration')}
                    className="cursor-pointer pt-2"
                />
                {previewDtiRegistrationImage && (
                    <div className="relative w-full max-w-md mx-auto">
                        <img
                            src={previewDtiRegistrationImage}
                            alt="DTI registration preview"
                            className="w-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => toggleImageExpand('dti_registration')}
                        />
                        <div className="text-xs text-center mt-1 text-muted-foreground">Click to enlarge</div>
                    </div>
                )}
                {renderUploadStatus('dti_registration')}
                <InputError field="dti_registration" errors={errors} />
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Valid ID</h2>
                <Label htmlFor="valid_id">Upload Valid ID</Label>
                <Input
                    type="file"
                    id="valid_id"
                    accept="image/*"
                    onChange={(e) => handleFileChangeWithStatus(e, handleValidIdImageChange, 'valid_id')}
                    className="cursor-pointer pt-2"
                />
                {previewValidIdImage && (
                    <div className="relative w-full max-w-md mx-auto">
                        <img
                            src={previewValidIdImage}
                            alt="Valid ID preview"
                            className="w-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => toggleImageExpand('valid_id')}
                        />
                        <div className="text-xs text-center mt-1 text-muted-foreground">Click to enlarge</div>
                    </div>
                )}
                {renderUploadStatus('valid_id')}
                <InputError field="valid_id" errors={errors} />
            </div>

            <div className="p-4 bg-accent/20 dark:bg-muted/30 rounded-lg text-sm text-foreground">
                <div className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    <p>
                        All documents are encrypted and stored securely in
                        compliance with data protection regulations. Access is
                        strictly limited to verification purposes only.
                    </p>
                </div>
            </div>

            {/* Expanded Image Modal */}
            {expandedImage && (
                <div className="fixed inset-0 bg-white/80 dark:bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl expanded-image-content border border-border">
                        <div className="p-4 border-b border-border flex justify-between items-center">
                            <h3 className="text-lg font-medium text-foreground">{getExpandedImageTitle()}</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setExpandedImage(null)}
                                className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="p-4 flex items-center justify-center overflow-auto max-h-[calc(90vh-100px)] bg-popover">
                            <img
                                src={getExpandedImageUrl()}
                                alt={`${getExpandedImageTitle()} full preview`}
                                className="max-w-full max-h-[calc(90vh-120px)] object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
