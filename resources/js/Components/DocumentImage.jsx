import React, { useState } from 'react';

const DocumentImage = ({ src, alt, className = "max-w-full max-h-[200px] object-contain", imgStyle = {} }) => {
  const [error, setError] = useState(false);
  
  const handleError = () => {
    console.log("Error loading image:", src);
    setError(true);
  };
  
  if (error) {
    return (
      <div className={`flex items-center justify-center ${className} bg-gray-50`}>
        <p className="text-gray-400 text-sm">Image preview unavailable</p>
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={imgStyle}
      onError={handleError}
    />
  );
};

export default DocumentImage;
