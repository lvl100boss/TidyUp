import React, { useState } from 'react';

const ShopGalleryImage = ({ src, alt, className = "w-full h-full object-cover" }) => {
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => {
    if (!src) return null;
    
    // If already has http prefix, use as is
    if (src.startsWith('http')) {
      return src;
    }
    
    // Remove leading slash if present
    return src.startsWith('/') ? src.substring(1) : src;
  });
  
  const handleError = (e) => {
    console.log("Error loading shop gallery image:", imageSrc);
    e.target.onerror = null;
    
    // Try alternative path formatting as fallback
    if (!error) {
      // If path contains 'storage/', try without it
      if (imageSrc.includes('storage/')) {
        const newSrc = imageSrc.replace('storage/', '');
        console.log("Trying without storage prefix:", newSrc);
        setImageSrc(newSrc);
      } else {
        // If path doesn't contain 'storage/', try adding it
        const newSrc = `storage/${imageSrc.split('/').pop()}`;
        console.log("Trying with storage prefix:", newSrc);
        setImageSrc(newSrc);
      }
      setError(true);
    } else {
      // If we've already tried an alternative, show the placeholder
      setImageSrc(null);
    }
  };
  
  if (imageSrc === null) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
          <circle cx="9" cy="9" r="2"></circle>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
        </svg>
      </div>
    );
  }
  
  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className} 
      onError={handleError}
    />
  );
};

export default ShopGalleryImage;
