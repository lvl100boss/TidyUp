import { createWorker } from 'tesseract.js';
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

async function processImage(imageFile) {
    const worker = await createWorker('eng');
    try {
        await worker.setParameters({
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-/.: ',
        });
        const { data: { text, confidence } } = await worker.recognize(imageFile);
        return { text: text.toLowerCase(), confidence };
    } finally {
        await worker.terminate();
    }
}

/**
 * Extract expiration date from document text using regular expressions
 * @param {string} text - The extracted text from the document
 * @param {Array} patterns - Array of regex patterns to match dates
 * @returns {Object} - Date information including validity and expiration date
 */
function extractExpirationDate(text, patterns) {
    // Default result
    const result = {
        hasDate: false,
        expirationDate: null,
        isExpired: false,
        isAboutToExpire: false, // Within 30 days of expiration
        message: null
    };

    // Try each pattern until a date is found
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            const dateStr = match[1].trim();
            const date = parseDate(dateStr);

            if (date && isValidDate(date)) {
                result.hasDate = true;
                result.expirationDate = date;
                result.formattedDate = formatDate(date);
                
                // Store raw date string for debugging
                result.rawDateString = dateStr;

                // Check if expired or about to expire
                const today = new Date();
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(today.getDate() + 30);
                const ninetyDaysFromNow = new Date();
                ninetyDaysFromNow.setDate(today.getDate() + 90);

                // Calculate days until expiration for more precise warnings
                const daysUntilExpiry = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
                result.daysUntilExpiry = daysUntilExpiry;

                if (date < today) {
                    result.isExpired = true;
                    result.message = `Document expired on ${formatDate(date)}`;
                    result.severity = 'error';
                    result.expirationStatus = 'expired';
                } else if (date < thirtyDaysFromNow) {
                    result.isAboutToExpire = true;
                    result.message = `Document will expire soon (${formatDate(date)})`;
                    result.severity = 'warning';
                    result.expirationStatus = 'critical';
                    result.daysWarning = `Expires in ${daysUntilExpiry} days`;
                } else if (date < ninetyDaysFromNow) {
                    result.isAboutToExpire = false;
                    result.message = `Document valid until ${formatDate(date)}`;
                    result.severity = 'info';
                    result.expirationStatus = 'warning';
                    result.daysWarning = `Expires in ${daysUntilExpiry} days`;
                } else {
                    result.message = `Document valid until ${formatDate(date)}`;
                    result.severity = 'success';
                    result.expirationStatus = 'valid';
                }

                break;
            }
        }
    }

    return result;
}

/**
 * Parse a date string with flexible formats
 * @param {string} dateStr - Date string in various formats
 * @returns {Date|null} - JavaScript Date object or null if invalid
 */
function parseDate(dateStr) {
    // Try different parsing strategies for more robust date extraction
    
    // Strategy 1: Try standard date splitting with delimiters
    const delimiterParts = dateStr.split(/[\/\-\.]/);
    if (delimiterParts.length === 3) {
        let day, month, year;
        
        // Handle different date formats (mm/dd/yyyy, dd/mm/yyyy)
        if (parseInt(delimiterParts[0]) > 12) {
            // If first part > 12, assume DD-MM-YYYY
            day = parseInt(delimiterParts[0]);
            month = parseInt(delimiterParts[1]) - 1; // JS months are 0-based
        } else {
            // Otherwise assume MM-DD-YYYY which is common in Philippines
            month = parseInt(delimiterParts[0]) - 1;
            day = parseInt(delimiterParts[1]);
        }

        // Handle 2-digit years
        year = parseInt(delimiterParts[2]);
        if (year < 100) {
            year = year + (year > 50 ? 1900 : 2000);
        }
        
        const candidateDate = new Date(year, month, day);
        if (isValidDate(candidateDate)) {
            return candidateDate;
        }
    }
    
    // Strategy 2: Try parsing text dates like "January 15, 2023"
    try {
        // Format text dates for better parsing
        const normalizedDateStr = dateStr.replace(/(\d)(st|nd|rd|th)/, '$1'); // Remove ordinals
        const textDate = new Date(normalizedDateStr);
        if (isValidDate(textDate)) {
            return textDate;
        }
    } catch (e) {
        // Silently continue if text date parsing fails
    }
    
    // Strategy 3: Use Date.parse for ISO format and other standard formats
    try {
        const timestamp = Date.parse(dateStr);
        if (!isNaN(timestamp)) {
            return new Date(timestamp);
        }
    } catch (e) {
        // Silently continue if ISO parsing fails
    }
    
    // Strategy 4: Advanced pattern matching for special formats
    // Philippine date format with month name: "15 January 2023" or "January 15 2023"
    const monthNamePattern = /(\d{1,2})\s+([a-z]+)\s+(\d{4})|([a-z]+)\s+(\d{1,2})\s+(\d{4})/i;
    const monthNameMatch = dateStr.match(monthNamePattern);
    
    if (monthNameMatch) {
        try {
            const months = {
                'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
                'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
                'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'jun': 5, 'jul': 6, 'aug': 7, 
                'sep': 8, 'sept': 8, 'oct': 9, 'nov': 10, 'dec': 11
            };
            
            let day, month, year;
            
            if (monthNameMatch[1] && monthNameMatch[2] && monthNameMatch[3]) {
                // Format: "15 January 2023"
                day = parseInt(monthNameMatch[1]);
                month = months[monthNameMatch[2].toLowerCase()];
                year = parseInt(monthNameMatch[3]);
            } else {
                // Format: "January 15 2023"
                month = months[monthNameMatch[4].toLowerCase()];
                day = parseInt(monthNameMatch[5]);
                year = parseInt(monthNameMatch[6]);
            }
            
            if (month !== undefined && !isNaN(day) && !isNaN(year)) {
                const candidateDate = new Date(year, month, day);
                if (isValidDate(candidateDate)) {
                    return candidateDate;
                }
            }
        } catch (e) {
            // Silently continue if month name parsing fails
        }
    }
    
    // Failed to parse with all strategies
    return null;
}

