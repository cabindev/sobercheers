"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Input, message, Carousel, Button } from 'antd';
import { FiEdit, FiDownload, FiShare2 } from "react-icons/fi";
import { toPng } from 'html-to-image';
import { SearchOutlined } from '@ant-design/icons';

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
}

const InstagramCard: React.FC<{ form: FormReturn }> = ({ form }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const downloadImages = () => {
    [form.image1, form.image2].filter(Boolean).forEach((img, index) => {
      if (img) {
        const link = document.createElement('a');
        link.href = img;
        link.download = `${form.organizationName}_image_${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const downloadCard = async () => {
    if (cardRef.current) {
      try {
        setIsSharing(true);
        const dataUrl = await toPng(cardRef.current, { 
          quality: 0.95,
          height: cardRef.current.offsetHeight - 48 // Exclude the height of action buttons
        });
        const link = document.createElement('a');
        link.download = `${form.organizationName}_card.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error downloading card:', error);
        message.error('Failed to download card');
      } finally {
        setIsSharing(false);
      }
    }
  };

  return (
    <div ref={cardRef} className="instagram-card">
      <Card
        hoverable
        cover={
          <Carousel autoplay>
            {[form.image1, form.image2].filter(Boolean).map((img, index) => (
              <div key={index} className="carousel-image-container">
                <Image
                  alt={`${form.organizationName} image ${index + 1}`}
                  src={img || '/placeholder.jpg'}
                  layout="fill"
                  objectFit="cover"
                  className="carousel-image"
                />
              </div>
            ))}
          </Carousel>
        }
      >
        <Card.Meta
          title={<div className="text-lg font-bold text-gray-800 text-center">{form.organizationName}</div>}
          description={
            <div className="card-description space-y-1">
              <p className="text-sm text-gray-700"><strong>{form.firstName} {form.lastName}</strong></p>
              <p className="text-xs text-gray-600">{form.addressLine1}, {form.subDistrict}, {form.district}, {form.province} {form.zipcode}</p>
              <p className="text-xs text-gray-600">เบอร์โทร: {form.phoneNumber}</p>
              <p className="text-sm font-semibold">ผู้เข้าร่วม: <span>{form.numberOfSigners.toLocaleString()} คน</span></p>
            </div>
          }
        />
      </Card>
      {!isSharing && (
     <div className="card-actions mt-4 flex items-center space-x-6 px-4">
     <Link href={`/form_return/edit/${form.id}`}>
       <Button 
         type="text" 
         icon={<FiEdit className="text-xl" />} 
         className="p-0 text-slate-800 hover:text-amber-600"
       />
     </Link>
     <Button 
       type="text" 
       icon={<FiDownload className="text-xl" />} 
       onClick={downloadImages} 
       className="p-0 text-slate-800 hover:text-amber-600"
     />
     <Button 
       type="text" 
       icon={<FiShare2 className="text-xl" />} 
       onClick={downloadCard} 
       className="p-0 text-slate-800 hover:text-amber-600"
     />
   </div>

      )}
    </div>
  );
};

const DashboardFormReturn: React.FC = () => {
  const [forms, setForms] = useState<FormReturn[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchForms = async () => {
      setIsLoading(true);
      try {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: rowsPerPage.toString(),
          search,
          sort
        }).toString();
        const res = await axios.get(`/api/form_return?${query}`);
        const data = res.data;
        if (data && Array.isArray(data.forms)) {
          setForms(data.forms);
          setTotalItems(data.totalItems || 0);
        } else {
          console.error('Invalid forms data:', data);
          setForms([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error('Failed to fetch forms', error);
        message.error('Failed to load data');
        setForms([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, [page, rowsPerPage, search, sort]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };

  const totalPages = Math.ceil(totalItems / rowsPerPage);

  return (
    <div className="dashboard-container max-w-6xl mx-auto px-4 py-8">
      <div className="hero bg-gradient-to-r from-amber-500 to-amber-700 text-white py-10 mb-8 rounded-lg shadow-lg relative overflow-hidden">
        <div className="relative z-10 hero-content text-center">
          <h1 className="text-4xl font-bold drop-shadow-lg">
            ส่งข้อมูล : งดเหล้า 3,500 องค์กร
          </h1>
          <p className="mt-4 text-lg">
            ร่วมกันสร้างสังคมที่ดีขึ้นด้วยการงดเหล้าในองค์กรของคุณ
          </p>
        </div>
      </div>
      
      <div className="search-container mb-10 max-w-2xl mx-auto">
        <Input
          placeholder="ค้นหาองค์กร หรือชื่อ..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input text-lg py-3 px-6 rounded-full shadow-md transition-all duration-300 hover:shadow-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          suffix={<SearchOutlined className="search-icon text-amber-500 text-xl" />}
        />
      </div>

      {isLoading ? (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
          <p className="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      ) : forms.length > 0 ? (
        <div className="cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <InstagramCard key={form.id} form={form} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">ไม่พบข้อมูล</div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-center mt-10 space-y-4 sm:space-y-0">
        <div className="flex items-center">
          <span className="mr-2">แสดง:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(parseInt(e.target.value))}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="ml-2">รายการ</span>
        </div>
        {totalItems > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {`${page * rowsPerPage - rowsPerPage + 1}-${Math.min(page * rowsPerPage, totalItems)} จาก ${totalItems}`}
            </span>
            <div className="flex space-x-1">
              <Button
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || isLoading}
                className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
              >
                Previous
              </Button>
              <span className="px-4 py-2 border rounded-md text-sm bg-amber-100 text-amber-800">
                {page} of {totalPages}
              </span>
              <Button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || isLoading}
                className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardFormReturn;