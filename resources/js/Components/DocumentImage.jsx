import React, { useState } from "react";
import { FileText, Eye, Download } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function DocumentImage({ src, alt = "Document" }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Handle loading and error states
  const handleLoad = () => setIsLoading(false);
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  
  // Open document in new tab
  const viewDocument = () => {
    if (src && !hasError) {
      window.open(src, '_blank');
    }
  };
  
  // Download document
  const downloadDocument = () => {
    if (src && !hasError) {
      const link = document.createElement('a');
      link.href = src;
      link.download = alt || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className="relative w-full h-40 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center cursor-pointer"
        onClick={viewDocument}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {hasError ? (
          <div className="flex flex-col items-center">
            <FileText className="h-12 w-12 text-gray-400" />
            <p className="text-xs text-gray-500 mt-1">Could not load document</p>
          </div>
        ) : (
          <>
            <img 
              src={src} 
              alt={alt} 
              className={`h-full w-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleLoad}
              onError={handleError}
            />
            
            {!isLoading && (
              <div className="absolute bottom-2 right-2 opacity-70 hover:opacity-100">
                <Button size="sm" variant="secondary" onClick={viewDocument}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="flex gap-2 mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs" 
          disabled={hasError}
          onClick={viewDocument}
        >
          <Eye className="h-3 w-3 mr-1" /> View
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs" 
          disabled={hasError}
          onClick={downloadDocument}
        >
          <Download className="h-3 w-3 mr-1" /> Download
        </Button>
      </div>
    </div>
  );
}
