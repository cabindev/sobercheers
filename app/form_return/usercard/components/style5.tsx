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

const Style5: React.FC<StyleProps> = ({ images, form }) => {
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col items-center justify-center p-2">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-[470px]" ref={cardRef}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {form.organizationName}
          </h2>
        </div>
        <div className="relative flex justify-center items-center h-[470px] bg-gray-100 overflow-hidden">
          {images.map((src, index) => (
            <div 
              key={index} 
              className="absolute w-[280px] h-[350px] bg-white p-2 rounded-lg shadow-md transform transition-all duration-300 hover:z-10 hover:scale-105"
              style={{ 
                zIndex: images.length - index,
                transform: `rotate(${(index - (images.length - 1) / 2) * 5}deg) translateY(${index * 5}px)`
              }}
            >
              <img src={src} alt={`Image ${index + 1}`} className="w-full h-full object-cover rounded-md" />
            </div>
          ))}
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="text-blue-600 mr-2" />
            <span className="font-medium">อำเภอ:</span>
            <span className="ml-2">{form.amphoe}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaGlobeAsia className="text-purple-600 mr-2" />
            <span className="font-medium">ภาค:</span>
            <span className="ml-2">{form.type}</span>
          </div>
        </div>
      </div>
      <button 
        onClick={handleDownload}
        className="mt-4 flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
      >
        <FaDownload className="mr-2" />
        ดาวน์โหลดการ์ด
      </button>
    </div>
  );
};

export default Style5;