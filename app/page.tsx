'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row items-center">
        <div className="group relative overflow-hidden">
          <div className="relative transition-transform duration-500 transform group-hover:scale-105">
            <Image
              src="/card.svg"
              alt="card.svg"
              width={300}
              height={300}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
        <div className="ml-0 lg:ml-10 mt-2 lg:mt-0 text-center lg:text-left">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-amber-500 to-amber-600 text-transparent bg-clip-text">SOBER CHEERs</h1>
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text mt-2">ชวนช่วย ชมเชียร์ เชิดชู</h1>
        <h4 className="text-3xl font-bold text-center  mt-2">ชุมชนคนสู้เหล้า</h4>
          <p className="py-6">
            เริ่มต้นงดเหล้าเข้าพรรษา และ ฤดูกาลสุขปลอดเหล้า
          </p>
          <div className="flex flex-col lg:flex-row gap-4">
            <button
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => router.push('/auth/form_signup')}
            >
              ลงทะเบียน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
