import axios from 'axios';

const documentKeywords = {
    businessPermit: {
        required: ['permit', 'business'],
        additional: ['municipal', 'mayor', 'valid until', 'registration', 'certificate', 'authority', 'operate', 'owner', 'city', 'registered'],
        minimum: 2,
        datePatterns: [
            /valid\s+(?:until|through|thru|till|to)\s+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            /expir(?:y|ation|es)\s+(?:date|on)?\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            /(?:date of expiry|expiry date|valid until|expiration)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\s*(?:valid until|expiry|expiration)/i,
            /(?:issue|issuance)\s+date\s*:\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            /(?:permit\s+expires|expires\s+on)\s+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            /(?:validity|valid\s+period)\s*:\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            // Add more specific patterns for business permits
            /(?:business|mayor['']?s)\s+permit\s+expires\s+(?:on)?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
        ],
    },
    dtiRegistration: {
        required: ['dti'],
        additional: ['certificate', 'business', 'registration', 'trade', 'industry', 'secretary', 'commerce', 'registry', 'enterprise'],
        minimum: 2,
        datePatterns: [
            /valid\s+(?:until|through|thru|till|to)\s+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            /expir(?:y|ation|es)\s+(?:date|on)?\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            /(?:date of expiry|expiry date|valid until|expiration)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            /(?:registration|issued)\s+(?:date|on)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            /date\s+(?:of|:)?\s*(?:registration|issue)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            // Add more specific patterns for DTI
            /(?:certificate|registration)\s+expires(?:\s+on)?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
        ]
    },
    validId: {
        required: [
            'republic', 'philippines', 'republika', 'pilipinas',
            'valid', 'identification', 'identity', 'government', 'id'
        ],
        types: {
            passport: ['passport', 'dfa', 'department of foreign affairs', 'travel', 'document'],
            sss: ['social security', 'sss', 'social security system', 'pension'],
            umid: ['umid', 'unified', 'multipurpose', 'gsis-sss'],
            drivers: ['driver', 'license', 'lto', 'land transportation', 'driving'],
            postal: ['postal', 'philpost', 'philippine postal', 'mail'],
            gsis: ['gsis', 'government service', 'insurance'],
            philhealth: ['philhealth', 'health insurance', 'medical'],
            nationalid: ['national id', 'philippine identification system', 'philsys'],
            prc: ['prc', 'professional regulation', 'profession', 'license']
        },
        patterns: [
            /\b[A-Z0-9]{6,}\b/,
            /\b(male|female)\b/i,
            /birth(?:day|date|place)/i,
            /nationality/i,
            /signature/i,
            /expir(?:y|ation|es)/i,
        ],
        datePatterns: [
            /valid\s+(?:until|through|thru|till|to)\s+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            /expir(?:y|ation|es)\s+(?:date|on)?\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            /(?:date of expiry|expiry date|valid until|expiration)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
            // Add more specific patterns for IDs
            /(?:id|card)\s+expires(?:\s+on)?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
        ],
        minimum: {
            required: 1,
            types: 1,
            patterns: 1
        }
    }
};

/**
 * Format a date in a user-friendly format
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getFailureMessage(type) {
    const messages = {
        businessPermit: "Could not verify as a valid Business Permit",
        dtiRegistration: "Could not verify as a valid DTI Registration",
        validId: "Could not verify as a valid government ID"
    };
    return messages[type] || "Verification failed";
}

function getDocumentSuggestions(type) {
    const suggestions = {
        businessPermit: [
            "Make sure it's an official Business/Mayor's Permit",
            "Ensure the permit number is clearly visible",
            "Check if the business name is clearly shown",
            "Verify that the address is legible",
            "Ensure that issue and expiration dates are clearly visible",
            "Try taking the photo in better lighting conditions"
        ],
        dtiRegistration: [
            "Ensure it's a DTI Certificate of Registration",
            "Make sure the registration number is visible",
            "Check if the business name is clearly shown",
            "Verify that the issue and expiration dates are legible",
            "Make sure the entire document is in the frame"
        ],
        validId: [
            "Use a valid government-issued ID",
            "Make sure both front and back are clear",
            "Ensure the ID type and number are visible",
            "Verify that your name and photo are clearly visible"
        ]
    };
    return suggestions[type] || [];
}

/**
 * Performs server-side verification using Google Vision API
 * @param {File} file - The file to verify
 * @param {string} documentType - Type of document to verify
 * @returns {Promise<object>} - Server-side verification results
 */
