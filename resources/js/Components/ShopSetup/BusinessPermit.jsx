import React, { useState, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import { Info, CheckCircle, AlertTriangle, XCircle, Loader2, X } from "lucide-react";
import axios from "axios";
import { Button } from "@/Components/ui/button";
import { Alert, AlertDescription } from "@/Components/ui/alert";

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
    const [verificationStatus, setVerificationStatus] = useState({
        business_permit: { status: null, message: "", issue: null, statusType: null, loading: false },
        dti_registration: { status: null, message: "", issue: null, statusType: null, loading: false },
        valid_id: { status: null, message: "", issue: null, statusType: null, loading: false },
    });

    // State to track which image is being viewed in expanded mode
    const [expandedImage, setExpandedImage] = useState(null);

    if (
        data.business_permit &&
        data.dti_registration &&
        data.valid_id &&
        !allFieldsFilled
    ) {
        setAllFieldsFilled(true);
    } else if (
        !data.business_permit &&
        !data.dti_registration &&
        !data.valid_id &&
        allFieldsFilled
    ) {
        setAllFieldsFilled(false);
    }

    // Get CSRF token for non-authenticated routes
    useEffect(() => {
        // Get the CSRF token from the meta tag
        const token = document.head.querySelector('meta[name="csrf-token"]');
        if (token) {
            axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
        } else {
            console.error('CSRF token not found');
        }

        // Add event listener to close expanded image when clicking outside
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

    // const verifyDocument = async (documentType, file) => {
    //     if (!file) return;

    //     // Set loading state
    //     setVerificationStatus(prev => ({
    //         ...prev,
    //         [documentType]: { ...prev[documentType], loading: true }
    //     }));

    //     const formData = new FormData();
    //     formData.append('image', file);

    //     try {
    //         let endpoint = '';
    //         switch (documentType) {
    //             case 'business_permit':
    //                 endpoint = 'api/verify/business-permit';
    //                 break;
    //             case 'dti_registration':
    //                 endpoint = 'api/verify/dti-registration';
    //                 break;
    //             case 'valid_id':
    //                 endpoint = 'api/verify/valid-id';
    //                 break;
    //         }

    //         // Use relative URL for better compatibility
    //         const response = await axios.post(`/${endpoint}`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //                 'Accept': 'application/json'
    //             }
    //         });

    //         setVerificationStatus(prev => ({
    //             ...prev,
    //             [documentType]: {
    //                 status: response.data.is_valid,
    //                 message: response.data.message,
    //                 issue: response.data.issue || null,
    //                 statusType: response.data.status || (response.data.is_valid ? 'success' : 'error'),
    //                 loading: false
    //             }
    //         }));
    //     } catch (error) {
    //         setVerificationStatus(prev => ({
    //             ...prev,
    //             [documentType]: {
    //                 status: false,
    //                 message: error.response?.data?.message || 'Verification failed',
    //                 issue: 'server_error',
    //                 statusType: 'error',
    //                 loading: false
    //             }
    //         }));
    //     }
    // };

    const handleFileChangeWithVerification = (e, originalHandler, documentType) => {
        // Call the original handler first to update the preview
        originalHandler(e);

        // Then verify the document if a file is selected
        if (e.target.files && e.target.files[0]) {
            verifyDocument(documentType, e.target.files[0]);
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

    const renderVerificationStatus = (documentType) => {
        const { status, message, loading, statusType } = verificationStatus[documentType];

        if (loading) {
            return (
                <Alert className="bg-blue-50 border-blue-100 text-blue-700 mt-2">
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <AlertDescription>Verifying document, please wait...</AlertDescription>
                    </div>
                </Alert>
            );
        }

        if (status === null) return null;

        if (status) {
            // Success case
            return (
                <Alert className="bg-green-50 border-green-100 text-green-700 mt-2">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{message}</AlertDescription>
                    </div>
                </Alert>
            );
        } else {
            // Error or warning case based on statusType
            if (statusType === 'warning') {
                return (
                    <Alert className="bg-yellow-50 border-yellow-100 text-yellow-700 mt-2">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{message}</AlertDescription>
                        </div>
                    </Alert>
                );
            } else {
                return (
                    <Alert className="bg-red-50 border-red-100 text-red-700 mt-2">
                        <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>{message}</AlertDescription>
                        </div>
                    </Alert>
                );
            }
        }
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
                        onChange={(e) => handleFileChangeWithVerification(e, handlePermitImageChange, 'business_permit')}
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
                    {renderVerificationStatus('business_permit')}
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
                    onChange={(e) => handleFileChangeWithVerification(e, handleDtiRegistrationImageChange, 'dti_registration')}
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
                {renderVerificationStatus('dti_registration')}
                <InputError field="dti_registration" errors={errors} />
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Valid ID</h2>
                <Label htmlFor="valid_id">Upload Valid ID</Label>
                <Input
                    type="file"
                    id="valid_id"
                    accept="image/*"
                    onChange={(e) => handleFileChangeWithVerification(e, handleValidIdImageChange, 'valid_id')}
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
                {renderVerificationStatus('valid_id')}
                <InputError field="valid_id" errors={errors} />
            </div>

            <div className="p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
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
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl expanded-image-content">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-medium">{getExpandedImageTitle()}</h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setExpandedImage(null)}
                                className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="p-4 flex items-center justify-center overflow-auto max-h-[calc(90vh-100px)]">
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
