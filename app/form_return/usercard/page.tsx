"use client";
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { PictureOutlined, DownloadOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import { Input, Button, Spin } from 'antd';
import * as htmlToImage from 'html-to-image';
import Style1 from './styles/style1';
import Style2 from './styles/style2';
import Style3 from './styles/style3';
import Style4 from './styles/style4';
import Style5 from './styles/style5';
import toast from 'react-hot-toast';

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
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const cleanPhoneNumber = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const fetchUserForm = async () => {
    setIsLoading(true);
    try {
      const cleanNumber = cleanPhoneNumber(phoneNumber);
      const res = await axios.get(`/api/form_return?phoneNumber=${cleanNumber}&limit=1`);
      const data = res.data.forms[0];
      if (data) {
        setForm(data);
        toast.success('ค้นหาข้อมูลสำเร็จ');
      } else {
        console.error('Invalid form data:', data);
        toast.error('ไม่พบข้อมูล กรุณาตรวจสอบหมายเลขโทรศัพท์');
      }
    } catch (error) {
      console.error('Failed to fetch form', error);
      toast.error('เกิดข้อผิดพลาดในการค้นหาข้อมูล');
    } finally {
      setIsLoading(false);
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
          toast.success('ดาวน์โหลดการ์ดสำเร็จ');
        })
        .catch((error) => {
          console.error('Failed to download image', error);
          toast.error('ไม่สามารถดาวน์โหลดภาพได้');
        });
    }
  };

  const renderStyle = () => {
    if (!form) return null;
    const images = [form.image1, form.image2].filter(Boolean) as string[];
    const styles = [Style1, Style2, Style3, Style4, Style5];
    const SelectedStyle = styles[parseInt(displayMode.slice(-1)) - 1];
    return <SelectedStyle images={images} form={form} />;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-amber-600">ข้อมูลการส่งฟอร์ม</h1>
      <div className="mb-6">
        <Input
          prefix={<SearchOutlined className="text-amber-600" />}
          placeholder="กรอกหมายเลขโทรศัพท์"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          onPressEnter={fetchUserForm}
          className="mb-4"
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          loading={isLoading}
          onClick={fetchUserForm}
          className="w-full bg-amber-600 hover:bg-amber-700 border-amber-600 hover:border-amber-700"
        >
          {isLoading ? 'กำลังค้นหา...' : 'ค้นหา'}
        </Button>
      </div>
      {form && (
        <div className="mb-6">
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <Button
                key={num}
                type={displayMode === `style${num}` ? 'primary' : 'default'}
                icon={<PictureOutlined />}
                onClick={() => setDisplayMode(`style${num}` as DisplayMode)}
                className={`flex items-center justify-center ${
                  displayMode === `style${num}` ? 'bg-amber-600 border-amber-600' : ''
                }`}
              />
            ))}
          </div>
          <div ref={cardRef} className="mb-6">
            {renderStyle()}
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={downloadCard}
              className="bg-amber-600 hover:bg-amber-700 border-amber-600 hover:border-amber-700"
            >
              ดาวน์โหลดการ์ด
            </Button>
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => {/* เพิ่มฟังก์ชันแก้ไขที่นี่ */}}
              className="border-amber-600 text-amber-600 hover:bg-amber-50"
            >
              แก้ไขข้อมูล
            </Button>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="text-center py-12">
          <Spin size="large" />
          <p className="mt-4 text-amber-600">กำลังโหลดข้อมูล...</p>
        </div>
      )}
    </div>
  );
}