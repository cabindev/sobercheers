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
     <div className="relative overflow-hidden">
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
     </div>

     {/* Image Section */}
     <div className="relative py-16">
       <div className="max-w-4xl mx-auto px-6">
         <div className="relative">
           {/* Background Circle */}
           <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full scale-110 opacity-50"></div>

           {/* Image Container */}
           <div className="relative bg-white rounded-full p-8 shadow-2xl mx-auto w-fit">
             <div className="w-80 h-80 md:w-96 md:h-96 relative rounded-full overflow-hidden">
               <Image
                 src="/x-right.png"
                 alt="งดเหล้าเข้าพรรษา"
                 width={400}
                 height={400}
                 className="w-full h-full object-cover"
                 priority
               />
             </div>
           </div>
         </div>
       </div>
     </div>

     {/* Values Section */}
     <div className="py-20 bg-white">
       <div className="max-w-6xl mx-auto px-6">
         <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-bold text-orange-900 mb-4">
             เพื่อสิ่งที่มีคุณค่า
           </h2>
           <p className="text-orange-600 text-lg">
             งดเหล้าเข้าพรรษา เพื่อสร้างคุณค่าให้ชีวิต
           </p>
         </div>

         <div className="grid md:grid-cols-3 gap-12">
           <div className="text-center space-y-4">
             <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full mx-auto flex items-center justify-center">
               <div className="w-8 h-8 bg-white rounded-full"></div>
             </div>
             <h3 className="text-xl font-bold text-orange-900">เพื่อสุขภาพ</h3>
             <p className="text-orange-600">
               ร่างกายแข็งแรง จิตใจแจ่มใส ปราศจากสารเสพติด
             </p>
           </div>

           <div className="text-center space-y-4">
             <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mx-auto flex items-center justify-center">
               <div className="w-8 h-8 bg-white rounded-full"></div>
             </div>
             <h3 className="text-xl font-bold text-orange-900">
               เพื่อครอบครัว
             </h3>
             <p className="text-orange-600">
               ความสุขและความอบอุ่นของคนที่เรารัก
             </p>
           </div>

           <div className="text-center space-y-4">
             <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full mx-auto flex items-center justify-center">
               <div className="w-8 h-8 bg-white rounded-full"></div>
             </div>
             <h3 className="text-xl font-bold text-orange-900">เพื่อธรรม</h3>
             <p className="text-orange-600">
               สร้างบุญกุศล ปฏิบัติธรรม ในช่วงเข้าพรรษา
             </p>
           </div>
         </div>
       </div>
     </div>

     {/* Stats Section */}
     <div className="py-16 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
       <div className="max-w-6xl mx-auto px-6">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           <div className="text-center">
             <div className="text-4xl font-bold mb-2">3</div>
             <div className="text-orange-100">เดือนพรรษา</div>
           </div>
           <div className="text-center">
             <div className="text-4xl font-bold mb-2">90</div>
             <div className="text-orange-100">วันเปลี่ยนแปลง</div>
           </div>
           <div className="text-center">
             <div className="text-4xl font-bold mb-2">100%</div>
             <div className="text-orange-100">ธรรมชาติ</div>
           </div>
           <div className="text-center">
             <div className="text-4xl font-bold mb-2">∞</div>
             <div className="text-orange-100">คุณค่า</div>
           </div>
         </div>
       </div>
     </div>

     {/* Call to Action */}
     <div className="py-20 bg-orange-50">
       <div className="max-w-4xl mx-auto px-6 text-center">
         <h2 className="text-3xl md:text-4xl font-bold text-orange-900 mb-6">
           เริ่มต้นการเปลี่ยนแปลงวันนี้
         </h2>
         <p className="text-lg text-orange-600 mb-8">
           ร่วมเป็นส่วนหนึ่งของการงดเหล้าเข้าพรรษา เพื่อชีวิตที่ดีกว่า
         </p>
         <button
           onClick={() => router.push("/auth/form_signup")}
           className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
         >
           เข้าร่วมเลย
         </button>
       </div>
     </div>

     {/* Footer */}
     <footer className="bg-orange-900 text-white py-12">
       <div className="max-w-6xl mx-auto px-6 text-center">
         <div className="flex items-center justify-center space-x-3 mb-6">
           <div className="w-10 h-10 rounded-full overflow-hidden">
             <img
               src="/x-right.png"
               alt="Buddhist Lent"
               className="w-full h-full object-cover"
             />
           </div>
           <span className="text-xl font-bold">Buddhist Lent 2025</span>
         </div>

         <p className="text-orange-200 mb-4">
           งดเหล้าเข้าพรรษา พุทธศักราช 2568
         </p>

         <p className="text-sm text-orange-300">มีสติ มีสุข ทุกโอกาส</p>
       </div>
     </footer>
   </div>
 );
}