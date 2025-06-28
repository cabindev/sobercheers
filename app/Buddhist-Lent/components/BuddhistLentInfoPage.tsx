// หน้าให้ความรู้เกี่ยวกับงดเหล้าเข้าพรรษา - Buddhist Lent Information Page
// ใช้งานใน app/info/page.tsx หรือ components/BuddhistLentInfoPage.tsx

'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

interface BenefitSection {
  id: string
  title: string
  content: string
  image: string
  shortDesc: string
}

const BuddhistLentInfoPage: React.FC = () => {
  const [currentBenefit, setCurrentBenefit] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // ข้อมูลประโยชน์ของการงดเหล้าเข้าพรรษา
  const benefits: BenefitSection[] = [
    {
      id: 'meditation',
      title: 'พัฒนาจิตใจด้วยสมาธิ',
      shortDesc: 'จิตใจสงบ มีสติ ควบคุมอารมณ์ได้ดี',
      content: 'การงดเหล้าจะช่วยให้จิตใจสงบ สามารถมีสมาธิในการนั่งสมาธิได้ดีขึ้น ช่วยพัฒนาจิตใจให้เข้มแข็ง มีสติมากขึ้น และสามารถควบคุมอารมณ์ได้ดีกว่าเดิม',
      image: '/element/Artboard 1.png'
    },
    {
      id: 'health',
      title: 'ออกกำลังกายและสุขภาพดี',
      shortDesc: 'ร่างกายแข็งแรง ออกกำลังกายได้ดี',
      content: 'เมื่องดเหล้าแล้วร่างกายจะแข็งแรงขึ้น การออกกำลังกายจะมีประสิทธิภาพมากขึ้น ระบบย่อยอาหารทำงานดีขึ้น น้ำหนักลดลง และพลังงานในการทำกิจกรรมต่างๆ เพิ่มขึ้น',
      image: '/element/Artboard 2.png'
    },
    {
      id: 'family',
      title: 'อยู่กับครอบครัวอย่างมีความสุข',
      shortDesc: 'ความสัมพันธ์ดี เป็นแบบอย่างที่ดี',
      content: 'การงดเหล้าทำให้มีเวลาอยู่กับครอบครัวมากขึ้น สร้างความสัมพันธ์ที่ดีกับคนในครอบครัว ลูกๆ จะมีแบบอย่างที่ดี และครอบครัวจะมีความสุขมากขึ้น',
      image: '/element/Artboard 3.png'
    },
    {
      id: 'sleep',
      title: 'นอนหลับพักผ่อนได้เต็มที่',
      shortDesc: 'นอนหลับลึก ตื่นมาสดชื่น',
      content: 'การงดเหล้าจะช่วยให้นอนหลับได้ลึกและมีคุณภาพมากขึ้น ตื่นมาแล้วจิตใจสดชื่น ร่างกายไม่เมื่อยล้า พร้อมที่จะเริ่มต้นวันใหม่ด้วยพลังงานเต็มเปี่ยม',
      image: '/element/Artboard 4.png'
    }
  ]

  // Auto play functionality
  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentBenefit((prev) => (prev + 1) % benefits.length)
        setIsTransitioning(false)
      }, 300)
    }, 4000) // เปลี่ยนทุก 4 วินาที

    return () => clearInterval(interval)
  }, [isAutoPlay, benefits.length])

  const nextBenefit = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentBenefit((prev) => (prev + 1) % benefits.length)
      setIsTransitioning(false)
    }, 300)
  }

  const prevBenefit = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentBenefit((prev) => (prev - 1 + benefits.length) % benefits.length)
      setIsTransitioning(false)
    }, 300)
  }

  const goToBenefit = (index: number) => {
    if (index === currentBenefit) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentBenefit(index)
      setIsTransitioning(false)
    }, 300)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay)
  }

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-orange-100/30 via-transparent to-yellow-100/30"></div>
      
      {/* Main Benefits Showcase */}
      <section className="relative w-screen h-screen">
        
        {/* Single Benefit Display */}
        <div className="w-screen h-full grid grid-cols-1 lg:grid-cols-2">
          
          {/* Image Section - ด้านซ้าย */}
          <div className="relative w-full h-full bg-gradient-to-br from-amber-100/60 to-stone-100/40 flex items-center justify-center overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-yellow-200/30 rounded-full blur-xl animate-pulse"></div>
            
            <div className={`relative w-full h-full flex items-center justify-center p-8 md:p-12 transition-all duration-700 ${
              isTransitioning ? 'scale-90 opacity-50' : 'scale-100 opacity-100'
            }`}>
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] xl:w-[500px] xl:h-[500px]">
                <Image
                  src={benefits[currentBenefit].image}
                  alt={benefits[currentBenefit].title}
                  fill
                  className="object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Content Section - ด้านขวา */}
          <div className="relative w-full h-full bg-gradient-to-br from-stone-50/80 to-amber-50/60 flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20">
            
            {/* Auto Play Control */}
            <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
              <button
                onClick={toggleAutoPlay}
                className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300 group"
              >
                {isAutoPlay ? (
                  <Pause className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" />
                ) : (
                  <Play className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-stone-200/50">
              <div 
                className={`h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-75 ${
                  isAutoPlay ? 'animate-pulse' : ''
                }`}
                style={{ 
                  width: `${((currentBenefit + 1) / benefits.length) * 100}%`,
                  animation: isAutoPlay ? 'progress 4s linear infinite' : 'none'
                }}
              ></div>
            </div>
            
            {/* Content */}
            <div className={`transition-all duration-700 ${
              isTransitioning ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'
            }`}>
              {/* ประโยชน์ที่ */}
              <div className="mb-4 md:mb-6">
                <span className="inline-block px-4 py-2 bg-orange-100/80 text-orange-600 text-sm md:text-lg font-medium tracking-wider rounded-full">
                  ประโยชน์ที่ {currentBenefit + 1}
                </span>
              </div>
              
              {/* หัวข้อหลัก */}
              <div className="mb-4 md:mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-stone-800 mb-2 leading-tight">
                  {benefits[currentBenefit].title}
                </h2>
                <p className="text-xs md:text-sm text-stone-500 font-light tracking-wide">
                  {currentBenefit === 0 && "Mind Development with Meditation"}
                  {currentBenefit === 1 && "Exercise and Good Health"}
                  {currentBenefit === 2 && "Happy Family Life"}
                  {currentBenefit === 3 && "Quality Sleep and Rest"}
                </p>
              </div>
              
              {/* คำอธิบายสั้น */}
              <p className="text-orange-600 text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 font-medium">
                {benefits[currentBenefit].shortDesc}
              </p>
              
              {/* เนื้อหาเต็ม */}
              <p className="text-stone-700 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl mb-8 md:mb-12 max-w-2xl">
                {benefits[currentBenefit].content}
              </p>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-auto">
              {/* Dots Navigation */}
              <div className="flex space-x-2 md:space-x-3">
                {benefits.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToBenefit(index)}
                    className={`h-3 md:h-4 rounded-full transition-all duration-500 relative overflow-hidden ${
                      currentBenefit === index
                        ? 'bg-orange-500 w-8 md:w-12'
                        : 'bg-stone-300 w-3 md:w-4 hover:bg-orange-300'
                    }`}
                  >
                    {currentBenefit === index && isAutoPlay && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Arrow Navigation */}
              <div className="flex space-x-2 md:space-x-3">
                <button
                  onClick={prevBenefit}
                  className="p-2 md:p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 text-stone-600 hover:text-orange-600 group"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={nextBenefit}
                  className="p-2 md:p-3 rounded-full bg-orange-500/90 hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 text-white group"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
            
          </div>
        </div>
        
      </section>

      {/* Custom CSS Animation */}
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 25%; }
        }
        
        @media (max-width: 1023px) {
          .grid {
            grid-template-rows: 1fr 1fr;
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default BuddhistLentInfoPage