// app/dashboard/Buddhist2025/components/ui/DashboardLoading.tsx
'use client'
import React from 'react';

const DashboardLoading: React.FC = () => {
 return (
   <div className="min-h-screen ">
     <div className="flex flex-col justify-center items-center h-screen">
       {/* Modern Loading Animation */}
       <div className="relative">
         {/* Main spinner */}
         <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
         
         {/* Inner pulse circle */}
         <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-orange-400 rounded-full animate-spin opacity-60" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
         
         {/* Center dot */}
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
       </div>

       {/* Loading bars animation */}
       <div className="flex space-x-1 mt-8">
         <div className="w-2 h-8 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
         <div className="w-2 h-8 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
         <div className="w-2 h-8 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
         <div className="w-2 h-8 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>
       </div>

       {/* Text */}
       <div className="mt-8 text-center">
         <h3 className="text-xl font-bold text-orange-700 mb-2 animate-pulse">
           🙏 Buddhist Lent 2025
         </h3>
         <p className="text-orange-600 text-lg font-medium mb-1">กำลังโหลด Dashboard</p>
         <p className="text-orange-500 text-sm">กรุณารอสักครู่...</p>
       </div>

       {/* Progress dots */}
       <div className="flex space-x-2 mt-6">
         <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
         <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
         <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
       </div>

       {/* Floating particles */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-300 rounded-full animate-ping opacity-40" style={{ animationDelay: '2s' }}></div>
         <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-amber-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '3s' }}></div>
         <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping opacity-35" style={{ animationDelay: '1s' }}></div>
         <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-25" style={{ animationDelay: '4s' }}></div>
       </div>
     </div>
   </div>
 );
};

export default DashboardLoading;