async function serverSideVerification(file, documentType) {
    try {
        console.log(`Starting verification for ${documentType}...`);
        
        // First, optimize the image before sending it to the server
        const optimizedFile = await optimizeImageForOCR(file);
        console.log('Image optimized successfully');
        
        const formData = new FormData();
        formData.append('image', optimizedFile);
        
        // Add document type specific hints to help the server
        formData.append('doc_type', documentType);
        
        // Add OCR configuration parameters optimized for Hostinger/production
        const ocrConfig = {
            language_hints: ['en', 'fil', 'tl'],
            detect_orientation: true,
            model: 'builtin/latest', // Use latest Google Vision model
            feature_type: 'DOCUMENT_TEXT_DETECTION' // Best for document scanning
        };
        formData.append('ocr_config', JSON.stringify(ocrConfig));
        
        // Get CSRF token dynamically for Hostinger environment
        const token = document.querySelector('meta[name="csrf-token"]')?.content;
        
        // Map the document type to the correct API endpoint
        let endpoint;
        switch (documentType) {
            case 'business_permit':
                endpoint = 'api/verify/business-permit';
                break;
            case 'dti_registration':
                endpoint = 'api/verify/dti-registration';
                break;
            case 'valid_id':
                endpoint = 'api/verify/valid-id';
                break;
            default:
                throw new Error('Invalid document type');
        }
        
        console.log(`Sending request to /${endpoint}...`);
        
        // Add a timeout appropriate for production environment
        const response = await axios.post(`/${endpoint}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': token,
                'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: 45000, // 45 second timeout for Hostinger (may need longer for larger files)
        });
        
        console.log('Response received:', response.status);
        
        // Safely check the response structure
        if (!response.data) {
            console.error('Empty response data');
            throw new Error('Server returned empty response');
        }
        
        // Log the response for debugging
        console.log('Response data structure:', Object.keys(response.data));
        
        // Check if the response contains an error
        if (response.data.success === false) {
            console.error('Server reported failure:', response.data.message);
            throw new Error(response.data.message || 'Server verification failed');
        }
        
        // Process date information more thoroughly
        let dateInfo = response.data.date_info || null;
        if (dateInfo) {
            dateInfo = enhanceDateInfo(dateInfo);
        }
        
        console.log('Verification successful');
        
        return {
            isValid: response.data.is_valid === true,
            confidence: response.data.confidence || 75,
            message: response.data.message || 'Document verified by server',
            issue: response.data.issue || null,
            status: response.data.status || (response.data.is_valid ? 'success' : 'error'),
            dateInfo: dateInfo,
            extractedText: response.data.extracted_text || null,
            documentType: response.data.document_type || documentType,
            textConfidence: response.data.text_confidence || null,
            // Include API source for logging purposes
            source: 'google-vision'
        };
    } catch (error) {
        // Enhanced error logging
        console.error('Server-side verification error details:', {
            message: error.message,
            code: error.code,
            responseStatus: error.response?.status,
            responseData: error.response?.data,
            documentType
        });
        
        // Create a more specific error message based on the type of error
        let message = 'Server-side verification failed';
        const errorMessage = error.message || '';
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 404) {
                message = 'Verification service not found. Please contact support.';
            } else if (error.response.status === 422) {
                message = error.response.data.message || 'Invalid document format';
            } else if (error.response.status === 413) {
                message = 'File is too large for server processing. Please compress the image.';
            } else if (error.response.status === 401 || error.response.status === 403) {
                message = 'Authentication error. Please log in again.';
            } else if (error.response.status >= 500) {
                message = 'Server error during verification. Our team has been notified.';
            }
        } else if (error.request) {
            // The request was made but no response was received
            if (error.code === 'ECONNABORTED') {
                message = 'Verification timed out. Please try with a smaller image or better connection.';
            } else {
                message = 'No response from server. Please check your internet connection.';
            }
        } else {
            // Something happened in setting up the request that triggered an Error
            const isJsonError = errorMessage.includes('JSON') || 
                               errorMessage.includes('Unclosed') ||
                               errorMessage.includes('match');
                               
            if (isJsonError) {
                message = 'Server returned invalid data format. Please try again.';
            }
        }
        
        console.log('Final error message:', message);
        
        // Attempt fallback verification if configured
        if (window.USE_FALLBACK_VERIFICATION) {
            return fallbackVerification(file, documentType);
        }
        
        throw new Error(message);
    }
}

/**
 * Simple fallback verification when server verification fails
 * This just does basic checks on the file without OCR
 */
function fallbackVerification(file, documentType) {
    console.log('Using fallback verification');
    
    // For fallback, just check file properties - very minimal requirements now
    const isImage = file.type.startsWith('image/');
    
    // Convert document type for message
    const readableType = documentType
        .replace('_', ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    
    // Return a basic result that accepts the document with minimal checking
    return {
        isValid: isImage, // Only require it to be an image
        confidence: 50,   // Lower confidence level since we're doing minimal verification
        message: `${readableType} accepted (will be verified by admin)`,
        status: 'success', // Change to success to avoid warning UI 
        issue: null,
        fallback: true,
        suggestions: [
            'Your document has been accepted',
            'An admin will verify this document during processing',
            'You can continue with setup'
        ]
    };
}

/**
 * Optimize image for better OCR processing
 * @param {File} file - Original image file
 * @returns {Promise<Blob>} - Optimized image blob
 */
async function optimizeImageForOCR(file) {
    return new Promise((resolve, reject) => {
        // In production (Hostinger), always optimize images
        const isProduction = window.location.hostname.includes('hostinger') || 
                            window.location.hostname.includes('tidyup') ||
                            !window.location.hostname.includes('localhost');
        
        // Skip optimization only in specific development environments
        const skipOptimization = !isProduction && window.__DEV_MODE__ && window.__SKIP_IMAGE_OPTIMIZATION;
        
        if (skipOptimization) {
            resolve(file);
            return;
        }
        
        try {
            const img = new Image();
            const url = URL.createObjectURL(file);
            
            img.onload = () => {
                // Release the object URL
                URL.revokeObjectURL(url);
                
                // Set max dimensions for optimal Google Vision OCR (recommended 1024-4096px)
                const maxWidth = 2500;
                const maxHeight = 2500;
                
                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;
                
                // Ensure minimum dimensions for OCR (Google Vision works better with min 600px)
                const minDimension = 600;
                if (width < minDimension && height < minDimension) {
                    // If image is too small, don't resize but still optimize
                    console.warn('Image dimensions too small for optimal OCR');
                } else {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                // Create canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                // Draw image with high quality and optimizations for Google Vision
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = 'white'; // White background improves OCR text contrast
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Apply image enhancement based on document type
                ctx.filter = 'contrast(1.2) brightness(1.05) saturate(0.9)'; // Settings optimized for text recognition
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob with appropriate quality
                // Use higher quality for ID cards which usually have finer details
                const quality = file.size < 1024 * 1024 ? 0.95 : 0.85; // Higher quality for smaller files
                
                canvas.toBlob(blob => {
                    resolve(new File([blob], file.name, { 
                        type: 'image/jpeg',
                        lastModified: new Date().getTime()
                    }));
                }, 'image/jpeg', quality);
            };
            
            img.onerror = () => {
                URL.revokeObjectURL(url);
                console.warn('Image loading failed during optimization, using original');
                resolve(file); // Fallback to original on error
            };
            
            img.src = url;
        } catch (error) {
            console.error('Image optimization failed:', error);
            resolve(file); // Fallback to original on error
        }
    });
}

/**
 * Enhance date info object with additional calculated fields
 * @param {Object} dateInfo - Date information from server
 * @returns {Object} - Enhanced date information
 */
function enhanceDateInfo(dateInfo) {
    if (!dateInfo) return null;
    
    // Clone the object to avoid modifying the original
    const enhanced = { ...dateInfo };
    
    // If there's a date string but no formatted date, create one
    if (enhanced.date && !enhanced.formatted) {
        try {
            const date = new Date(enhanced.date);
            if (!isNaN(date.getTime())) {
                enhanced.formatted = formatDate(date);
                
                // Calculate days until expiry
                if (!enhanced.daysUntilExpiry) {
                    const today = new Date();
                    const timeDiff = date.getTime() - today.getTime();
                    enhanced.daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));
                }
            }
        } catch (e) {
            console.warn('Error formatting date:', e);
        }
    }
    
    // Enhance status determination
    if (enhanced.daysUntilExpiry !== undefined && !enhanced.status) {
        if (enhanced.daysUntilExpiry < 0) {
            enhanced.status = 'expired';
        } else if (enhanced.daysUntilExpiry < 30) {
            enhanced.status = 'expiring_soon';
        } else if (enhanced.daysUntilExpiry < 90) {
            enhanced.status = 'warning';
        } else {
            enhanced.status = 'valid';
        }
    }
    
    return enhanced;
}

/**
 * Verify a document during upload using Google Vision API
 * @param {File} file - The file being uploaded
 * @param {string} documentType - Type of document: 'businessPermit', 'dtiRegistration', or 'validId'
 * @returns {Promise<Object>} - Verification result with status and messages
 */
export const verifyDocumentUpload = async (file, documentType) => {
    // Basic file validation checks - keep only the most essential checks
    if (!file) {
        return {
            isValid: false,
            message: 'No file selected',
            status: 'error'
        };
    }

    if (!file.type.startsWith('image/')) {
        return {
            isValid: false,
            message: 'File must be an image (JPG, PNG, etc.)',
            status: 'error',
        };
    }

    const maxSize = 15 * 1024 * 1024; // Increased to 15MB to be more lenient
    if (file.size > maxSize) {
        return {
            isValid: false,
            message: 'File size exceeds 15MB limit',
            status: 'error'
        };
    }
    
    // Make dimension check less strict
    try {
        const dimensions = await getImageDimensions(file);
        if (dimensions.width < 400 || dimensions.height < 400) { // Reduced from 600px to 400px
            return {
                isValid: true, // Changed to true - accept it but with a warning
                message: 'Document accepted, but image resolution is low. Admin will verify.',
                status: 'success', // Changed from error to success
                suggestions: ['Consider uploading a higher resolution image for faster verification']
            };
        }
    } catch (error) {
        console.warn('Could not check image dimensions:', error);
        // Continue even if dimension check fails
    }

    try {
        // Transform documentType to internal format if needed
        let internalDocType = documentType;

        // Convert from camelCase to snake_case if necessary
        if (documentType === 'businessPermit') internalDocType = 'business_permit';
        if (documentType === 'dtiRegistration') internalDocType = 'dti_registration';
        if (documentType === 'validId') internalDocType = 'valid_id';

        // Simplified approach: attempt server verification but fall back quickly
        let result;
        
        // Check if we should try server verification at all
        const skipServerVerification = window.location.search.includes('skip_verify=1') || 
                                      window.localStorage.getItem('skip_document_verification') === 'true';
                                      
        if (skipServerVerification) {
            console.log('Skipping server verification as configured');
            // Use fallback immediately
            result = fallbackVerification(file, internalDocType);
        } else {
            try {
                // Try server verification with short timeout
                result = await serverSideVerification(file, internalDocType);
            } catch (error) {
                console.log('Server verification failed, using simplified acceptance:', error);
                // Use fallback on any error
                result = fallbackVerification(file, internalDocType);
            }
        }
        
        // Always accept the document, just log details for admin review
        if (!result.isValid) {
            console.log('Document would have been rejected, but accepting for admin review:', result);
            result = {
                ...result,
                isValid: true,
                message: `Document accepted (admin will verify details)`,
                status: 'success',
                originalStatus: result.status, // Keep original status for admin reference
                adminReviewRequired: true
            };
        }

        return result;
    } catch (error) {
        console.error('Document verification failed, accepting document anyway:', error);
        
        // Accept document even if verification completely fails
        return {
            isValid: true,
            message: 'Document accepted (verification pending)',
            status: 'success',
            suggestions: ['Admin will verify your document during processing'],
            adminReviewRequired: true
        };
    }
};

/**
 * Get image dimensions
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 */
function getImageDimensions(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({
                width: img.width,
                height: img.height
            });
        };
        
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };
        
        img.src = url;
    });
}
