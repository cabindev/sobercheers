"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Card, Input, message, Carousel, Button, Modal } from 'antd';
import { FiEdit, FiDownload, FiShare2 } from "react-icons/fi";
import { toPng } from 'html-to-image';
import { SearchOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';

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

const CustomPrevArrow = (props: any) => (
  <div className="custom-arrow prev" onClick={props.onClick}>
    <LeftOutlined />
  </div>
);

const CustomNextArrow = (props: any) => (
  <div className="custom-arrow next" onClick={props.onClick}>
    <RightOutlined />
  </div>
);

const InstagramCard: React.FC<{ form: FormReturn }> = ({ form }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const showPreview = (index: number) => {
    setCurrentImageIndex(index);
    setIsPreviewVisible(true);
  };

  const handlePreviewClose = () => {
    setIsPreviewVisible(false);
  };

  const images = [form.image1, form.image2].filter(Boolean);

  return (
    <div ref={cardRef} className="instagram-card">
      <Card
        hoverable
        cover={
          <Carousel autoplay>
            {images.map((img, index) => (
              <div key={index} className="carousel-image-container">
                <img
                  alt={`${form.organizationName} image ${index + 1}`}
                  src={img || "/placeholder.jpg"}
                  className="carousel-image w-full h-full object-cover cursor-pointer"
                  onClick={() => showPreview(index)}
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
      
      <Modal
        visible={isPreviewVisible}
        footer={null}
        onCancel={handlePreviewClose}
        width="80%"
        bodyStyle={{ padding: 0 }}
      >
        <Carousel
          initialSlide={currentImageIndex}
          dots={false}
          arrows={true}
          prevArrow={<CustomPrevArrow />}
          nextArrow={<CustomNextArrow />}
        >
          {images.map((img, index) => (
            <div key={index} className="preview-image-container">
              <img
                src={img || "/placeholder.jpg"}
                alt={`Preview ${index + 1}`}
                className="w-full h-auto object-contain"
              />
            </div>
          ))}
        </Carousel>
      </Modal>
    </div>
  );
};

const DashboardFormReturn: React.FC = () => {
  const [forms, setForms] = useState<FormReturn[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/form_return', {
        params: { page, limit, search }
      });
      const { forms, totalItems } = res.data;
      setForms(forms);
      setTotalItems(totalItems);
    } catch (error) {
      console.error('Failed to fetch forms', error);
      message.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [page, limit, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="dashboard-container max-w-6xl mx-auto px-4 py-8">
      <div className="relative mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-200 via-green-200 to-yellow-200 opacity-90"></div>
        <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate drop-shadow-lg mb-4">
              งดเหล้า 3,500 องค์กร
            </h1>
            <p className="text-lg text-slate mb-6">
              ร่วมสร้างสังคมที่ดีขึ้นด้วยการงดเหล้าในองค์กรของคุณ
            </p>
            <div className="search-container max-w-xl mx-auto mb-4">
              <Input
                placeholder="ค้นหาองค์กร หรือชื่อ..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input text-base py-2 px-4 rounded-full shadow-md transition-all duration-300 hover:shadow-lg focus:ring-2 focus:ring-white focus:outline-none text-gray-800 bg-white bg-opacity-90"
                suffix={
                  <SearchOutlined className="search-icon text-gray-500" />
                }
              />
            </div>
          </div>
          <div className="absolute bottom-2 right-4">
            <Link
              href="/form_return/usercard/"
              className="text-slate text-sm hover:text-amber-600 transition-colors duration-300 flex items-center"
            >
              <span>เลือกการ์ด</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
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
            value={limit}
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
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
              {`${(page - 1) * limit + 1}-${Math.min(
                page * limit,
                totalItems
              )} จาก ${totalItems}`}
            </span>
            <div className="flex space-x-1">
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || isLoading}
                className="px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
              >
                Previous
              </Button>
              <span className="px-4 py-2 border rounded-md text-sm bg-amber-100 text-amber-800">
                {page} of {totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(page + 1)}
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