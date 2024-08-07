import React, { useRef, useState } from 'react';
import { FaMapMarkerAlt, FaGlobeAmericas, FaDownload } from 'react-icons/fa';
import * as htmlToImage from 'html-to-image';

interface StyleProps {
  images: string[];
  form: {
    organizationName: string;
    amphoe: string;
    type: string;
  };
}

const Style2: React.FC<StyleProps> = ({ images, form }) => {
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (cardInnerRef.current) {
      setIsLoading(true);
      try {
        // Wait for images to load
        await Promise.all(
          Array.from(cardInnerRef.current.getElementsByTagName('img'))
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.onload = img.onerror = resolve;
            }))
        );

        // Add a small delay to ensure all styles are applied
        await new Promise(resolve => setTimeout(resolve, 100));

        const dataUrl = await htmlToImage.toPng(cardInnerRef.current, {
          quality: 1.0,
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: '#ffffff',
        });
        const link = document.createElement('a');
        link.download = `${form.organizationName}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-lime-50 min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-md w-full mx-auto">
        <div ref={cardInnerRef}>
          <h2 className="text-xl sm:text-2xl font-bold text-center py-4 px-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-lime-500">
            {form.organizationName}
          </h2>
          
          <div className="relative w-full h-64 sm:h-80 bg-gray-100">
            {images.length > 0 && (
              <img 
                src={images[0]} 
                alt="Main Image" 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex overflow-x-auto p-2 space-x-2">
              {images.slice(1).map((src, index) => (
                <img 
                  key={index} 
                  src={src} 
                  alt={`Image ${index + 2}`} 
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
              ))}
            </div>
          )}
          
          <div className="p-4 space-y-2">
            <div className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="text-amber-500 mr-2" />
              <span className="font-medium">อำเภอ:</span>
              <span className="ml-2">{form.amphoe}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaGlobeAmericas className="text-lime-500 mr-2" />
              <span className="font-medium">ภาค:</span>
              <span className="ml-2">{form.type}</span>
            </div>
          </div>
        </div>
      </div>
      <button 
        onClick={handleDownload}
        disabled={isLoading}
        className="mt-4 flex items-center justify-center bg-gradient-to-r from-amber-500 to-lime-500 text-white px-4 py-2 rounded-full hover:from-amber-600 hover:to-lime-600 transition-colors duration-300 disabled:opacity-50"
      >
        {isLoading ? 'กำลังดาวน์โหลด...' : (
          <>
            <FaDownload className="mr-2" />
            ดาวน์โหลดการ์ด
          </>
        )}
      </button>
    </div>
  );
};

export default Style2;