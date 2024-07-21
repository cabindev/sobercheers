

import React, { useState } from 'react';
import { toPng } from 'html-to-image';

interface ProfileCardProps {
  firstName: string;
  lastName: string;
  image: string;
  intentPeriod: string;
  motivations: string[] | string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ firstName, lastName, image, intentPeriod, motivations }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCard = async () => {
    if (cardRef.current === null) {
      return;
    }
    
    setIsDownloading(true);
    
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95 });
      
      const link = document.createElement('a');
      link.download = `${firstName}-${lastName}-sobriety-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading card:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getMotivationsString = (motivations: string[] | string): string => {
    if (Array.isArray(motivations)) {
      return motivations.join(', ');
    }
    return motivations || '';
  };

  const handleCardClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-yellow-400 to-orange-500 p-4">
      <div className={`relative ${isDownloading ? 'animate-neon-border' : ''}`}>
        <div
          className={`w-96 rounded-3xl overflow-hidden shadow-lg bg-white relative cursor-pointer transition-all duration-300 ${
            isClicked ? 'scale-95 rotate-1' : 'hover:scale-105'
          }`}
          ref={cardRef}
          onClick={handleCardClick}
        >
          {/* พื้นหลัง buddhist.png */}
          <div className="absolute inset-0 z-0">
            <img
              src="../buddhist.png"
              alt="Buddhist background"
              className="w-full h-full object-cover opacity-5"
            />
          </div>
          <div className="relative z-10">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-32"></div>
            <div className="px-6 py-4">
              <div className="flex justify-center -mt-16">
                <img
                  src={image || "https://via.placeholder.com/150"}
                  alt={`${firstName} ${lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  {firstName} {lastName}
                </p>
               
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
                    งดเหล้า 3 เดือน
                  </span>
                </h2>
                <h3 className="text-xl md:text-2xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
                    เปลี่ยนคุณคนใหม่ใน 90 วัน
                  </span>
                </h3>
           
              </div>
              
              <div className="mt-4 relative">
                <p className="text-sm text-gray-600 px-8 py-2 text-center">
                  {getMotivationsString(motivations)}
                </p>
               
              </div>
            </div>
            <div className="bg-gray-100 py-3 px-6 mt-4 text-center">
              <span className="inline-block bg-yellow-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                #HealthySobriety #SoberCheers
              </span>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={downloadCard}
        className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        title="Download Card"
        disabled={isDownloading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDownloading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    </div>
  );
};

export default ProfileCard;