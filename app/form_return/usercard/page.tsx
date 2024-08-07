"use client";
import React, { useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Input, Button, Spin, Card } from 'antd';
import { SearchOutlined, PlusOutlined, UnorderedListOutlined, EditOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import Style1 from './components/style1';
import Style2 from './components/style2';
import Style3 from './components/style3';
import Style4 from './components/style4';
import Style5 from './components/style5';

interface FormReturn {
  id: number;
  firstName: string;
  lastName: string;
  organizationName: string;
  addressLine1: string;
  subDistrict: string;
  district: string;
  province: string;
  zipcode: string;
  phoneNumber: string;
  image1: string | null;
  image2: string | null;
  numberOfSigners: number;
  type: string; // เพิ่มฟิลด์ type
}

interface StyleProps {
  images: string[];
  form: {
    organizationName: string;
    amphoe: string;
    type: string;
  };
}

type DisplayMode = 'style1' | 'style2' | 'style3' | 'style4' | 'style5';

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<FormReturn | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('style1');
  const cardRef = useRef<HTMLDivElement>(null);

  const cleanPhoneNumber = (phone: string): string => {
    return phone.replace(/\D/g, '');
  };

  const fetchUserForm = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const cleanNumber = cleanPhoneNumber(phoneNumber);
      const res = await axios.get<{ forms: FormReturn[] }>(`/api/form_return?phoneNumber=${cleanNumber}&limit=1`);
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


  const renderStyle = (): React.ReactNode => {
    if (!form) return null;
    const images = [form.image1, form.image2].filter(Boolean) as string[];
    const formData: StyleProps['form'] = {
      organizationName: form.organizationName,
      amphoe: form.district, // ใช้ district แทน amphoe
      type: form.type
    };
    const styles: React.FC<StyleProps>[] = [Style1, Style2, Style3, Style4, Style5];
    const SelectedStyle = styles[parseInt(displayMode.slice(-1)) - 1];
    return <SelectedStyle images={images} form={formData} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-amber-500 to-amber-700 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-4 py-16">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">งดเหล้า 3,500 องค์กร</h1>
          <p className="text-xl mb-8">
            ร่วมกันสร้างสังคมที่ดีขึ้นด้วยการงดเหล้าในองค์กรของคุณ
          </p>
          <div className="mb-8">
            <Input
              prefix={<SearchOutlined className="text-amber-600" />}
              placeholder="กรอกหมายเลขโทรศัพท์"
              value={phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
              onPressEnter={fetchUserForm}
              className="w-full max-w-md py-3 px-6 rounded-full text-gray-800 bg-white bg-opacity-90"
            />
          </div>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            loading={isLoading}
            onClick={fetchUserForm}
            className="w-full max-w-md bg-white text-amber-600 hover:bg-gray-100 border-white hover:border-gray-100 mb-4"
          >
            {isLoading ? 'กำลังค้นหา...' : 'ค้นหา'}
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <Spin size="large" />
            <p className="mt-4 text-white">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {form && (
          <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((num) => (
                <Button
                  key={num}
                  type={displayMode === `style${num}` ? 'primary' : 'default'}
                  onClick={() => setDisplayMode(`style${num}` as DisplayMode)}
                  className={`flex items-center justify-center ${
                    displayMode === `style${num}` ? 'bg-amber-600 border-amber-600' : ''
                  }`}
                >
                  Style {num}
                </Button>
              ))}
            </div>
            <div ref={cardRef}>
              {renderStyle()}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <Link href={`/form_return/edit/${form.id}`}>
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  className="border-amber-600 text-amber-600 hover:bg-amber-50"
                >
                  แก้ไขข้อมูล
                </Button>
              </Link>
             
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Link href="/form_return/create" passHref>
            <Button type="primary" icon={<PlusOutlined />} size="large" className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600">
              ส่งข้อมูล
            </Button>
          </Link>
          <Link href="/dashboard/formReturn" passHref>
            <Button icon={<UnorderedListOutlined />} size="large" className="bg-white text-amber-600 hover:bg-gray-100 border-white hover:border-gray-100">
              ดูข้อมูลทั้งหมด
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}