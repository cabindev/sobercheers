'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
 const router = useRouter();

 return (
   <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 flex flex-col justify-between relative overflow-hidden">
     {/* Background Pattern */}
     <div className="absolute inset-0 opacity-5">
       <div className="absolute top-10 left-10 w-20 h-20 bg-orange-300 rounded-full"></div>
       <div className="absolute top-32 right-20 w-16 h-16 bg-amber-400 rounded-full"></div>
       <div className="absolute bottom-40 left-16 w-12 h-12 bg-yellow-400 rounded-full"></div>
       <div className="absolute bottom-20 right-32 w-24 h-24 bg-orange-200 rounded-full"></div>
     </div>

     <div className="flex-grow flex flex-col lg:flex-row items-center justify-center py-8 px-4 relative z-10">
       {/* Image Section */}
       <div className="lg:w-1/2 flex justify-center mb-8 lg:mb-0">
         <div className="relative">
           <div className="absolute -inset-6 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl blur opacity-20 animate-pulse"></div>
           <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
             <Image
               src="/x-right.png"
               alt="งดเหล้าเข้าพรรษา"
               width={350}
               height={350}
               className="w-full h-auto"
               priority
             />
           </div>
         </div>
       </div>
       
       {/* Content Section */}
       <div className="lg:w-1/2 text-center lg:text-left max-w-2xl">
         <div className="mb-6">
           <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
             <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-transparent bg-clip-text">
               งดเหล้า
             </span>
           </h1>
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
             <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text">
               เข้าพรรษา
             </span>
           </h2>
           <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
             <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-transparent bg-clip-text">
               มีสติ มีสุข ทุกโอกาส
             </span>
           </h3>
         </div>

         <div className="space-y-4 mb-8">
           <p className="text-xl md:text-2xl text-gray-700 font-medium">
             🙏 เริ่มต้นชีวิตใหม่ด้วยใจที่สงบ
           </p>
           <p className="text-lg md:text-xl text-gray-600">
             ✨ ปล่อยวางสิ่งเสพติด สร้างคุณค่าให้ชีวิต
           </p>
           <p className="text-lg md:text-xl text-gray-600">
             🌟 3 เดือนที่จะเปลี่ยนแปลงคุณไปตลอดกาล
           </p>
         </div>

         <div className="flex justify-center lg:justify-start">
           <button
             className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 text-lg shadow-xl"
             onClick={() => router.push('/auth/form_signup')}
           >
             🚀 เริ่มต้นเลย
           </button>
         </div>

         {/* Stats or Features */}
         <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
             <div className="text-2xl font-bold text-orange-600">90</div>
             <div className="text-sm text-gray-600">วันเปลี่ยนแปลง</div>
           </div>
           <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
             <div className="text-2xl font-bold text-amber-600">100%</div>
             <div className="text-sm text-gray-600">ธรรมชาติ</div>
           </div>
           <div className="text-center p-4 bg-white/50 rounded-xl backdrop-blur-sm">
             <div className="text-2xl font-bold text-yellow-600">∞</div>
             <div className="text-sm text-gray-600">คุณค่าชีวิต</div>
           </div>
         </div>
       </div>
     </div>

     {/* Footer */}
     <footer className="relative z-10 text-center text-gray-600 text-sm py-6 bg-white/30 backdrop-blur-sm">
       <div className="flex items-center justify-center gap-2 mb-2">
         <span className="text-orange-500">🙏</span>
         <span>© 2025 งดเหล้าเข้าพรรษา - เปลี่ยนแปลงเพื่อชีวิตที่ดีกว่า</span>
         <span className="text-orange-500">🙏</span>
       </div>
       <p className="text-xs text-gray-500">
         เริ่มต้นการเดินทางสู่ชีวิตที่มีคุณค่ามากขึ้น
       </p>
     </footer>
   </div>
 );
}