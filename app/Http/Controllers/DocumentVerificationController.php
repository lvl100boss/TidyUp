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
            $extractedText = $this->extractTextFromImage($imagePath);

            // Perform specific business permit validation
            $validationResult = $this->validateBusinessPermit($extractedText);

            return response()->json([
                'success' => true,
                'is_valid' => $validationResult['isValid'],
                'message' => $validationResult['message'],
                'issue' => $validationResult['issue'],
                'status' => $validationResult['status']
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

        // Close the client
        $imageAnnotator->close();

        return $text;
    }

    /**
     * Validate if the document is likely a business permit
     */
    private function validateBusinessPermit($text)
    {
        $text = strtolower($text);
        $currentYear = Carbon::now()->year;
        
        // Common phrases to identify business permits
        $permitIdentifiers = [
            'business permit',
            'mayor\'s permit',
            'certificate of business registration'
        ];
        
        // Check for permit identifiers
        $isPermit = false;
        foreach ($permitIdentifiers as $identifier) {
            if (stripos($text, $identifier) !== false) {
                $isPermit = true;
                break;
            }
        }
        
        // If it's not a permit at all
        if (!$isPermit) {
            return [
                'isValid' => false,
                'message' => 'This does not appear to be a business permit.',
                'issue' => 'incorrect_document',
                'status' => 'error'
            ];
        }
        
        // Check for expiration dates
        $expiredPermit = false;
        $hasExpirationDate = false;
        
        // Search for expiration date patterns
        if (preg_match('/valid until[: ]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/', $text, $matches)) {
            $hasExpirationDate = true;
            $expiryDateStr = $matches[1];
            
            // Try to parse the date
            try {
                $expiryDate = Carbon::createFromFormat('m/d/Y', $expiryDateStr);
                if ($expiryDate->isPast()) {
                    $expiredPermit = true;
                }
            } catch (\Exception $e) {
                // If date format doesn't match, try another format
                try {
                    $expiryDate = Carbon::createFromFormat('d-m-Y', $expiryDateStr);
                    if ($expiryDate->isPast()) {
                        $expiredPermit = true;
                    }
                } catch (\Exception $e) {
                    // Unable to parse date
                }
            }
        }
        
        // Look for year indicators
        if (preg_match('/(?:valid|expir\w+)(?:\s+\w+){0,3}\s+(\d{4})/', $text, $matches)) {
            $yearFound = (int)$matches[1];
            if ($yearFound < $currentYear) {
                $expiredPermit = true;
                $hasExpirationDate = true;
            }
        }
        
        // Check image quality based on extracted text length
        $lowQuality = strlen($text) < 100; // Arbitrary threshold
        
        if ($lowQuality) {
            return [
                'isValid' => false,
                'message' => 'The image quality is too low. Please upload a clearer image of your business permit.',
                'issue' => 'low_quality',
                'status' => 'warning'
            ];
        }
        
        if ($hasExpirationDate && $expiredPermit) {
            return [
                'isValid' => false,
                'message' => 'This business permit appears to be expired. Please upload a current valid permit.',
                'issue' => 'expired',
                'status' => 'error'
            ];
        }
        
        // Check for business name
        $hasBusinessName = preg_match('/business name[: ]*([\w\s]+)/', $text) || 
                           preg_match('/name of business[: ]*([\w\s]+)/', $text);
        
        // Check for address
        $hasAddress = preg_match('/address[: ]*([\w\s\.,]+)/', $text) || 
                      preg_match('/business address[: ]*([\w\s\.,]+)/', $text);
        
        // Check if permit has all required fields
        if (!$hasBusinessName || !$hasAddress) {
            return [
                'isValid' => false,
                'message' => 'The business permit is incomplete or key information is not clearly visible.',
                'issue' => 'incomplete',
                'status' => 'warning'
            ];
        }
        
        return [
            'isValid' => true,
            'message' => 'Business permit verified successfully.',
            'issue' => null,
            'status' => 'success'
        ];
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
            $extractedText = $this->extractTextFromImage($imagePath);

            // Validate DTI registration
            $validationResult = $this->validateDtiRegistration($extractedText);

            return response()->json([
                'success' => true,
                'is_valid' => $validationResult['isValid'],
                'message' => $validationResult['message'],
                'issue' => $validationResult['issue'],
                'status' => $validationResult['status']
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
        $currentYear = Carbon::now()->year;
        
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
        $lowQuality = strlen($text) < 100;
        
        if ($lowQuality) {
            return [
                'isValid' => false,
                'message' => 'The image quality is too low. Please upload a clearer image of your DTI registration.',
                'issue' => 'low_quality',
                'status' => 'warning'
            ];
        }
        
        // Check for expiration
        $expiredCertificate = false;
        $hasExpirationDate = false;
        
        // Search for expiration dates
        if (preg_match('/valid until[: ]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/', $text, $matches)) {
            $hasExpirationDate = true;
            $expiryDateStr = $matches[1];
            
            try {
                $expiryDate = Carbon::createFromFormat('m/d/Y', $expiryDateStr);
                if ($expiryDate->isPast()) {
                    $expiredCertificate = true;
                }
            } catch (\Exception $e) {
                try {
                    $expiryDate = Carbon::createFromFormat('d-m-Y', $expiryDateStr);
                    if ($expiryDate->isPast()) {
                        $expiredCertificate = true;
                    }
                } catch (\Exception $e) {
                    // Unable to parse date
                }
            }
        }
        
        if (preg_match('/(?:valid|expir\w+)(?:\s+\w+){0,3}\s+(\d{4})/', $text, $matches)) {
            $yearFound = (int)$matches[1];
            if ($yearFound < $currentYear) {
                $expiredCertificate = true;
                $hasExpirationDate = true;
            }
        }
        
        if ($hasExpirationDate && $expiredCertificate) {
            return [
                'isValid' => false,
                'message' => 'This DTI registration appears to be expired. Please upload a current valid certificate.',
                'issue' => 'expired',
                'status' => 'error'
            ];
        }
        
        // Check for required fields
        $hasBusinessName = preg_match('/business name[: ]*([\w\s]+)/', $text);
        $hasRegistrationNumber = preg_match('/registration (?:no|number)[.: ]*([\w\d-]+)/', $text);
        $hasOwnerName = preg_match('/(?:proprietor|owner)[.: ]*([\w\s]+)/', $text);
        
        if (!$hasBusinessName || !$hasRegistrationNumber || !$hasOwnerName) {
            return [
                'isValid' => false,
                'message' => 'The DTI registration is incomplete or key information is not clearly visible.',
                'issue' => 'incomplete',
                'status' => 'warning'
            ];
        }
        
        return [
            'isValid' => true,
            'message' => 'DTI registration certificate verified successfully.',
            'issue' => null,
            'status' => 'success'
        ];
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
            $extractedText = $this->extractTextFromImage($imagePath);

            // Validate ID
            $validationResult = $this->validateValidId($extractedText);

            return response()->json([
                'success' => true,
                'is_valid' => $validationResult['isValid'],
                'message' => $validationResult['message'],
                'issue' => $validationResult['issue'],
                'status' => $validationResult['status']
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
        $currentYear = Carbon::now()->year;
        
        // Identify if it's a government ID
        $isGovtId = false;
        $idTypes = [
            'driver\'s license',
            'passport',
            'postal id',
            'voter\'s id',
            'senior citizen id',
            'sss',
            'gsis',
            'umid',
            'philhealth',
            'prc',
            'professional regulation commission',
            'identification card',
            'national id',
            'philippine identification'
        ];
        
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
        
        // Check for expiration
        $expiredId = false;
        $hasExpirationDate = false;
        
        if (preg_match('/(?:valid|expir\w+)[^\d]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/', $text, $matches)) {
            $hasExpirationDate = true;
            $expiryDateStr = $matches[1];
            
            try {
                $expiryDate = Carbon::createFromFormat('m/d/Y', $expiryDateStr);
                if ($expiryDate->isPast()) {
                    $expiredId = true;
                }
            } catch (\Exception $e) {
                try {
                    $expiryDate = Carbon::createFromFormat('d-m-Y', $expiryDateStr);
                    if ($expiryDate->isPast()) {
                        $expiredId = true;
                    }
                } catch (\Exception $e) {
                    // Unable to parse date
                }
            }
        }
        
        if (preg_match('/(?:valid|expiry|expiration)(?:\s+\w+){0,3}\s+(\d{4})/', $text, $matches)) {
            $yearFound = (int)$matches[1];
            if ($yearFound < $currentYear) {
                $expiredId = true;
                $hasExpirationDate = true;
            }
        }
        
        if ($hasExpirationDate && $expiredId) {
            return [
                'isValid' => false,
                'message' => 'This ID appears to be expired. Please upload a current valid ID.',
                'issue' => 'expired',
                'status' => 'error'
            ];
        }
        
        // Check for name on ID
        $hasName = preg_match('/name[: ]*([\w\s\.]+)/i', $text) || 
                  preg_match('/([\w\s\.]{2,})\s*,\s*([\w\s\.]{2,})/', $text);
                  
        if (!$hasName) {
            return [
                'isValid' => false,
                'message' => 'Unable to verify name on ID. Please ensure the ID shows your full name clearly.',
                'issue' => 'missing_name',
                'status' => 'warning'
            ];
        }
        
        return [
            'isValid' => true,
            'message' => ucfirst($detectedIdType) . ' verified successfully.',
            'issue' => null,
            'status' => 'success'
        ];
    }
}
