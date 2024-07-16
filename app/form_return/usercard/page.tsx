"use client";
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaImages, FaDownload } from 'react-icons/fa';
import * as htmlToImage from 'html-to-image';
import Style1 from './styles/style1';
import Style2 from './styles/style2';
import Style3 from './styles/style3';
import Style4 from './styles/style4';
import Style5 from './styles/style5';

interface FormReturn {
  organizationName: string;
  image1: string | null;
  image2: string | null;
  amphoe: string;
  type: string;
}

type DisplayMode = 'style1' | 'style2' | 'style3' | 'style4' | 'style5';

export default function UserCard() {
  const [form, setForm] = useState<FormReturn | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('style1');
  const [phoneNumber, setPhoneNumber] = useState<string>(''); // เพิ่ม state สำหรับเก็บหมายเลขโทรศัพท์
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const cleanPhoneNumber = (phone: string) => {
    return phone.replace(/-/g, ''); // ลบเครื่องหมายขีดออก
  };

  const fetchUserForm = async () => {
    try {
      const cleanNumber = cleanPhoneNumber(phoneNumber); // ทำความสะอาดหมายเลขโทรศัพท์
      const res = await axios.get(`/api/form_return?phoneNumber=${cleanNumber}&limit=1`);
      const data = res.data.forms[0]; 
      if (data) {
        setForm(data);
      } else {
        console.error('Invalid form data:', data);
      }
    } catch (error) {
      console.error('Failed to fetch form', error);
    }
  };

  const handleSearchClick = () => {
    fetchUserForm();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchUserForm();
    }
  };

  const downloadCard = () => {
    if (cardRef.current) {
      htmlToImage.toPng(cardRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'card.png';
          link.click();
        })
        .catch((error) => {
          console.error('Failed to download image', error);
        });
    }
  };

  const renderStyle = () => {
    if (!form) return null; // เพิ่มการตรวจสอบเพื่อหลีกเลี่ยงข้อผิดพลาด
    const images = [form.image1, form.image2].filter(Boolean) as string[];
    switch (displayMode) {
      case 'style1':
        return <Style1 images={images} form={form} />;
      case 'style2':
        return <Style2 images={images} form={form} />;
      case 'style3':
        return <Style3 images={images} form={form} />;
      case 'style4':
        return <Style4 images={images} form={form} />;
      case 'style5':
        return <Style5 images={images} form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-center">ข้อมูลการส่งฟอร์ม</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          onKeyPress={handleKeyPress} // เพิ่มการตรวจจับการกดปุ่ม Enter
          className="p-2 border rounded-md w-full"
        />
        <button
          onClick={handleSearchClick}
          className="mt-2 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
        >
          Search
        </button>
      </div>
      {form ? (
        <>
          <div className="flex justify-center space-x-2 mb-4">
            <button
              className={`p-2 ${displayMode === 'style1' ? 'bg-slate-500 text-white' : ''} hover:bg-slate-600`}
              onClick={() => setDisplayMode('style1')}
              title="Style 1"
            >
              <FaImages />
            </button>
            <button
              className={`p-2 ${displayMode === 'style2' ? 'bg-slate-500 text-white' : ''} hover:bg-slate-600`}
              onClick={() => setDisplayMode('style2')}
              title="Style 2"
            >
              <FaImages />
            </button>
            <button
              className={`p-2 ${displayMode === 'style3' ? 'bg-slate-500 text-white' : ''} hover:bg-slate-600`}
              onClick={() => setDisplayMode('style3')}
              title="Style 3"
            >
              <FaImages />
            </button>
            <button
              className={`p-2 ${displayMode === 'style4' ? 'bg-slate-500 text-white' : ''} hover:bg-slate-600`}
              onClick={() => setDisplayMode('style4')}
              title="Style 4"
            >
              <FaImages />
            </button>
            <button
              className={`p-2 ${displayMode === 'style5' ? 'bg-slate-500 text-white' : ''} hover:bg-slate-600`}
              onClick={() => setDisplayMode('style5')}
              title="Style 5"
            >
              <FaImages />
            </button>
          </div>
          <div ref={cardRef}>
            {renderStyle()}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={downloadCard}
              className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors flex items-center space-x-2"
            >
              <FaDownload />
              <span>Download Card</span>
            </button>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
