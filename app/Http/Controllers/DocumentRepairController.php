<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ShopLegalDocument;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DocumentRepairController extends Controller
{
    public function repair()
    {
        $documents = ShopLegalDocument::all();
        $results = [
            'processed' => 0,
            'fixed' => 0,
            'errors' => 0,
            'details' => []
        ];

        foreach ($documents as $document) {
            $results['processed']++;
            $fields = ['business_permit_url', 'dti_registration_url', 'valid_id_url'];
            $changes = [];

            foreach ($fields as $field) {
                if (empty($document->$field)) {
                    continue;
                }

                $path = $document->$field;
                $detail = ['field' => $field, 'original' => $path];

                // Check if file exists with current path
                $storagePath = str_replace('storage/', 'public/', $path);
                $publicPath = public_path($path);

                if (!Storage::exists($storagePath) && !file_exists($publicPath)) {
                    // Try fixing the path
                    $filename = basename($path);
                    $possiblePaths = [
                        "public/legal_documents/$filename",
                        "public/$filename",
                        "legal_documents/$filename"
                    ];

                    $found = false;
                    foreach ($possiblePaths as $possiblePath) {
                        if (Storage::exists($possiblePath)) {
                            // Found file - update path
                            $correctedPath = 'storage/' . str_replace('public/', '', $possiblePath);
                            $changes[$field] = $correctedPath;

                            $detail['status'] = 'fixed';
                            $detail['new'] = $correctedPath;
                            $found = true;
                            break;
                        }
                    }

                    if (!$found) {
                        $detail['status'] = 'not_found';
                    }
                } else {
                    $detail['status'] = 'ok';
                }

                $results['details'][] = $detail;
            }

            if (count($changes) > 0) {
                try {
                    $document->update($changes);
                    $results['fixed']++;
                } catch (\Exception $e) {
                    $results['errors']++;
                    Log::error("Error updating document {$document->id}: " . $e->getMessage());
                }
            }
        }

        return response()->json($results);
    }
}
