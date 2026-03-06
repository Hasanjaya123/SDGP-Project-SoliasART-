import React, { useState } from 'react';

const ArtworkGallery = ({ images, title }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up w-full">
      
      {/* Main Image Display */}
      <div className="w-full flex justify-center items-center">
        <img 
          src={mainImage} 
          alt={title} 
        //   Styling of the main image
          className="max-h-[75vh] w-auto h-auto max-w-full object-contain shadow-[0_20px_50px_rgba(0,0,0,0.5)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500" 
        />
      </div>

      {/* Thumbnail Carousel (only show if there are multiple images) */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto py-4 px-2 scrollbar-hide justify-center">
          {images.map((img, index) => (
            <button 
              key={index}
              onClick={() => setMainImage(img)}
              className={`flex-shrink-0 w-20 h-20 transition-all duration-300 rounded-md p-0.5 !border-transparent focus:!outline-none hover:!border-transparent ${
                mainImage === img 
                  ? 'ring-2 ring-amber-500 scale-110 opacity-100 shadow-lg z-10' 
                  : 'ring-2 ring-gray-400 dark:ring-gray-800 opacity-60 hover:opacity-100 hover:scale-105 hover:!border-transparent focus:!outline-none '
              }`}
            >
              <img 
                src={img} 
                alt={`${title} view ${index + 1}`} 
                className="w-full h-full object-cover rounded-sm" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtworkGallery;