'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 via-green-200 to-yellow-200 flex flex-col justify-between">
      <div className="flex-grow flex flex-col items-center justify-center py-8 px-4">
        <div className="mb-8">
          <Image
            src="/sober.png"
            alt="Sober Logo"
            width={350}
            height={350}
            className="rounded-full shadow-lg"
          />
        </div>
        
        <div className="text-center max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text">
              CHANCE
            </span>
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
              งดเหล้า 3 เดือน
            </span>
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
              เปลี่ยนคุณเป็นคนใหม่ใน 90 วัน
            </span>
          </h3>
          <p className="text-xl mb-8 text-gray-700">
            เริ่มต้นงดเหล้าเข้าพรรษา และ ฤดูกาลสุขปลอดเหล้า
          </p>
          <button
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 text-lg shadow-lg"
            onClick={() => router.push('/auth/form_signup')}
          >
            ลงทะเบียน
          </button>
        </div>
      </div>

      <div className="text-center text-gray-600 text-sm py-4">
        © 2024 SOBER CHEERs. All rights reserved.
      </div>
    </div>
  );
}