/**
 * Check if a date is valid
 * @param {Date} date - Date object to check
 * @returns {boolean} - Whether the date is valid
 */
function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}

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

async function scanDocument(imageFile, type) {
    try {
        const { text, confidence } = await processImage(imageFile);

        // Special handling for valid IDs
        if (type === 'validId') {
            const validationResult = validateId(text, confidence);
            
            // Add expiration date check for valid IDs
            if (validationResult.isValid) {
                const datePatterns = documentKeywords.validId.datePatterns;
                const dateInfo = extractExpirationDate(text, datePatterns);
                if (dateInfo.hasDate) {
                    validationResult.dateInfo = dateInfo;
                    
                    // Always update validation if document is expired
                    if (dateInfo.isExpired) {
                        validationResult.isValid = false;
                        validationResult.message = dateInfo.message;
                        validationResult.issue = 'expired';
                        validationResult.status = 'error';
                    } else if (dateInfo.isAboutToExpire) {
                        // Still valid but with warning
                        validationResult.warning = dateInfo.message;
                        validationResult.status = 'warning';
                    } else {
                        validationResult.validUntil = dateInfo.message;
                        validationResult.status = 'success';
                    }
                }
            }
            
            return validationResult;
        }
        
        // For other document types
        const specs = documentKeywords[type];
        const requiredMatches = specs.required.filter(word => text.includes(word)).length;
        const additionalMatches = specs.additional.filter(word => text.includes(word)).length;
        const isValid = requiredMatches + additionalMatches >= specs.minimum;

        // Result object
        const result = {
            isValid,
            confidence,
            message: isValid ? `Document verified successfully` : getFailureMessage(type),
            suggestions: !isValid ? getDocumentSuggestions(type) : [],
            status: isValid ? 'success' : 'error'
        };
        
        // Always check expiration date regardless of initial validation
        if (specs.datePatterns) {
            const dateInfo = extractExpirationDate(text, specs.datePatterns);
            if (dateInfo.hasDate) {
                result.dateInfo = dateInfo;

                // If expired, document is invalid regardless of other checks
                if (dateInfo.isExpired) {
                    result.isValid = false;
                    result.message = dateInfo.message;
                    result.issue = 'expired';
                    result.status = 'error';
                } else if (dateInfo.isAboutToExpire) {
                    result.warning = dateInfo.message;
                    result.status = 'warning';
                } else {
                    result.validUntil = dateInfo.message;
                }
            }
        }
        
        return result;
    } catch (error) {
        console.error('Verification error:', error);
        throw new Error('Document verification failed - please try again');
    }
}

