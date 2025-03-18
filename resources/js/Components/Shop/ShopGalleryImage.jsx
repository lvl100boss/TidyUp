import React, { useState } from "react";
import { Image } from "lucide-react";

export default function ShopGalleryImage({ src, alt = "Shop image", className = "" }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const handleLoad = () => setIsLoading(false);
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  
  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {hasError ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Image className="h-8 w-8 text-gray-400" />
          <p className="text-xs text-gray-500 mt-1">Image not found</p>
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt} 
          className={`h-full w-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}
