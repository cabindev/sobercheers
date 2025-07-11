// app/dashboard/organization/gallery/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaTimes, 
  FaUsers, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaBuilding,
  FaArrowLeft,
  FaEye,
  FaImage,
  FaPhone,
  FaInfoCircle,
  FaImages,
  FaEdit
} from 'react-icons/fa';
import Link from 'next/link';
import { getAllOrganizations, OrganizationFilters } from '@/app/organization/actions/Get';
import { getActiveOrganizationCategories } from '@/app/dashboard/organization-category/actions/Get';
import { Organization, OrganizationCategory } from '@/types/organization';

interface ExtendedFilters extends OrganizationFilters {
  name: string;
  categoryId: string;
  type: string;
}

interface FilterOptions {
  provinces: string[];
  types: string[];
  organizationCategories: OrganizationCategory[];
}

interface GalleryStats {
  totalRecords: number;
  totalWithImages: number;
  totalWithoutImages: number;
  percentageWithImages: number;
}

// Minimalist Organization Card Component
const OrganizationCard: React.FC<{ org: Organization }> = ({ org }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // Get organization images with null checks
  const images = [org.image1, org.image2, org.image3, org.image4, org.image5]
    .filter((path): path is string => 
      path !== null && path !== undefined && path.trim() !== ''
    );
  
  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleImageError = (imagePath: string) => {
    setImageErrors(prev => ({ ...prev, [imagePath]: true }));
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-100 hover:border-gray-200 transition-all duration-500 overflow-hidden group relative">
      {/* Edit Icon - Top Right */}
      <Link 
        href={`/dashboard/organization/edit/${org.id}`}
        className="absolute top-3 right-3 z-10 w-7 h-7 bg-white/95 backdrop-blur-sm border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300"
      >
        <FaEdit className="w-3 h-3 text-gray-600" />
      </Link>

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-50">
        {hasImages ? (
          <>
            {/* Main Image */}
            <div className="relative w-full h-full">
              <img
                src={imageErrors[images[currentImageIndex]] 
                  ? '/images/no-image.png' 
                  : images[currentImageIndex]
                }
                alt={`${org.firstName} ${org.lastName} - รูปที่ ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                onError={() => handleImageError(images[currentImageIndex])}
                loading="lazy"
              />
            </div>

            {/* Navigation Controls - Show only if more than 1 image */}
            {hasMultipleImages && (
              <>
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  aria-label="รูปก่อนหน้า"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  aria-label="รูปถัดไป"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {images.map((_, index: number) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goToImage(index)}
                      className={`h-1 transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white w-4' 
                          : 'bg-white/60 hover:bg-white/80 w-1'
                      }`}
                      aria-label={`ไปยังรูปที่ ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute top-2 left-2 bg-black/30 text-white px-1.5 py-0.5 text-xs font-light">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </>
        ) : (
          /* No Image Placeholder */
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <FaImage className="w-8 h-8 text-gray-300 mx-auto mb-1" />
              <p className="text-gray-400 text-xs font-light">ไม่มีรูปภาพ</p>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] leading-relaxed">
          {org.firstName && org.lastName ? `${org.firstName} ${org.lastName}` : 'ไม่ระบุชื่อองค์กร'}
        </h3>
        
        <div className="space-y-1.5 text-xs text-gray-500 mb-3">
          {/* Location */}
          {(org.district || org.amphoe || org.province) && (
            <div className="flex items-start">
              <FaMapMarkerAlt className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1 leading-relaxed font-light">
                {[org.district, org.amphoe, org.province]
                  .filter(Boolean)
                  .join(', ') || 'ไม่ระบุที่อยู่'}
              </span>
            </div>
          )}

          {/* Organization Category */}
          {org.organizationCategory && (
            <div className="flex items-center">
              <FaBuilding className="w-3 h-3 mr-2 flex-shrink-0" />
              <span className="truncate font-light">{org.organizationCategory.name}</span>
            </div>
          )}

          {/* Phone Number */}
          {org.phoneNumber && (
            <div className="flex items-center">
              <FaPhone className="w-3 h-3 mr-2 flex-shrink-0" />
              <span className="truncate font-light">{org.phoneNumber}</span>
            </div>
          )}
        </div>
        
        {/* Number of Signers */}
        <div className="flex items-center justify-between mb-3">
          <div className="bg-gray-50 text-gray-700 px-2 py-1 text-xs font-light border border-gray-100">
            <div className="flex items-center">
              <FaUsers className="w-3 h-3 mr-1" />
              <span>
                {typeof org.numberOfSigners === 'number' 
                  ? org.numberOfSigners.toLocaleString('th-TH') 
                  : '0'
                } คน
              </span>
            </div>
          </div>
          {hasImages && (
            <div className="px-2 py-1 bg-gray-50 text-gray-600 text-xs flex items-center gap-1 border border-gray-100">
              <FaImages className="w-3 h-3" />
              {images.length}
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          href={`/dashboard/organization/view/${org.id}`}
          className="w-full bg-gray-900 text-white text-xs px-3 py-2 text-center hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-light"
        >
          <FaEye className="w-3 h-3" />
          ดูรายละเอียด
        </Link>

        {/* Date */}
        <div className="text-center text-xs text-gray-400 mt-2 font-light">
          <div className="flex items-center justify-center">
            <FaCalendarAlt className="w-3 h-3 mr-1" />
            <span>
              {org.createdAt 
                ? formatDate(org.createdAt)
                : 'ไม่ระบุวันที่'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrganizationGalleryPage: React.FC = () => {
  const [data, setData] = useState<Organization[]>([]);
  const [organizationCategories, setOrganizationCategories] = useState<OrganizationCategory[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [galleryStats, setGalleryStats] = useState<GalleryStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExtendedFilters>({
    search: '',
    organizationCategoryId: undefined,
    province: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 50,
    name: '',
    categoryId: '',
    type: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageFilter, setImageFilter] = useState<'all' | 'with-images' | 'without-images'>('all');
  const pageSize = 50;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [filters.search, filters.organizationCategoryId, filters.province, currentPage, filters.sortBy, filters.sortOrder, imageFilter]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch organization categories
      const categoriesResult = await getActiveOrganizationCategories();
      if (categoriesResult) {
        setOrganizationCategories(categoriesResult);
      }

      // Fetch all organizations for filter options
      const allOrgsResult = await getAllOrganizations({ limit: 1000 });
      if (allOrgsResult) {
        const allOrgs = allOrgsResult.data;
        
        // Extract unique provinces
        const provinces = Array.from(
          new Set(allOrgs.map(org => org.province).filter(Boolean))
        ).sort();
        
        // Extract unique types
        const types = Array.from(
          new Set(allOrgs.map(org => org.type).filter(Boolean))
        ).sort();

        setFilterOptions({
          provinces,
          types,
          organizationCategories: categoriesResult || []
        });

        // Calculate gallery stats
        const totalRecords = allOrgs.length;
        const totalWithImages = allOrgs.filter(org => 
          [org.image1, org.image2, org.image3, org.image4, org.image5].some(img => img && img.trim() !== '')
        ).length;
        const totalWithoutImages = totalRecords - totalWithImages;
        const percentageWithImages = totalRecords > 0 
          ? Math.round((totalWithImages / totalRecords) * 100) 
          : 0;

        setGalleryStats({
          totalRecords,
          totalWithImages,
          totalWithoutImages,
          percentageWithImages
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const result = await getAllOrganizations({
        ...filters,
        page: currentPage,
        limit: pageSize
      });

      if (result) {
        let filteredData = result.data;

        // Apply image filter
        if (imageFilter === 'with-images') {
          filteredData = filteredData.filter(org => 
            [org.image1, org.image2, org.image3, org.image4, org.image5].some(img => img && img.trim() !== '')
          );
        } else if (imageFilter === 'without-images') {
          filteredData = filteredData.filter(org => 
            ![org.image1, org.image2, org.image3, org.image4, org.image5].some(img => img && img.trim() !== '')
          );
        }

        setData(filteredData);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูลองค์กร');
    }
  };

  const handleFilterChange = (key: keyof ExtendedFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      organizationCategoryId: undefined,
      province: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: pageSize,
      name: '',
      categoryId: '',
      type: ''
    });
    setImageFilter('all');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-6 bg-gray-100 w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-100 overflow-hidden">
                    <div className="h-48 bg-gray-100"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-100 w-3/4"></div>
                      <div className="h-3 bg-gray-100 w-1/2"></div>
                      <div className="h-3 bg-gray-100 w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-900 text-lg mb-4 font-light">{error}</div>
          <button 
            type="button"
            onClick={fetchData}
            className="bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 transition-colors font-light text-sm"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-6 mb-4">
              <Link 
                href="/dashboard/organization"
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaArrowLeft className="w-3 h-3 mr-2" />
                <span className="text-sm font-light">กลับ</span>
              </Link>
              <h1 className="text-2xl font-light text-gray-900 flex items-center gap-3">
                <FaImages className="w-6 h-6 text-gray-600" />
                แกลเลอรี่องค์กร
              </h1>
            </div>
            <p className="text-gray-500 font-light text-sm">
              แสดงภาพและข้อมูลองค์กรในรูปแบบมินิมอล
            </p>
          </div>

          {/* Gallery Stats */}
          {galleryStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-light text-gray-500 mb-1">องค์กรทั้งหมด</p>
                    <p className="text-xl font-light text-gray-900">{galleryStats.totalRecords.toLocaleString()}</p>
                  </div>
                  <FaBuilding className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="bg-white border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-light text-gray-500 mb-1">มีภาพประกอบ</p>
                    <p className="text-xl font-light text-gray-900">{galleryStats.totalWithImages.toLocaleString()}</p>
                  </div>
                  <FaImage className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="bg-white border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-light text-gray-500 mb-1">ไม่มีภาพ</p>
                    <p className="text-xl font-light text-gray-900">{galleryStats.totalWithoutImages.toLocaleString()}</p>
                  </div>
                  <FaInfoCircle className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="bg-white border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-light text-gray-500 mb-1">% มีภาพ</p>
                    <p className="text-xl font-light text-gray-900">{galleryStats.percentageWithImages}%</p>
                  </div>
                  <div className="w-5 h-5 border border-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-light text-xs">%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อองค์กร, ผู้ติดต่อ, เบอร์โทร..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors font-light text-sm"
                  />
                </div>
              </div>

              {/* Province Filter */}
              <div className="lg:w-48">
                <select
                  title="เลือกจังหวัด"
                  value={filters.province}
                  onChange={(e) => handleFilterChange('province', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 focus:border-gray-400 focus:outline-none font-light text-sm"
                >
                  <option value="">ทุกจังหวัด</option>
                  {filterOptions?.provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="lg:w-48">
                <select
                  title="เลือกหมวดหมู่องค์กร"
                  value={filters.organizationCategoryId || ''}
                  onChange={(e) => handleFilterChange('organizationCategoryId', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2.5 border border-gray-200 focus:border-gray-400 focus:outline-none font-light text-sm"
                >
                  <option value="">ทุกหมวดหมู่</option>
                  {organizationCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Filter */}
              <div className="lg:w-48">
                <select
                  title="กรองตามภาพ"
                  value={imageFilter}
                  onChange={(e) => setImageFilter(e.target.value as 'all' | 'with-images' | 'without-images')}
                  className="w-full px-3 py-2.5 border border-gray-200 focus:border-gray-400 focus:outline-none font-light text-sm"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="with-images">มีภาพ</option>
                  <option value="without-images">ไม่มีภาพ</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2.5 text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700 transition-colors flex items-center gap-2 font-light text-sm"
              >
                <FaTimes className="w-3 h-3" />
                ล้าง
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {data.map((org) => (
              <OrganizationCard key={org.id} org={org} />
            ))}
          </div>

          {/* No Results */}
          {data.length === 0 && (
            <div className="text-center py-16">
              <FaImage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-light text-gray-600 mb-2">ไม่พบข้อมูล</h3>
              <p className="text-gray-400 font-light text-sm">ลองปรับเปลี่ยนเงื่อนไขการค้นหา</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white border border-gray-100 p-6 mt-8">
              {/* Pagination Info */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div className="text-sm text-gray-500 font-light mb-4 sm:mb-0">
                  แสดง {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, data.length + ((currentPage - 1) * pageSize))} 
                  จาก {galleryStats?.totalRecords || 0} รายการ (หน้าละ 50 รายการ)
                </div>
                <div className="text-sm text-gray-500 font-light">
                  หน้า {currentPage} จาก {totalPages}
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Previous/Next Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed font-light transition-colors"
                  >
                    หน้าแรก
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed font-light transition-colors"
                  >
                    ก่อนหน้า
                  </button>
                </div>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const getPageNumbers = () => {
                      const delta = 2;
                      const range = [];
                      const rangeWithDots = [];

                      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
                        range.push(i);
                      }

                      if (currentPage - delta > 2) {
                        rangeWithDots.push(1, '...');
                      } else {
                        rangeWithDots.push(1);
                      }

                      rangeWithDots.push(...range);

                      if (currentPage + delta < totalPages - 1) {
                        rangeWithDots.push('...', totalPages);
                      } else if (totalPages > 1) {
                        rangeWithDots.push(totalPages);
                      }

                      return rangeWithDots;
                    };

                    return getPageNumbers().map((page, index) => {
                      if (page === '...') {
                        return (
                          <span key={`dots-${index}`} className="px-2 py-2 text-sm text-gray-400 font-light">
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(Number(page))}
                          className={`px-3 py-2 text-sm transition-colors font-light ${
                            currentPage === page
                              ? 'bg-gray-900 text-white'
                              : 'border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    });
                  })()}
                </div>

                {/* Next/Last Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed font-light transition-colors"
                  >
                    ถัดไป
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-200 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed font-light transition-colors"
                  >
                    หน้าสุดท้าย
                  </button>
                </div>
              </div>

              {/* Quick Jump */}
              {totalPages > 10 && (
                <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-light">ไปหน้า:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    placeholder="หน้า"
                    title="ใส่หมายเลขหน้าที่ต้องการไป"
                    className="w-16 px-2 py-1 text-sm border border-gray-200 text-center focus:border-gray-400 focus:outline-none font-light"
                  />
                  <span className="text-sm text-gray-500 font-light">/ {totalPages}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationGalleryPage;