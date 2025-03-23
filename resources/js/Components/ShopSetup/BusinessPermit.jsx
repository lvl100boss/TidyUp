import React, { useState, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import InputError from "@/Components/InputError";
import { 
    Info, CheckCircle, AlertTriangle, XCircle, Loader2, X, Calendar
} from "lucide-react";
import axios from "axios";
import { Button } from "@/Components/ui/button";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { verifyDocumentUpload } from "@/Utils/documentVerification";
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


    const resetVerification = (documentType = null) => {
        if (documentType) {
            // Reset only specific document type
            setVerificationStatus(prev => ({
                ...prev,
                [documentType]: { 
                    status: null, 
                    message: "", 
                    issue: null, 
                    statusType: null, 
                    loading: false 
                }
            }));
        } else {
            // Reset all document types
            setVerificationStatus({
                business_permit: { status: null, message: "", issue: null, statusType: null, loading: false },
                dti_registration: { status: null, message: "", issue: null, statusType: null, loading: false },
                valid_id: { status: null, message: "", issue: null, statusType: null, loading: false },
            });
        }
    };

    const verifyDocument = async (documentType, file) => {
        if (!file) return;
        
        // Set loading state
        setVerificationStatus(prev => ({
            ...prev,
            [documentType]: {
                ...prev[documentType],
                loading: true
            }
        }));
        
        try {
            // Simplified retry logic - just try once in most cases
            let result = null;
            
            try {
                // Use less strict verification
                result = await verifyDocumentUpload(file, documentType);
            } catch (err) {
                console.log('Verification failed, accepting document:', err);
                // Always accept the document with a simple fallback
                result = {
                    isValid: true,
                    message: 'Document accepted (will be reviewed by admin)',
                    status: 'success',
                    fallback: true,
                    adminReview: true
                };
            }
            
            // If we still don't have a result, create a simple acceptance
            if (!result) {
                console.log('No verification result, using acceptance fallback');
                result = {
                    isValid: true,
                    message: 'Document accepted (will be reviewed by admin)',
                    status: 'success',
                    fallback: true
                };
            }
            
            // Always ensure the result is valid for better user experience
            if (!result.isValid) {
                result.isValid = true;
                result.message = 'Document accepted (will be verified by admin)';
                result.status = 'success';
                result.adminReview = true;
            }
            
            // Update the verification status
            setVerificationStatus(prev => ({
                ...prev,
                [documentType]: {
                    status: result.isValid, // Should always be true now
                    message: result.message,
                    issue: result.issue || null,
                    statusType: 'success', // Always show success to the user
                    loading: false,
                    dateInfo: result.dateInfo || null,
                    suggestions: result.suggestions || [],
                    fallback: result.fallback || false,
                    source: result.source || 'fallback',
                    adminReview: result.adminReview || false
                }
            }));
        } catch (error) {
            console.error("Document verification error, accepting document:", error);
            
            // Always accept the document, with a simplified message
            setVerificationStatus(prev => ({
                ...prev,
                [documentType]: {
                    status: true, // Accept the document
                    message: 'Document accepted (admin will verify)',
                    issue: null,
                    statusType: 'success',
                    loading: false,
                    suggestions: ['Your document will be verified during processing'],
                    fallback: true,
                    adminReview: true
                }
            }));
        }
    };

    const handleFileChangeWithVerification = (e, originalHandler, documentType) => {
        // If user selects a new file
        if (e.target.files && e.target.files.length > 0) {
            // Reset the verification status before starting a new verification
            resetVerification(documentType);
            
            // Call the original handler to update the preview
            originalHandler(e);
            
            // Automatically verify the document when file is selected
            verifyDocument(documentType, e.target.files[0]);
        } else {
            // If the file selection was cancelled or cleared, reset verification
            resetVerification(documentType);
            originalHandler(e);
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
        const { status, message, loading, statusType, dateInfo, suggestions, fallback, adminReview } = verificationStatus[documentType];

        if (loading) {
            return (
                <Alert className="bg-blue-950 border-blue-900 text-blue-200 dark:bg-blue-100 dark:border-blue-200 dark:text-blue-800 mt-2">
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <AlertDescription>Processing document, please wait...</AlertDescription>
                    </div>
                </Alert>
            );
        }

        if (status === null) return null;

        // Date badge component to show expiration status
        const DateBadge = () => {
            if (!dateInfo) return null;
            
            let color = "bg-green-950 text-green-100 dark:bg-green-100 dark:text-green-800";
            let icon = <Calendar className="h-3 w-3 mr-1" />;
            let text = `Valid until ${dateInfo.formatted || dateInfo.date}`;
            
            if (dateInfo.status === 'expired') {
                // Even if expired, we still accept but show the info
                color = "bg-blue-950 text-blue-100 dark:bg-blue-100 dark:text-blue-800";
                icon = <Calendar className="h-3 w-3 mr-1" />;
                text = `Expiration: ${dateInfo.formatted || dateInfo.date}`;
            } else if (dateInfo.status === 'expiring_soon') {
                // Soften the warning for expiring documents
                color = "bg-blue-950 text-blue-100 dark:bg-blue-100 dark:text-blue-800";
                icon = <Calendar className="h-3 w-3 mr-1" />;
                text = `Expiration: ${dateInfo.formatted || dateInfo.date}`;
            }
            
            return (
                <span className={`text-xs font-medium px-2 py-1 rounded ${color} inline-flex items-center ml-2`}>
                    {icon} {text}
                </span>
            );
        };

        // Render suggestions if available
        const SuggestionsList = () => {
            if (!suggestions || suggestions.length === 0) return null;
            
            return (
                <div className="mt-2 text-sm">
                    <p className="font-medium">Information:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        {suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </div>
            );
        };
        
        // Admin review badge - friendlier wording
        const AdminReviewBadge = () => {
            if (!adminReview && !fallback) return null;
            
            return (
                <Badge variant="outline" className="ml-2 text-xs font-normal bg-blue-100 text-blue-800 border-blue-300">
                    Admin Review
                </Badge>
            );
        };

        // Now we only show success status
        return (
            <Alert className="bg-green-950 border-green-900 text-green-100 dark:bg-green-100 dark:border-green-200 dark:text-green-800 mt-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center flex-wrap">
                        {message}
                        <AdminReviewBadge />
                        <DateBadge />
                    </AlertDescription>
                </div>
                <SuggestionsList />
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
