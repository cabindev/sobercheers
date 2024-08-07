'use client'

import React, { useRef, useState } from 'react';
import { FaMapMarkerAlt, FaGlobeAsia, FaDownload } from 'react-icons/fa';
import * as htmlToImage from 'html-to-image';

interface FormData {
  organizationName: string;
  amphoe: string;
  type: string;
}

interface StyleProps {
  images: string[];
  form: FormData;
}

const Style1: React.FC<StyleProps> = ({ images, form }) => {
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (cardInnerRef.current) {
      setIsLoading(true);
      try {
        await Promise.all(
          Array.from(cardInnerRef.current.getElementsByTagName('img'))
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))
        );
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
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-md relative transform hover:scale-105 transition-all duration-300">
        <div className="absolute inset-0 opacity-10">
          <img src="/bg3.svg" alt="Background" className="w-full h-full object-cover" />
        </div>
        
        <div ref={cardInnerRef} className="relative z-10 p-6">
          <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
            {form.organizationName}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {images.map((src, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-md transform hover:scale-110 hover:rotate-2 transition-all duration-300">
                <img src={src} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-gray-700 hover:text-blue-500 transition-colors duration-300">
              <FaMapMarkerAlt className="text-blue-500 mr-2" />
              <span className="font-medium">อำเภอ:</span>
              <span className="ml-2">{form.amphoe}</span>
            </div>
            <div className="flex items-center text-gray-700 hover:text-purple-500 transition-colors duration-300">
              <FaGlobeAsia className="text-purple-500 mr-2" />
              <span className="font-medium">ภาค:</span>
              <span className="ml-2">{form.type}</span>
            </div>
          </div>
        </div>
      </div>
      <button 
        onClick={handleDownload}
        disabled={isLoading}
        className="mt-4 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
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

export default Style1;