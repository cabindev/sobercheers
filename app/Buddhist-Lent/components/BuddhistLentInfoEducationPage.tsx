// หน้าให้ความรู้และข้อมูลเกี่ยวกับงดเหล้าเข้าพรรษา - Buddhist Lent Information Education Page
// ใช้งานใน app/Buddhist2025/components/BuddhistLentInfoEducationPage.tsx

'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Phone } from 'lucide-react'

interface BookResource {
  id: string
  title: string
  image: string
  url: string
  description: string
}

const BuddhistLentInfoEducationPage: React.FC = () => {
  // ทรัพยากรหนังสือและข้อมูล
  const bookResources: BookResource[] = [
    {
      id: 'book1',
      title: 'เตรียมความพร้อมก่อนงดเหล้าเข้าพรรษา',
      image: '/element/book1.png',
      url: 'https://ebook.sdnthailand.com/books/130643e6-ad18-48ec-823e-ddc3b7a8d449',
      description: 'คู่มือสำหรับการเตรียมตัวก่อนเริ่มงดเหล้าในช่วงเข้าพรรษา'
    },
    {
      id: 'book2',
      title: 'คำแนะนำการรักษาภาวะถอนแอลกอฮอล์สำหรับแพทย์ พยาบาล',
      image: '/element/book2.jpg',
      url: 'https://ebook.sdnthailand.com/books/5b3671d2-fc0d-468a-b2e5-1c4392bf301e',
      description: 'แนวทางการรักษาและดูแลผู้ป่วยที่มีอาการถอนแอลกอฮอล์'
    },
    {
      id: 'book3',
      title: 'แนวปฏิบัติ การดูแลผู้ป่วยภาวะขาดสุรา สำหรับทีมสหวิชาชีพ',
      image: '/element/book3.png',
      url: 'https://ebook.sdnthailand.com/books/566e891d-523d-4a9d-ba12-a4933bae91d9',
      description: 'คู่มือสำหรับทีมแพทย์และพยาบาลในการดูแลผู้ป่วยภาวะขาดสุรา'
    }
  ]

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/40">
      
      {/* Header Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-8 lg:px-12">
          
          <div className="text-center mb-16">
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-800 mb-4">
              ชุดความรู้เตรียมตัวงดเหล้าเข้าพรรษา
            </h1>
            <p className="text-lg text-stone-600 font-light">
              แหล่งความรู้สำหรับการเตรียมตัวและดูแลสุขภาพ
            </p>
            <div className="w-16 h-px bg-stone-300 mx-auto mt-6"></div>
          </div>

          {/* Books Resources Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {bookResources.map((book) => (
              <div key={book.id} className="group">
          <div className="overflow-hidden transition-all duration-300">
            
            {/* Book Cover */}
            <div className="relative h-60 lg:h-72 flex items-center justify-center p-4 mb-4">
              <div className="relative w-36 h-48 lg:w-40 lg:h-56">
                <Image
            src={book.image}
            alt={book.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="px-2">
              <h3 className="text-lg font-medium text-stone-800 mb-3 leading-tight">
                {book.title}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                {book.description}
              </p>
              
              <Link
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors duration-300"
              >
                อ่านเพิ่มเติม
                <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </div>

          </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Emergency Hotline Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-red-50/50 to-orange-50/50">
        <div className="container mx-auto px-8 lg:px-12">
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-ินสก text-stone-800 mb-4">
                ต้องการความช่วยเหลือ?
              </h2>
              <p className="text-base text-stone-600">
                สายด่วนให้คำปรึกษาและช่วยเหลือ
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* Hotline Info */}
              <div className="text-center lg:text-left">
                <div className="relative w-24 h-24 lg:w-32 lg:h-32 mx-auto lg:mx-0 mb-6">
                  <Image
                    src="/1413.png"
                    alt="1413 Hotline Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                
                <h3 className="text-xl lg:text-2xl font-medium text-stone-800 mb-3">
                  สายด่วนเลิกเหล้า 1413
                </h3>
                <p className="text-stone-600 text-base leading-relaxed">
                  บริการให้คำปรึกษาและช่วยเหลือผู้ที่ต้องการเลิกดื่มแอลกอฮอล์ 
                  โดยทีมผู้เชี่ยวชาญ ตลอด 24 ชั่วโมง
                </p>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <div className="">
                  
                  <div className="text-3xl lg:text-4xl font-bold text-red-600 mb-4">
                    1413
                  </div>
                  
                  <p className="text-stone-700 text-sm mb-6">
                    โทรฟรีจากทุกเครือข่าย<br />
                    บริการตลอด 24 ชั่วโมง
                  </p>
                  
                  <div className="space-y-3">
                    <Link
                      href="tel:1413"
                      className="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 font-medium hover:shadow-lg"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      โทร 1413
                    </Link>
                    
                    <div className="block">
                      <Link
                        href="https://www.1413.in.th/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-300"
                      >
                        เยี่ยมชมเว็บไซต์
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                  
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  )
}

export default BuddhistLentInfoEducationPage