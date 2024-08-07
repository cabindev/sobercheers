import React, { useRef } from 'react';
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

const Style4: React.FC<StyleProps> = ({ images, form }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(cardRef.current);
        const link = document.createElement('a');
        link.download = `${form.organizationName}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-sky-50 min-h-screen p-4 flex flex-col items-center justify-center">
      <div ref={cardRef} className="bg-white shadow-lg rounded-2xl overflow-hidden p-5 w-full max-w-xs sm:max-w-sm">
        <h2 className="text-xl sm:text-2xl text-center font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-500">
          {form.organizationName}
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {images.map((src, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300">
              <img src={src} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="text-cyan-500 mr-2" />
            <span className="font-medium">อำเภอ:</span>
            <span className="ml-2 text-sm">{form.amphoe}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaGlobeAsia className="text-sky-500 mr-2" />
            <span className="font-medium">ภาค:</span>
            <span className="ml-2 text-sm">{form.type}</span>
          </div>
        </div>
      </div>
      <button 
        onClick={handleDownload}
        className="mt-4 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-4 py-2 rounded-full hover:from-cyan-600 hover:to-sky-600 transition-colors duration-300"
      >
        <FaDownload className="mr-2" />
        ดาวน์โหลดการ์ด
      </button>
    </div>
  );
};

export default Style4;