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
                'date_info' => $validationResult['date_info'] ?? null
            ]);
        } catch (\Exception $e) {
            Log::error('Business permit verification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error processing document. Please try again.'
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
     * Check for expiration date and extract date information
     * @param string $text Extracted text from document
     * @param array $patterns Array of regex patterns to match dates
     * @return array|null Date information or null if no valid date found
     */
    private function extractExpirationDate($text, $patterns)
    {
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                try {
                    $dateStr = trim($matches[1]);
                    
                    // Try multiple date parsing strategies
                    $expiryDate = $this->parseDateFlexibly($dateStr);
                    
                    if ($expiryDate) {
                        $now = Carbon::now();
                        $thirtyDaysFromNow = $now->copy()->addDays(30);
                        $ninetyDaysFromNow = $now->copy()->addDays(90);
                        
                        // Calculate days until expiry for more precise warnings
                        $daysUntilExpiry = $now->diffInDays($expiryDate, false);
                        
                        $dateInfo = [
                            'date' => $expiryDate->format('Y-m-d'),
                            'formatted' => $expiryDate->format('F j, Y'),
                            'days_until_expiry' => $daysUntilExpiry,
                            'raw_date_string' => $dateStr
                        ];

                        if ($expiryDate->isPast()) {
                            $dateInfo['status'] = 'expired';
                            $dateInfo['severity'] = 'error';
                        } elseif ($expiryDate->lte($thirtyDaysFromNow)) {
                            $dateInfo['status'] = 'critical';
                            $dateInfo['severity'] = 'warning';
                            $dateInfo['days_warning'] = "Expires in {$daysUntilExpiry} days";
                        } elseif ($expiryDate->lte($ninetyDaysFromNow)) {
                            $dateInfo['status'] = 'warning';
                            $dateInfo['severity'] = 'info';
                            $dateInfo['days_warning'] = "Expires in {$daysUntilExpiry} days";
                        } else {
                            $dateInfo['status'] = 'valid';
                            $dateInfo['severity'] = 'success';
                        }

                        return $dateInfo;
                    }
                } catch (\Exception $e) {
                    Log::warning("Failed to parse expiry date '{$dateStr}': " . $e->getMessage());
                }
            }
        }
        
        return null;
    }

    /**
     * Parse date string using multiple strategies for better accuracy
     * @param string $dateStr Date string to parse
     * @return Carbon|null Carbon date object or null if parsing fails
     */
    private function parseDateFlexibly($dateStr)
    {
        // Strategy 1: Try standard Carbon parsing
        try {
            $date = Carbon::parse($dateStr);
            if ($this->isReasonableDate($date)) {
                return $date;
            }
        } catch (\Exception $e) {
            // Silently continue if standard parsing fails
        }
        
        // Strategy 2: Format with delimiters (MM/DD/YYYY, DD/MM/YYYY)
        $delimiterPattern = '/(\d{1,2})[\/-\.](\d{1,2})[\/-\.](\d{2,4})/';
        if (preg_match($delimiterPattern, $dateStr, $matches)) {
            try {
                $part1 = (int)$matches[1];
                $part2 = (int)$matches[2];
                $part3 = (int)$matches[3];
                
                // Handle 2-digit years
                if ($part3 < 100) {
                    $part3 = $part3 + ($part3 > 50 ? 1900 : 2000);
                }
                
                // Try different date formats (PH typically uses MM/DD/YYYY)
                if ($part1 <= 12) {
                    // Assume MM/DD/YYYY
                    $date = Carbon::createFromDate($part3, $part1, $part2);
                    if ($this->isReasonableDate($date)) {
                        return $date;
                    }
                }
                
                if ($part2 <= 12) {
                    // Assume DD/MM/YYYY
                    $date = Carbon::createFromDate($part3, $part2, $part1);
                    if ($this->isReasonableDate($date)) {
                        return $date;
                    }
                }
            } catch (\Exception $e) {
                // Silently continue if delimiter parsing fails
            }
        }
        
        // Strategy 3: Text dates in Philippine format (15 January 2023 or January 15, 2023)
        $months = [
            'january' => 1, 'february' => 2, 'march' => 3, 'april' => 4, 
            'may' => 5, 'june' => 6, 'july' => 7, 'august' => 8, 
            'september' => 9, 'october' => 10, 'november' => 11, 'december' => 12,
            'jan' => 1, 'feb' => 2, 'mar' => 3, 'apr' => 4, 'jun' => 6, 
            'jul' => 7, 'aug' => 8, 'sep' => 9, 'sept' => 9, 'oct' => 10, 
            'nov' => 11, 'dec' => 12
        ];
        
        // Pattern for "15 January 2023"
        $pattern1 = '/(\d{1,2})\s+([a-z]+)\s+(\d{4})/i';
        
        // Pattern for "January 15, 2023" or "January 15 2023"
        $pattern2 = '/([a-z]+)\s+(\d{1,2})(?:,|)\s+(\d{4})/i';
        
        if (preg_match($pattern1, $dateStr, $matches)) {
            try {
                $day = (int)$matches[1];
                $monthName = strtolower($matches[2]);
                $year = (int)$matches[3];
                
                if (isset($months[$monthName])) {
                    $month = $months[$monthName];
                    $date = Carbon::createFromDate($year, $month, $day);
                    if ($this->isReasonableDate($date)) {
                        return $date;
                    }
                }
            } catch (\Exception $e) {
                // Silently continue if text date parsing fails
            }
        }
        
        if (preg_match($pattern2, $dateStr, $matches)) {
            try {
                $monthName = strtolower($matches[1]);
                $day = (int)$matches[2];
                $year = (int)$matches[3];
                
                if (isset($months[$monthName])) {
                    $month = $months[$monthName];
                    $date = Carbon::createFromDate($year, $month, $day);
                    if ($this->isReasonableDate($date)) {
                        return $date;
                    }
                }
            } catch (\Exception $e) {
                // Silently continue if text date parsing fails
            }
        }
        
        return null;
    }

    /**
     * Check if a date is reasonable (not in distant past/future)
     * @param Carbon $date Date to check
     * @return bool True if date is reasonable
     */
    private function isReasonableDate($date) 
    {
        // Verify the date is not impossible
        if (!$date->isValid()) {
            return false;
        }
        
        // Check if date is within reasonable range (5 years in past to 10 years in future)
        $fiveYearsAgo = Carbon::now()->subYears(5);
        $tenYearsFromNow = Carbon::now()->addYears(10);
        
        return $date->gte($fiveYearsAgo) && $date->lte($tenYearsFromNow);
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

        // Use the enhanced expiration date extraction
        $expiryDatePatterns = [
            '/valid(?:\s+)until(?:\s+)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/expir(?:y|ation|es)(?:\s+)(?:date)?(?:\s*):(?:\s*)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/(?:date of expiry|expiry date)(?:\s*):(?:\s*)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/(?:permit\s+expires|expires\s+on)(?:\s+)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/(?:id|card)\s+expires(?:\s+)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/(?:certificate|registration)\s+expires(?:\s+)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/validity(?:\s+)(?:period|date)?(?:\s*):(?:\s*)([a-zA-Z0-9,\s\/\.\-]+)/',
        ];
        
        $dateInfo = $this->extractExpirationDate($text, $expiryDatePatterns);
        
        // Check if document has expired
        if ($dateInfo && $dateInfo['status'] === 'expired') {
            return [
                'isValid' => false,
                'message' => 'This business permit has expired on ' . $dateInfo['formatted'] . '. Please upload a valid permit.',
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

        // Add appropriate warnings based on expiration status
        if ($dateInfo) {
            if ($dateInfo['status'] === 'critical') {
                $result['warning'] = 'Your business permit will expire soon (' . $dateInfo['days_warning'] . ')';
            } else if ($dateInfo['status'] === 'warning') {
                $result['info'] = 'Note: ' . $dateInfo['days_warning'];
            }
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
                'date_info' => $validationResult['date_info'] ?? null
            ]);
        } catch (\Exception $e) {
            Log::error('DTI registration verification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error processing document. Please try again.'
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

        // Use the enhanced expiration date extraction
        $expiryDatePatterns = [
            '/valid(?:\s+)until(?:\s+)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/expir(?:y|ation|es)(?:\s+)(?:date)?(?:\s*):(?:\s*)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/(?:date of expiry|expiry date)(?:\s*):(?:\s*)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/(?:permit\s+expires|expires\s+on)(?:\s+)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/(?:id|card)\s+expires(?:\s+)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/(?:certificate|registration)\s+expires(?:\s+)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/validity(?:\s+)(?:period|date)?(?:\s*):(?:\s*)([a-zA-Z0-9,\s\/\.\-]+)/',
        ];
        
        $dateInfo = $this->extractExpirationDate($text, $expiryDatePatterns);
        
        // Check if document has expired
        if ($dateInfo && $dateInfo['status'] === 'expired') {
            return [
                'isValid' => false,
                'message' => 'This DTI registration has expired on ' . $dateInfo['formatted'] . '. Please upload a valid certificate.',
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

        // Add appropriate warnings based on expiration status
        if ($dateInfo) {
            if ($dateInfo['status'] === 'critical') {
                $result['warning'] = 'Your DTI registration will expire soon (' . $dateInfo['days_warning'] . ')';
            } else if ($dateInfo['status'] === 'warning') {
                $result['info'] = 'Note: ' . $dateInfo['days_warning'];
            }
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
                'date_info' => $validationResult['date_info'] ?? null
            ]);
        } catch (\Exception $e) {
            Log::error('Valid ID verification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error processing document. Please try again.'
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
            'national id',
            'identification card',
            'philippine identification'
        ];

        $isGovtId = false;
        $detectedIdType = '';
        
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

        // Use the enhanced expiration date extraction
        $expiryDatePatterns = [
            '/valid(?:\s+)until(?:\s+)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/expir(?:y|ation|es)(?:\s+)(?:date)?(?:\s*):(?:\s*)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/(?:date of expiry|expiry date)(?:\s*):(?:\s*)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/(?:permit\s+expires|expires\s+on)(?:\s+)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/(?:id|card)\s+expires(?:\s+)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/(?:certificate|registration)\s+expires(?:\s+)([a-zA-Z0-9,\s\/\.\-]+)/',
            '/validity(?:\s+)(?:period|date)?(?:\s*):(?:\s*)([a-zA-Z0-9,\s\/\.\-]+)/',
        ];
        
        $dateInfo = $this->extractExpirationDate($text, $expiryDatePatterns);
        
        // Check if document has expired
        if ($dateInfo && $dateInfo['status'] === 'expired') {
            return [
                'isValid' => false,
                'message' => 'This ID has expired on ' . $dateInfo['formatted'] . '. Please upload a valid ID.',
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

        // Add appropriate warnings based on expiration status
        if ($dateInfo) {
            if ($dateInfo['status'] === 'critical') {
                $result['warning'] = 'Your ID will expire soon (' . $dateInfo['days_warning'] . ')';
            } else if ($dateInfo['status'] === 'warning') {
                $result['info'] = 'Note: ' . $dateInfo['days_warning'];
            }
        }

        return $result;
    }
}
