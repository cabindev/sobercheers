import React, { useRef, useState } from 'react';
import { FaMapMarkerAlt, FaGlobeAsia, FaDownload } from 'react-icons/fa';
import * as htmlToImage from 'html-to-image';

interface StyleProps {
  images: string[];
  form: {
    organizationName: string;
    amphoe: string;
    type: string;
  };
}

const Style3: React.FC<StyleProps> = ({ images, form }) => {
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
          backgroundColor: '#ffffff', // Ensure white background
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
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden p-4 relative w-full max-w-sm mx-auto">
        <div ref={cardInnerRef} className="relative">
          <div className="relative w-full h-48 sm:h-56 mb-4">
            {images.length > 0 && (
              <div className="absolute inset-0">
                <img src={images[0]} alt="Image 1" className="w-full h-full object-cover rounded-lg shadow-md" />
              </div>
            )}
            {images.length > 1 && (
              <div className="absolute inset-2 w-[70%] h-[70%] transform rotate-3 z-10">
                <img src={images[1]} alt="Image 2" className="w-full h-full object-cover rounded-lg shadow-md" />
              </div>
            )}
          </div>
          <div className="absolute inset-0 z-0">
            <img
              src="/bg3.svg"
              alt="Background"
              className="w-full h-full object-contain opacity-10"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              {form.organizationName}
            </h2>
            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <FaMapMarkerAlt className="text-blue-500 mr-2" />
                <span className="font-medium">อำเภอ:</span>
                <span className="ml-2">{form.amphoe}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaGlobeAsia className="text-purple-500 mr-2" />
                <span className="font-medium">ภาค:</span>
                <span className="ml-2">{form.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button 
        onClick={handleDownload}
        disabled={isLoading}
        className="mt-4 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-600 transition-colors duration-300 disabled:opacity-50"
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

export default Style3;