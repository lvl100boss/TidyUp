import { createWorker } from 'tesseract.js';

const documentKeywords = {
    businessPermit: {
        required: ['permit', 'business'],
        additional: ['municipal', 'mayor', 'valid until', 'registration'],
        minimum: 2
    },
    dtiRegistration: {
        required: ['dti', 'registration'],
        additional: ['certificate', 'business name', 'trade', 'industry'],
        minimum: 2
    },
    validId: {
        required: [
            'republic', 'philippines', 'republika', 'pilipinas',
            'valid', 'identification', 'identity'
        ],
        types: {
            passport: ['passport', 'dfa', 'department of foreign affairs'],
            sss: ['social security', 'sss', 'social security system'],
            umid: ['umid', 'unified', 'multipurpose'],
            drivers: ['driver', 'license', 'lto', 'land transportation'],
            postal: ['postal', 'philpost'],
            gsis: ['gsis', 'government service']
        },
        patterns: [
            /\b[A-Z0-9]{6,}\b/, // ID number format
            /\b(male|female)\b/i, // Gender
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

async function scanDocument(imageFile, type) {
    try {
        const { text, confidence } = await processImage(imageFile);

        // Special handling for valid IDs
        if (type === 'validId') {
            return validateId(text, confidence);
        }

        const specs = documentKeywords[type];
        const requiredMatches = specs.required.filter(word => text.includes(word)).length;
        const additionalMatches = (specs.additional || specs.types)
            .filter(word => text.includes(word)).length;

        const isValid = requiredMatches + additionalMatches >= specs.minimum;
        
        return {
            isValid,
            message: isValid 
                ? `Document verified successfully`
                : getFailureMessage(type),
            suggestions: !isValid ? getDocumentSuggestions(type) : []
        };
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
        confidence >= 50;

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
            "Ensure the permit number is visible",
            "Check if the business name is clearly shown"
        ],
        dtiRegistration: [
            "Ensure it's a DTI Certificate of Registration",
            "Make sure the registration number is visible",
            "Check if the business name is clearly shown"
        ],
        validId: [
            "Use a valid government-issued ID",
            "Make sure both front and text are clear",
            "Ensure the ID type and number are visible"
        ]
    };
    return suggestions[type] || [];
}

export const verifyBusinessPermit = (file) => scanDocument(file, 'businessPermit');
export const verifyDTIRegistration = (file) => scanDocument(file, 'dtiRegistration');
export const verifyValidID = (file) => scanDocument(file, 'validId');
