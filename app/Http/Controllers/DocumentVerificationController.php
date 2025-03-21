<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Google\Cloud\Vision\V1\ImageAnnotatorClient;
use Google\Cloud\Vision\V1\Feature\Type;
use Carbon\Carbon;

class DocumentVerificationController extends Controller
{
    /**
     * Verify a business permit using Google Vision API
     */
    public function verifyBusinessPermit(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        try {
            $imageFile = $request->file('image');
            $imagePath = $imageFile->path();

            // Extract text from the document
            $extractResult = $this->extractTextFromImage($imagePath);
            $extractedText = $extractResult['text'];
            $confidence = $extractResult['confidence'];

            // Perform specific business permit validation
            $validationResult = $this->validateBusinessPermit($extractedText);

            return response()->json([
                'success' => true,
                'is_valid' => $validationResult['isValid'],
                'message' => $validationResult['message'],
                'issue' => $validationResult['issue'],
                'status' => $validationResult['status'],
                'confidence' => $confidence,
                'extracted_text' => $extractedText,
                'date_info' => $validationResult['date_info'] ?? null
            ]);
        } catch (\Exception $e) {
            Log::error('Business permit verification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error processing document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Extract text from image using Google Vision OCR
     */
    private function extractTextFromImage($imagePath)
    {
        try {
            // Initialize the client with explicit credentials
            $imageAnnotator = new ImageAnnotatorClient([
                'credentials' => storage_path('app/google-vision-key.json')
            ]);

            // Read the image file
            $image = file_get_contents($imagePath);

            // Perform text detection
            $response = $imageAnnotator->documentTextDetection($image);
            $textAnnotation = $response->getFullTextAnnotation();

            // Get the detected text
            $text = $textAnnotation ? $textAnnotation->getText() : '';

            // Calculate confidence - in newer API versions, we need to use a different approach
            $confidence = 0;

            try {
                // Try to get confidence from annotations
                $annotations = $response->getTextAnnotations();
                if (count($annotations) > 0) {
                    // Just use the confidence of the first text detection as an approximation
                    $confidence = $annotations[0]->getConfidence() * 100;
                }
            } catch (\Exception $e) {
                // If we can't access confidence, use a default value
                Log::warning('Could not access confidence score: ' . $e->getMessage());
                $confidence = 70; // Default confidence
            }

            // Close the client
            $imageAnnotator->close();

            return [
                'text' => $text,
                'confidence' => round($confidence, 2)
            ];
        } catch (\Exception $e) {
            Log::error('Error in text extraction: ' . $e->getMessage());
            return [
                'text' => '',
                'confidence' => 0,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Validate if the document is likely a business permit
     */
    private function validateBusinessPermit($text)
    {
        $text = strtolower($text);

        // Common phrases to identify business permits
        $permitIdentifiers = [
            'business permit',
            'mayor\'s permit',
            'certificate of business registration',
            'authority to operate',
            'certificate of occupancy',
            'business license',
            'municipal permit'
        ];

        // Check for permit identifiers
        $isPermit = false;
        foreach ($permitIdentifiers as $identifier) {
            if (stripos($text, $identifier) !== false) {
                $isPermit = true;
                break;
            }
        }

        if (!$isPermit) {
            return [
                'isValid' => false,
                'message' => 'This does not appear to be a business permit.',
                'issue' => 'incorrect_document',
                'status' => 'error'
            ];
        }

        // Check image quality
        $lowQuality = strlen($text) < 100;

        if ($lowQuality) {
            return [
                'isValid' => false,
                'message' => 'The image quality is too low. Please upload a clearer image of your business permit.',
                'issue' => 'low_quality',
                'status' => 'warning'
            ];
        }

        // Check for business name
        $hasBusinessName = preg_match('/business name[: ]*([\w\s]+)/', $text) ||
            preg_match('/name of business[: ]*([\w\s]+)/', $text);

        // Check for address
        $hasAddress = preg_match('/address[: ]*([\w\s\.,]+)/', $text) ||
            preg_match('/business address[: ]*([\w\s\.,]+)/', $text);

        // Check for permit number
        $hasPermitNumber = preg_match('/permit(?:\s+)(?:no|number)[.:]?\s*(\w+[-\/]?\w+)/', $text) ||
            preg_match('/certificate(?:\s+)(?:no|number)[.:]?\s*(\w+[-\/]?\w+)/', $text) ||
            preg_match('/license(?:\s+)(?:no|number)[.:]?\s*(\w+[-\/]?\w+)/', $text);

        // Check for expiration date
        $expiryDatePatterns = [
            '/valid(?:\s+)until(?:\s+)([a-zA-Z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/',
            '/expir(?:y|ation|es)(?:\s+)(?:date)?(?:\s*):(?:\s*)([a-zA-Z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/',
            '/(?:date of expiry|expiry date)(?:\s*):(?:\s*)([a-zA-Z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/',
        ];

        $expiryDate = null;
        $isExpired = false;
        $isAboutToExpire = false;
        $dateInfo = null;

        foreach ($expiryDatePatterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                try {
                    $dateStr = trim($matches[1]);
                    $expiryDate = Carbon::parse($dateStr);

                    $dateInfo = [
                        'date' => $expiryDate->format('Y-m-d'),
                        'formatted' => $expiryDate->format('F j, Y'),
                    ];

                    if ($expiryDate->isPast()) {
                        $isExpired = true;
                        $dateInfo['status'] = 'expired';
                    } elseif ($expiryDate->diffInDays(Carbon::now()) <= 30) {
                        $isAboutToExpire = true;
                        $dateInfo['status'] = 'expiring_soon';
                    } else {
                        $dateInfo['status'] = 'valid';
                    }

                    break;
                } catch (\Exception $e) {
                    Log::warning("Failed to parse expiry date: {$dateStr}");
                }
            }
        }

        if ($expiryDate && $isExpired) {
            return [
                'isValid' => false,
                'message' => 'This business permit has expired on ' . $expiryDate->format('F j, Y') . '. Please upload a valid permit.',
                'issue' => 'expired',
                'status' => 'error',
                'date_info' => $dateInfo
            ];
        }

        // Create a list of missing details
        $missingDetails = [];
        if (!$hasBusinessName) $missingDetails[] = 'business name';
        if (!$hasAddress) $missingDetails[] = 'business address';
        if (!$hasPermitNumber) $missingDetails[] = 'permit number';

        if (count($missingDetails) > 0) {
            $missingList = implode(', ', $missingDetails);
            return [
                'isValid' => false,
                'message' => 'Cannot clearly detect the following details: ' . $missingList . '. Please upload a clearer image.',
                'issue' => 'incomplete',
                'status' => 'warning',
                'date_info' => $dateInfo,
                'missing_details' => $missingDetails
            ];
        }

        $result = [
            'isValid' => true,
            'message' => 'Business permit verified successfully.',
            'issue' => null,
            'status' => 'success',
            'date_info' => $dateInfo
        ];

        if ($expiryDate && $isAboutToExpire) {
            $result['warning'] = 'Your business permit will expire soon on ' . $expiryDate->format('F j, Y');
        }

        return $result;
    }

    /**
     * Verify a DTI registration document using Google Vision API
     */
    public function verifyDtiRegistration(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        try {
            $imageFile = $request->file('image');
            $imagePath = $imageFile->path();

            // Extract text from the document
            $extractResult = $this->extractTextFromImage($imagePath);
            $extractedText = $extractResult['text'];
            $confidence = $extractResult['confidence'];

            // Validate DTI registration
            $validationResult = $this->validateDtiRegistration($extractedText);

            return response()->json([
                'success' => true,
                'is_valid' => $validationResult['isValid'],
                'message' => $validationResult['message'],
                'issue' => $validationResult['issue'],
                'status' => $validationResult['status'],
                'confidence' => $confidence,
                'extracted_text' => $extractedText,
                'date_info' => $validationResult['date_info'] ?? null
            ]);
        } catch (\Exception $e) {
            Log::error('DTI registration verification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error processing document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate if the document is a valid DTI registration
     */
    private function validateDtiRegistration($text)
    {
        $text = strtolower($text);

        // Check if it's a DTI document
        $isDtiDoc = false;
        $dtiIdentifiers = [
            'department of trade and industry',
            'dti',
            'certificate of business name registration'
        ];

        foreach ($dtiIdentifiers as $identifier) {
            if (stripos($text, $identifier) !== false) {
                $isDtiDoc = true;
                break;
            }
        }

        if (!$isDtiDoc) {
            return [
                'isValid' => false,
                'message' => 'This does not appear to be a DTI registration certificate.',
                'issue' => 'incorrect_document',
                'status' => 'error'
            ];
        }

        // Check image quality
        $lowQuality = strlen($text) < 50; // Reduced minimum text length

        if ($lowQuality) {
            return [
                'isValid' => false,
                'message' => 'The image quality is too low. Please upload a clearer image.',
                'issue' => 'low_quality',
                'status' => 'warning'
            ];
        }

        // Check for expiration date
        $expiryDatePatterns = [
            '/valid(?:\s+)until(?:\s+)([a-zA-Z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/',
            '/expir(?:y|ation|es)(?:\s+)(?:date)?(?:\s*):(?:\s*)([a-zA-Z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/',
            '/(?:date of expiry|expiry date)(?:\s*):(?:\s*)([a-zA-Z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/',
        ];

        $expiryDate = null;
        $isExpired = false;
        $isAboutToExpire = false;
        $dateInfo = null;

        foreach ($expiryDatePatterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                try {
                    $dateStr = trim($matches[1]);
                    $expiryDate = Carbon::parse($dateStr);

                    $dateInfo = [
                        'date' => $expiryDate->format('Y-m-d'),
                        'formatted' => $expiryDate->format('F j, Y'),
                    ];

                    if ($expiryDate->isPast()) {
                        $isExpired = true;
                        $dateInfo['status'] = 'expired';
                    } elseif ($expiryDate->diffInDays(Carbon::now()) <= 30) {
                        $isAboutToExpire = true;
                        $dateInfo['status'] = 'expiring_soon';
                    } else {
                        $dateInfo['status'] = 'valid';
                    }

                    break;
                } catch (\Exception $e) {
                    Log::warning("Failed to parse expiry date: {$dateStr}");
                }
            }
        }

        if ($expiryDate && $isExpired) {
            return [
                'isValid' => false,
                'message' => 'This DTI registration has expired on ' . $expiryDate->format('F j, Y') . '. Please upload a valid certificate.',
                'issue' => 'expired',
                'status' => 'error',
                'date_info' => $dateInfo
            ];
        }

        // If we found DTI identifiers and quality is good, consider it valid
        $result = [
            'isValid' => true,
            'message' => 'DTI registration certificate verified successfully.',
            'issue' => null,
            'status' => 'success',
            'date_info' => $dateInfo
        ];

        if ($expiryDate && $isAboutToExpire) {
            $result['warning'] = 'Your DTI registration will expire soon on ' . $expiryDate->format('F j, Y');
        }

        return $result;
    }

    /**
     * Verify a valid ID using Google Vision API
     */
    public function verifyValidId(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        try {
            $imageFile = $request->file('image');
            $imagePath = $imageFile->path();

            // Extract text from the document
            $extractResult = $this->extractTextFromImage($imagePath);
            $extractedText = $extractResult['text'];
            $confidence = $extractResult['confidence'];

            // Validate ID
            $validationResult = $this->validateValidId($extractedText);

            return response()->json([
                'success' => true,
                'is_valid' => $validationResult['isValid'],
                'message' => $validationResult['message'],
                'issue' => $validationResult['issue'],
                'status' => $validationResult['status'],
                'confidence' => $confidence,
                'extracted_text' => $extractedText,
                'date_info' => $validationResult['date_info'] ?? null
            ]);
        } catch (\Exception $e) {
            Log::error('Valid ID verification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error processing document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate if the document is a valid ID
     */
    private function validateValidId($text)
    {
        $text = strtolower($text);

        $idTypes = [
            'driver\'s license',
            'passport',
            'postal id',
            'voter\'s id',
            'sss',
            'gsis',
            'umid',
            'philhealth',
            'prc',
            'identification card',
            'national id',
            'philippine identification'
        ];

        $detectedIdType = '';
        $isGovtId = false;
        foreach ($idTypes as $idType) {
            if (stripos($text, $idType) !== false) {
                $isGovtId = true;
                $detectedIdType = $idType;
                break;
            }
        }

        if (!$isGovtId) {
            return [
                'isValid' => false,
                'message' => 'This does not appear to be a government-issued ID.',
                'issue' => 'not_government_id',
                'status' => 'error'
            ];
        }

        // Check image quality
        $lowQuality = strlen($text) < 50;

        if ($lowQuality) {
            return [
                'isValid' => false,
                'message' => 'The image quality is too low. Please upload a clearer image of your ID.',
                'issue' => 'low_quality',
                'status' => 'warning'
            ];
        }

        // Check for name on ID
        $hasName = preg_match('/name[: ]*([\w\s\.]+)/i', $text) ||
            preg_match('/([\w\s\.]{2,})\s*,\s*([\w\s\.]{2,})/', $text);

        // Check for expiration date
        $expiryDatePatterns = [
            '/valid(?:\s+)until(?:\s+)([a-zA-Z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/',
            '/expir(?:y|ation|es)(?:\s+)(?:date)?(?:\s*):(?:\s*)([a-zA-Z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/',
            '/(?:date of expiry|expiry date)(?:\s*):(?:\s*)([a-zA-Z]+\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/',
        ];

        $expiryDate = null;
        $isExpired = false;
        $isAboutToExpire = false;
        $dateInfo = null;

        foreach ($expiryDatePatterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                try {
                    $dateStr = trim($matches[1]);
                    $expiryDate = Carbon::parse($dateStr);

                    $dateInfo = [
                        'date' => $expiryDate->format('Y-m-d'),
                        'formatted' => $expiryDate->format('F j, Y'),
                    ];

                    if ($expiryDate->isPast()) {
                        $isExpired = true;
                        $dateInfo['status'] = 'expired';
                    } elseif ($expiryDate->diffInDays(Carbon::now()) <= 30) {
                        $isAboutToExpire = true;
                        $dateInfo['status'] = 'expiring_soon';
                    } else {
                        $dateInfo['status'] = 'valid';
                    }

                    break;
                } catch (\Exception $e) {
                    Log::warning("Failed to parse expiry date: {$dateStr}");
                }
            }
        }

        if ($expiryDate && $isExpired) {
            return [
                'isValid' => false,
                'message' => 'This ID has expired on ' . $expiryDate->format('F j, Y') . '. Please upload a valid ID.',
                'issue' => 'expired',
                'status' => 'error',
                'date_info' => $dateInfo
            ];
        }

        if (!$hasName) {
            return [
                'isValid' => false,
                'message' => 'Unable to verify name on ID. Please ensure the ID shows your full name clearly.',
                'issue' => 'missing_name',
                'status' => 'warning',
                'date_info' => $dateInfo
            ];
        }

        $result = [
            'isValid' => true,
            'message' => ucfirst($detectedIdType) . ' verified successfully.',
            'issue' => null,
            'status' => 'success',
            'date_info' => $dateInfo
        ];

        if ($expiryDate && $isAboutToExpire) {
            $result['warning'] = 'Your ID will expire soon on ' . $expiryDate->format('F j, Y');
        }

        return $result;
    }
}
