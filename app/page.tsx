'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Home() {
 const router = useRouter();

 return (
  <div className="min-h-screen bg-gradient-to-b from-white via-orange-25 to-orange-50">
    {/* Header Section */}
    <header className="relative overflow-hidden">
     {/* Logo */}
     <div className="relative z-20 bg-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-center space-x-3">
        <div className="w-12 h-12 rounded-full overflow-hidden">
         <img
          src="/x-right.png"
          alt="Buddhist Lent"
          className="w-full h-full object-cover"
         />
        </div>
        <span className="text-2xl font-bold text-orange-900">Buddhist Lent 2025</span>
      </div>
     </div>

     {/* Background Pattern */}
     <div className="absolute inset-0">
      <div className="absolute top-20 right-10 w-32 h-32 bg-orange-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-amber-200/40 rounded-full blur-lg"></div>
     </div>

     {/* Navigation */}
     <nav className="relative z-10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
      </div>
     </nav>
    </header>

    {/* Hero Section */}
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
     <div className="text-center space-y-8">
      {/* Badge */}
      <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
        งดเหล้าเข้าพรรษา พุทธศักราช 2568
      </div>

      {/* Main Heading */}
      <div className="space-y-4">
        <h1 className="text-6xl md:text-7xl font-bold text-orange-900 leading-tight">
         งดเหล้า เข้าพรรษา
        </h1>
        <h2 className="text-2xl md:text-3xl font-medium text-orange-700">
         มีสติ มีสุข ทุกโอกาส
        </h2>
      </div>

      {/* Description */}
      <p className="text-lg text-orange-600 max-w-2xl mx-auto leading-relaxed">
        ร่วมงดเหล้าเข้าพรรษา เริ่มต้นการเปลี่ยนแปลงไปพร้อมกัน
      </p>

      {/* CTA */}
      <div className="pt-4">
        <button
         onClick={() => router.push("/Buddhist2025/create/")}
         className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
         ลงทะเบียนเข้าร่วม
         <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
     </div>
    </div>

    {/* Remaining Sections */}
    {/* (Keep the rest of the sections as they are) */}
  </div>
 );
}