function validateId(text, confidence) {
    const specs = documentKeywords.validId;
    const lowercaseText = text.toLowerCase();

    // Check required keywords
    const requiredMatches = specs.required.filter(word =>
        lowercaseText.includes(word.toLowerCase())
    ).length;

    // Check ID type
    let detectedType = null;
    for (const [type, keywords] of Object.entries(specs.types)) {
        if (keywords.some(keyword => lowercaseText.includes(keyword.toLowerCase()))) {
            detectedType = type;
            break;
        }
    }

    // Check patterns (dates, numbers, etc)
    const patternMatches = specs.patterns.filter(pattern =>
        pattern.test(text)
    ).length;

    // Calculate overall validity
    const isValid = 
        requiredMatches >= specs.minimum.required &&
        detectedType !== null &&
        patternMatches >= specs.minimum.patterns &&
        confidence >= 60;

    if (!isValid) {
        const suggestions = [];
        if (!detectedType) {
            suggestions.push("Please upload any of these valid IDs:");
            suggestions.push("• Passport");
            suggestions.push("• SSS ID");
            suggestions.push("• UMID");
            suggestions.push("• Driver's License");
            suggestions.push("• Postal ID");
            suggestions.push("• GSIS ID");
        } else {
            suggestions.push("Please ensure:");
            suggestions.push("• The photo is clear and well-lit");
            suggestions.push("• All text is readable");
            suggestions.push("• The entire ID is visible");
        }

        return {
            isValid: false,
            message: "Please upload a valid government ID",
            suggestions
        };
    }
    
    return {
        isValid: true,
        message: `Valid ID verified successfully`,
        idType: detectedType
    };
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
 * Performs hybrid verification using both Tesseract.js (client-side) and Google Vision API (server-side)
 * @param {File} file - The file to verify
 * @param {string} documentType - Type of document to verify
 * @returns {Promise<object>} - Combined verification results
 */
async function hybridDocumentVerification(file, documentType) {
    try {
        // Start both verifications in parallel
        const clientVerificationPromise = clientSideVerification(file, documentType);
        const serverVerificationPromise = serverSideVerification(file, documentType);

        // Wait for both to complete
        const [clientResult, serverResult] = await Promise.all([
            clientVerificationPromise,
            serverVerificationPromise
        ]);

        // Combine the results, giving preference to server result if available
        const result = combineVerificationResults(clientResult, serverResult, documentType);
        
        // Remove 'engine' property to hide verification method
        if (result.engine) {
            delete result.engine;
        }
        
        return result;
    } catch (error) {
        console.error('Verification error:', error);

        // If one verification fails, return the result from the other
        // Or return an error if both fail
        if (error.fallbackResult) {
            const result = {
                ...error.fallbackResult,
                status: error.fallbackResult.isValid ? 'success' : 'warning'
            };
            
            // Remove any implementation details
            if (result.engine) {
                delete result.engine;
            }
            
            return result;
        }

        throw new Error('Document verification failed - please try again');
    }
}

/**
 * Performs client-side verification using Tesseract.js
 * @param {File} file - The file to verify
 * @param {string} documentType - Type of document to verify
 * @returns {Promise<object>} - Client-side verification results
 */
async function clientSideVerification(file, documentType) {
    try {
        const type = documentType.replace(/_/g, '');
        switch (type) {
            case 'businesspermit':
                return await verifyBusinessPermit(file);
            case 'dtiregistration':
                return await verifyDTIRegistration(file);
            case 'validid':
                return await verifyValidID(file);
            default:
                throw new Error('Invalid document type');
        }
    } catch (error) {
        console.error('Client-side verification error:', error);
        return {
            isValid: false,
            confidence: 0,
            message: 'Client-side verification failed',
            engine: 'tesseract',
            error: error.message
        };
    }
}

/**
 * Performs server-side verification using Google Vision API
 * @param {File} file - The file to verify
 * @param {string} documentType - Type of document to verify
 * @returns {Promise<object>} - Server-side verification results
 */
async function serverSideVerification(file, documentType) {
    try {
        const formData = new FormData();
        formData.append('image', file);

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

        // Add a timeout to the request to prevent hanging
        const response = await axios.post(`/${endpoint}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json'
            },
            timeout: 30000, // 30 second timeout
        });

        // Safely check the response structure
        if (!response.data || typeof response.data !== 'object') {
            throw new Error('Invalid response format from server');
        }

        // Check if the response contains an error
        if (response.data.success === false || !response.data.success) {
            throw new Error(response.data.message || 'Server verification failed');
        }

        return {
            isValid: response.data.is_valid === true,
            confidence: response.data.confidence || 75, // Default confidence if not provided
            message: response.data.message || 'Document verified by server',
            issue: response.data.issue || null,
            status: response.data.status || (response.data.is_valid ? 'success' : 'error'),
            engine: 'vision',
            dateInfo: response.data.date_info || null,
            extractedText: response.data.extracted_text || null
        };
    } catch (error) {
        console.error('Server-side verification error:', error);
        
        // Check specifically for JSON parsing errors
        const errorMessage = error.message || '';
        const isJsonError = errorMessage.includes('JSON') || 
                           errorMessage.includes('Unclosed') ||
                           errorMessage.includes('match');
        
        // Create a more specific error message based on the type of error
        let message = 'Server-side verification failed';
        if (isJsonError) {
            message = 'Server returned invalid data format';
        } else if (error.code === 'ECONNABORTED') {
            message = 'Server verification timed out';
        } else if (error.response?.status === 413) {
            message = 'File is too large for server processing';
        } else if (error.response?.status === 415) {
            message = 'File format not supported by server';
        } else if (error.response?.status >= 500) {
            message = 'Server error occurred during verification';
        }
        
        // Instead of failing completely, return an error object that can be used
        // to inform the hybrid verification to fall back to client-side only
        return {
            isValid: false,
            confidence: 0,
            message: message,
            engine: 'vision',
            error: error.response?.data?.message || error.message,
            errorType: isJsonError ? 'parse_error' : (error.code || 'request_failed')
        };
    }
}

/**
 * Combines results from both verification methods
 * @param {object} clientResult - Client-side verification result
 * @param {object} serverResult - Server-side verification result
 * @param {string} documentType - Type of document being verified
 * @returns {object} - Combined verification result
 */
function combineVerificationResults(clientResult, serverResult, documentType) {
    // If server verification failed with an error
    const serverFailed = serverResult.error !== undefined;
    const clientFailed = clientResult.error !== undefined;

    // If both failed, we have a problem
    if (serverFailed && clientFailed) {
        return {
            isValid: false,
            message: 'Document verification failed',
            status: 'error',
            suggestions: getDocumentSuggestions(documentType.replace(/_/g, ''))
        };
    }

    // If only server failed, use client result
    if (serverFailed) {
        return {
            ...clientResult,
            message: clientResult.message,
            status: clientResult.isValid ? 'success' : 'warning'
        };
    }

    // If only client failed, use server result with a note
    if (clientFailed) {
        return {
            ...serverResult,
            message: serverResult.message,
            status: serverResult.isValid ? 'success' : 'warning'
        };
    }

    // Special case: When server reports incomplete details but client verification succeeds
    // This handles the case where Google Vision misses details that Tesseract finds
    if (!serverResult.isValid && serverResult.issue === 'incomplete' && clientResult.isValid) {
        // Trust client-side verification for incomplete issues
        return {
            isValid: true,
            message: 'Document verified successfully',
            status: 'success',
            dateInfo: serverResult.date_info || clientResult.dateInfo || null,
            suggestions: []
        };
    }

    // Both succeeded or have different results, combine them with modified logic
    // For business permits, prioritize client validation for incomplete issues
    const combinedIsValid = documentType === 'business_permit' && serverResult.issue === 'incomplete' 
        ? clientResult.isValid 
        : (serverResult.isValid && clientResult.isValid);

    // If expired (from either source), mark as invalid regardless
    const isExpired = (serverResult.issue === 'expired' || 
                      (serverResult.status === 'error' && serverResult.date_info?.status === 'expired')) ||
                      (clientResult.issue === 'expired' || 
                      (clientResult.status === 'error' && clientResult.dateInfo?.isExpired));

    // For business permit, check if it's marked as incomplete but consider it valid if client verification passes
    let isIncomplete = false;
    if (documentType === 'business_permit') {
        isIncomplete = serverResult.issue === 'incomplete' && !clientResult.isValid;
    }

    // If valid but about to expire, include a warning
    const isAboutToExpire = !isExpired && 
                           ((serverResult.warning && serverResult.warning.includes('expire soon')) ||
                           (serverResult.status === 'warning' && serverResult.date_info?.status === 'expiring_soon') ||
                           (clientResult.warning && clientResult.warning.includes('expire soon')) ||
                           (clientResult.status === 'warning' && clientResult.dateInfo?.isAboutToExpire));

    // Determine combined status
    let combinedStatus = combinedIsValid ? 'success' : 'warning';
    if (isExpired) {
        combinedStatus = 'error';
    } else if (isAboutToExpire || isIncomplete) {
        combinedStatus = 'warning';
    }

    // Enhanced expiration status handling
    let expirationDetails = null;
    
    // Get the most critical expiration information from either source
    if (serverResult.dateInfo || clientResult.dateInfo) {
        const serverExpiry = serverResult.dateInfo;
        const clientExpiry = clientResult.dateInfo;
        
        // Choose the most critical expiration status
        if (serverExpiry && clientExpiry) {
            // If we have both, use the more critical one
            if (serverExpiry.isExpired || clientExpiry.isExpired) {
                expirationDetails = serverExpiry.isExpired ? serverExpiry : clientExpiry;
            } else if (serverExpiry.isAboutToExpire || clientExpiry.isAboutToExpire) {
                expirationDetails = serverExpiry.isAboutToExpire ? serverExpiry : clientExpiry;
            } else {
                // If neither is critical, prefer server data as it's usually more accurate
                expirationDetails = serverExpiry;
            }
        } else {
            // Use whichever one is available
            expirationDetails = serverExpiry || clientExpiry;
        }
    }
    
    // Determine message based on results
    let combinedMessage;
    if (isExpired) {
        const expiryDate = expirationDetails?.formattedDate || '';
        combinedMessage = `Document has expired${expiryDate ? ` on ${expiryDate}` : ''}. Please provide a valid document.`;
    } else if (isIncomplete) {
        combinedMessage = 'Key details on the business permit are unclear or missing. Please upload a clearer image.';
    } else if (isAboutToExpire) {
        if (expirationDetails && expirationDetails.daysUntilExpiry) {
            combinedMessage = `Document verified successfully. Will expire in ${expirationDetails.daysUntilExpiry} days (${expirationDetails.formattedDate})`;
        } else {
            combinedMessage = `Document verified successfully. ${serverResult.warning || clientResult.dateInfo?.message || 'Will expire soon'}`;
        }
    } else if (documentType === 'business_permit' && serverResult.issue === 'incomplete' && clientResult.isValid) {
        combinedMessage = 'Business permit verified successfully';
    } else if (combinedIsValid) {
        if (expirationDetails && expirationDetails.formattedDate) {
            combinedMessage = `Document verified successfully. Valid until ${expirationDetails.formattedDate}`;
        } else {
            combinedMessage = 'Document verified successfully';
        }
    } else {
        combinedMessage = serverResult.message || clientResult.message || 
                         getFailureMessage(documentType.replace(/_/g, ''));
    }

    // Merge date information with enhanced details
    const dateInfo = expirationDetails || serverResult.date_info || clientResult.dateInfo || null;

    return {
        isValid: combinedIsValid && !isExpired && !isIncomplete,
        message: combinedMessage,
        status: combinedStatus,
        issue: isExpired ? 'expired' : (isIncomplete ? 'incomplete' : serverResult.issue || null),
        dateInfo: dateInfo,
        suggestions: (!combinedIsValid || isIncomplete) ? getDocumentSuggestions(documentType.replace(/_/g, '')) : [],
        warning: isAboutToExpire ? (serverResult.warning || clientResult.dateInfo?.message) : null,
        expirationStatus: dateInfo?.expirationStatus || null
    };
}

/**
 * Verify a document during upload using hybrid approach
 * @param {File} file - The file being uploaded
 * @param {string} documentType - Type of document: 'businessPermit', 'dtiRegistration', or 'validId'
 * @returns {Promise<Object>} - Verification result with status and messages
 */
export const verifyDocumentUpload = async (file, documentType) => {
    // Basic file validation checks
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

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        return {
            isValid: false,
            message: 'File size exceeds 5MB limit',
            status: 'error'
        };
    }

    try {
        // Transform documentType to internal format if needed
        let internalDocType = documentType;

        // Convert from camelCase to snake_case if necessary
        if (documentType === 'businessPermit') internalDocType = 'business_permit';
        if (documentType === 'dtiRegistration') internalDocType = 'dti_registration';
        if (documentType === 'validId') internalDocType = 'valid_id';

        // Perform hybrid verification
        const result = await hybridDocumentVerification(file, internalDocType);

        // Handle warnings
        if (result.warning) {
            return {
                ...result,
                status: 'warning',
                message: result.message
            };
        }

        return result;
    } catch (error) {
        console.error('Document verification failed:', error);
        return {
            isValid: false,
            message: error.message || 'Document verification failed',
            status: 'error'
        };
    }
};

// Keep the original functions for compatibility
export const verifyBusinessPermit = (file) => scanDocument(file, 'businessPermit');
export const verifyDTIRegistration = (file) => scanDocument(file, 'dtiRegistration');
export const verifyValidID = (file) => scanDocument(file, 'validId');
