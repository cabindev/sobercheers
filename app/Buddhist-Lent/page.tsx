import React from 'react';
import BuddhistProjectIntroPage from './components/BuddhistProjectIntroPage';
import BuddhistLentInfoPage from './components/BuddhistLentInfoPage';
import BuddhistLentInfoEducationPage from './components/BuddhistLentInfoEducationPage';

export default function Buddhist2025Page() {
  return (
    <div className="w-full min-h-screen">
      {/* หน้าแนะนำโครงการ */}
      <BuddhistProjectIntroPage />
      
      {/* หน้าแสดงประโยชน์ของการงดเหล้าเข้าพรรษา (ขนาดเล็ก) */}
      <BuddhistLentInfoPage />
      
      {/* หน้าให้ความรู้และทรัพยากร */}
      <BuddhistLentInfoEducationPage />
    </div>
  );
}