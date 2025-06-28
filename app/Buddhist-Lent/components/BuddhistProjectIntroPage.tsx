// หน้าแนะนำโครงการงดเหล้าเข้าพรรษา - Buddhist Project Introduction Page (Enhanced Version)
// ใช้งานใน app/Buddhist2025/components/BuddhistProjectIntroPage.tsx
// ปรับปรุงให้น่าสนใจยิ่งขึ้น พร้อมเอฟเฟกต์และการออกแบบที่ทันสมัย

'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Users, Award, Heart, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'

const BuddhistProjectIntroPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-100/40 to-orange-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-stone-100/40 to-amber-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-20 opacity-20">
        <Sparkles className="w-8 h-8 text-amber-400 animate-bounce" />
      </div>
      <div className="absolute bottom-40 left-20 opacity-20">
        <Sparkles className="w-6 h-6 text-orange-400 animate-bounce delay-500" />
      </div>

      {/* Main Content */}
      <section className="relative z-10 flex items-center justify-center min-h-screen py-20">
        <div className="container mx-auto px-8 lg:px-12 max-w-7xl">
          
          {/* Header Section */}
          <div className={`text-center mb-10 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            
            {/* Logo with Glow Effect */}
            <div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-10">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-full h-full">
                <Image
                  src="/Buddhist-lent.png"
                  alt="Buddhist Lent Project Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
            
            {/* Project Title with Gradient */}
            <h4 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-stone-800 via-stone-700 to-amber-700 bg-clip-text text-transparent mb-4 tracking-wide leading-tight">
              โครงการฤดูกาลฝึกสติและรณรงค์งดเหล้าเข้าพรรษา
            </h4>
            <p className="text-xl lg:text-2xl text-orange-600 font-medium mb-8 relative">
              ภายใต้แนวคิด "มีสติ มีสุข ทุกโอกาส"
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></span>
            </p>
            
            {/* Inspirational Quote */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <p className="text-xl lg:text-2xl leading-relaxed text-stone-700 mb-4 font-light italic">
                  "เสียงระฆังแห่งการเตือนตัวเอง ได้เวลาฝึกสติ และงดเหล้าเข้าพรรษาแล้ว!"
                </p>
                <p className="text-base text-stone-600 font-light">
                  ร่วมเป็นส่วนหนึ่งของการสร้างสังคมที่มีสุขภาพดี และค่านิยมที่ดีงาม
                </p>
              </div>
            </div>
          </div>



            {/* Call to Action */}
            <div className={`text-center transition-all duration-1000 delay-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-8">
              ร่วมเป็นส่วนหนึ่งของโครงการ
              </h2>
              <p className="text-lg text-stone-600 mb-10 font-light leading-relaxed">
              เริ่มต้นการเปลี่ยนแปลงที่ดีในชีวิตของคุณ เพื่อสุขภาพกายและใจที่แข็งแรง
              </p>
              
              <div className="relative inline-block group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 rounded-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <a
                href="https://noalcohol.ddc.moph.go.th/"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-400 hover:to-amber-400 text-white font-semibold py-4 px-10 rounded-2xl transition-all duration-300 hover:scale-105 group shadow-lg"
                >
                <span className="mr-3">เข้าร่วมโครงการ</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
              
              <p className="text-sm text-stone-500 mt-6">
              * คลิกเพื่อไปยังเว็บไซต์หลักของโครงการ
              </p>
            </div>
            </div>
          {/* Organization Info */}

          <div className={`mb-20 transition-all duration-1000 delay-700 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* หน่วยงานหลัก */}
                <div className="text-center lg:text-left">
                  <div className="w-8 h-8 flex items-center justify-center mx-auto lg:mx-0 mb-2">
                    <Users className="w-5 h-5 text-stone-400" />
                  </div>
                  <h4 className="font-semibold text-base text-stone-700 mb-1">หน่วยงานหลัก</h4>
                  <p className="text-stone-500 font-light mb-1 text-sm">สำนักงานเครือข่ายองค์กรงดเหล้า (สคล.)</p>
                  <p className="text-stone-400 font-light text-xs">ภายใต้การสนับสนุน สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.)</p>
                </div>
                {/* ผู้รับผิดชอบโครงการ */}
                <div className="text-center lg:text-right">
                  <div className="w-8 h-8 flex items-center justify-center mx-auto lg:ml-auto lg:mr-0 mb-2">
                    <Award className="w-5 h-5 text-stone-400" />
                  </div>
                  <h4 className="font-semibold text-base text-stone-700 mb-1">ผู้รับผิดชอบโครงการ</h4>
                  <p className="text-stone-500 font-light mb-1 text-sm">นายธีระ วัชรปราณี</p>
                  <p className="text-stone-400 font-light mb-1 text-xs">ผู้อำนวยการสำนักงานเครือข่ายองค์กรงดเหล้า (สคล.)</p>
                  <p className="text-stone-300 text-xs italic">Director Teera Wacharapranee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default BuddhistProjectIntroPage
