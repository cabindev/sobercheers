import React, { useState, useEffect } from 'react';
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [daysPassed, setDaysPassed] = useState(0);
  const [backgroundGradient, setBackgroundGradient] = useState('');

  useEffect(() => {
    const buddhistLentStart = new Date('2024-07-21');
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - buddhistLentStart.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    setDaysPassed(Math.max(0, daysDiff));

    // Generate a new gradient based on the current date
    const hue1 = (currentDate.getDate() * 12) % 360;
    const hue2 = (hue1 + 40) % 360;
    setBackgroundGradient(`from-[hsl(${hue1},50%,50%)] to-[hsl(${hue2},50%,50%)]`);
  }, []);

  const downloadCard = async () => {
    if (cardRef.current === null) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `${firstName}-${lastName}-sobriety-achievement.png`;
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
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex justify-center items-center p-4">
    <div className="w-full max-w-[320px] mx-auto relative">
      <div
        ref={cardRef}
        className={`w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-white relative transition-all duration-500 transform ${
          isFlipped ? "rotate-y-180" : ""
        } cursor-pointer`}
        onClick={handleCardClick}
      >
        {/* Front of the card */}
        <div className={`absolute inset-0 z-10 backface-hidden ${isFlipped ? "opacity-0" : "opacity-100"}`}>
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 opacity-50"></div>
          <div className="relative z-10 p-4 flex flex-col h-full justify-between">
            <div className="text-center">
              <div className="inline-block rounded-full p-1 bg-white shadow-lg mb-2">
                <img
                  src={image || "https://via.placeholder.com/150"}
                  alt={`${firstName} ${lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-2 border-yellow-400"
                />
              </div>
              <h1 className="text-lg  text-gray-800 mb-1">
                {firstName} {lastName}
              </h1>
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text font-bold">
                <p className="text-4xl mb-1">งดเหล้า 3 เดือน</p>
                <p className="text-2xl">เปลี่ยนคุณคนใหม่ใน 90 วัน</p>
              </div>
            </div>
            
            <div className="bg-yellow-100 rounded-lg p-3 mb-2">
              <h2 className="text-sm font-semibold text-gray-800 mb-1">แรงบันดาลใจของฉัน:</h2>
              <p className="text-xs text-gray-700 italic">"{getMotivationsString(motivations)}"</p>
            </div>
            
            <div className="text-center">
              <span className="inline-block bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-bold mr-1">
                #HealthySobriety
              </span>
              <span className="inline-block bg-green-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                #SoberCheers
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
        </div>

          {/* Back of the card */}
          <div
            className={`absolute inset-0 z-20 backface-hidden rotate-y-180 ${
              isFlipped ? "opacity-100" : "opacity-0"
            }`}
          >
            
            <div
              className={`w-full h-full flex flex-col items-center justify-between bg-gradient-to-br ${backgroundGradient} p-8 text-white`}
            >
              <div className="absolute top-0 left-0 w-full h-16 bg-white opacity-10 transform -skew-y-3"></div>

              <img
                src="../buddhist.png"
                alt="buddhist"
                className="w-48 h-48 object-contain mb-4"
              />

              <h2 className="text-4xl font-bold mb-4 text-center">
                สติ สมาธิ ปัญญา
              </h2>

              <div className="bg-white bg-opacity-20 rounded-lg p-5 mb-4 w-full max-w-xs">
                <p className="text-lg font-semibold text-center mb-1">
                  ระยะเวลาแห่งการเปลี่ยนแปลง
                </p>
                <p className="text-5xl font-bold text-center text-yellow-300">
                  {daysPassed} วัน
                </p>
              </div>

              <p className="text-base italic text-center mb-4">
                "การเปลี่ยนแปลงเริ่มต้นจากภายใน
                <br />
                ทุกก้าวคือความสำเร็จ"
              </p>

              <div className="flex space-x-3">
                <span className="bg-yellow-400 text-indigo-900 rounded-full px-3 py-1 text-xs font-bold">
                  #งดเหล้าเข้าพรรษา
                </span>
                <span className="bg-green-400 text-indigo-900 rounded-full px-3 py-1 text-xs font-bold">
                  #ชีวิตใหม่
                </span>
              </div>

              <div className="absolute bottom-0 right-0 w-full h-16 bg-white opacity-10 transform skew-y-3"></div>
              
            </div>
          </div>
        </div>
        <button
          onClick={downloadCard}
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white text-blue-500 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-500 hover:text-white"
          title="Download Achievement Card"
          disabled={isDownloading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${isDownloading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;