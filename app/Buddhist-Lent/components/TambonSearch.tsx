// app/Buddhist2025/components/TambonSearch.tsx
'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Search, MapPin, X, AlertCircle, Edit, Loader2, CheckCircle } from 'lucide-react';
import { LocationData } from '@/types/location';
import { data as regionsData } from '@/app/data/regions';

interface TambonSearchProps {
  onSelectLocation: (location: LocationData) => void;
  initialLocation?: LocationData;
  disabled?: boolean;
}

export default function TambonSearch({ 
  onSelectLocation, 
  initialLocation,
  disabled = false 
}: TambonSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<LocationData[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || null
  );
  const [manualEntry, setManualEntry] = useState(false);
  const [manualData, setManualData] = useState({
    district: initialLocation?.district || '',
    amphoe: initialLocation?.amphoe || '',
    province: initialLocation?.province || '',
    zipcode: initialLocation?.zipcode || ''
  });

  useEffect(() => {
    if (initialLocation && initialLocation.district) {
      setSelectedLocation(initialLocation);
      setManualData({
        district: initialLocation.district,
        amphoe: initialLocation.amphoe,
        province: initialLocation.province,
        zipcode: initialLocation.zipcode || ''
      });
      setManualEntry(false);
    }
  }, [initialLocation]);

  useEffect(() => {
    if (!debouncedQuery.trim() || manualEntry) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsLoading(true);
    
    try {
      const query = debouncedQuery.toLowerCase();
      
      const filteredData = regionsData.filter(
        item => 
          item.district.toLowerCase().includes(query) ||
          item.amphoe.toLowerCase().includes(query) || 
          item.province.toLowerCase().includes(query)
      );
      
      const locationResults: LocationData[] = filteredData.map(item => ({
        district: item.district,
        amphoe: item.amphoe,
        province: item.province,
        type: item.type,
        geocode: item.district_code.toString(),
        lat: 0,
        lng: 0,
        zipcode: item.zipcode?.toString()
      }));
      
      setResults(locationResults.slice(0, 10));
      setIsDropdownOpen(locationResults.length > 0);
    } catch (error) {
      console.error('Error searching tambons:', error);
      setResults([]);
      setIsDropdownOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, manualEntry]);

  const handleSelectLocation = (location: LocationData) => {
    setSelectedLocation(location);
    setManualData({
      district: location.district,
      amphoe: location.amphoe,
      province: location.province,
      zipcode: location.zipcode || ''
    });
    setSearchQuery('');
    setIsDropdownOpen(false);
    setManualEntry(false);
    onSelectLocation(location);
  };

  const handleClearAll = () => {
    setSelectedLocation(null);
    setSearchQuery('');
    setIsDropdownOpen(false);
    setManualEntry(false);
    setManualData({ district: '', amphoe: '', province: '', zipcode: '' });
    onSelectLocation({
      district: '',
      amphoe: '',
      province: '',
      type: '',
      geocode: '',
      lat: 0,
      lng: 0,
      zipcode: ''
    });
  };

  const handleManualInputChange = (field: keyof typeof manualData, value: string) => {
    const newManualData = { ...manualData, [field]: value };
    setManualData(newManualData);
    
    onSelectLocation({
      district: newManualData.district,
      amphoe: newManualData.amphoe,
      province: newManualData.province,
      zipcode: newManualData.zipcode,
      type: '',
      geocode: '',
      lat: 0,
      lng: 0
    });

    if (selectedLocation) {
      setSelectedLocation(null);
    }
  };

  const handleInputFocus = () => {
    if (debouncedQuery && results.length > 0 && !manualEntry) {
      setIsDropdownOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (selectedLocation) {
      setSelectedLocation(null);
    }
  };

  const enableManualEntry = () => {
    setManualEntry(true);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-4 relative">
      {/* Search Input - Minimal Style */}
      {!manualEntry && (
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          
          <input
            type="text"
            className={`
              w-full pl-10 pr-10 py-3
              bg-white border border-gray-300 rounded-lg
              focus:border-orange-500 focus:ring-1 focus:ring-orange-200
              transition-colors duration-150
              placeholder:text-gray-400 text-gray-900 text-sm
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            placeholder="ค้นหาตำบล อำเภอ หรือจังหวัด..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={disabled}
          />
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Dropdown Results - Minimal Style */}
      {isDropdownOpen && !manualEntry && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-3 py-2 border-b border-gray-100">
              ผลการค้นหา ({results.length} รายการ)
            </div>
            
            {results.length > 0 ? (
              <div className="py-1">
                {results.map((result, index) => (
                  <button
                    key={`${result.geocode}-${index}`}
                    type="button"
                    onClick={() => handleSelectLocation(result)}
                    className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors duration-150 group"
                  >
                    <div className="flex items-start">
                      <div className="p-1.5 bg-orange-100 rounded-md mr-3">
                        <MapPin className="h-3 w-3 text-orange-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm text-gray-900">
                            {result.type} {result.district}
                          </span>
                          {result.zipcode && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {result.zipcode}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          อำเภอ{result.amphoe} • จังหวัด{result.province}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <MapPin className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">ไม่พบผลลัพธ์สำหรับ "{debouncedQuery}"</p>
                <p className="text-xs mt-1">ลองค้นหาด้วยคำอื่น หรือกรอกข้อมูลเอง</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Location Display - Minimal Success Style */}
      {selectedLocation && selectedLocation.district && !manualEntry && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="p-1.5 bg-green-500 rounded-md mr-3">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">เลือกที่อยู่แล้ว</p>
                <p className="text-xs text-green-600">ข้อมูลถูกกรอกอัตโนมัติจากระบบ</p>
              </div>
            </div>
            
            {!disabled && (
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center px-2 py-1 text-xs text-green-700 hover:text-green-800 bg-green-100 hover:bg-green-200 border border-green-300 rounded transition-colors duration-150"
              >
                <X className="h-3 w-3 mr-1" />
                เปลี่ยน
              </button>
            )}
          </div>
          
          {/* Location Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 bg-white border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-green-600 uppercase">ตำบล/แขวง</span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-900">{selectedLocation.district}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                กรอกอัตโนมัติ
              </p>
            </div>

            <div className="p-3 bg-white border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-green-600 uppercase">อำเภอ/เขต</span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-900">{selectedLocation.amphoe}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                กรอกอัตโนมัติ
              </p>
            </div>

            <div className="p-3 bg-white border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-green-600 uppercase">จังหวัด</span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-900">{selectedLocation.province}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                กรอกอัตโนมัติ
              </p>
            </div>

            <div className="p-3 bg-white border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-green-600 uppercase">รหัสไปรษณีย์</span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-900">{selectedLocation.zipcode || 'ไม่ระบุ'}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <CheckCircle className="h-3 w-3 mr-1" />
                กรอกอัตโนมัติ
              </p>
            </div>
          </div>

          {/* Region Information */}
          {selectedLocation.type && (
            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-600 mr-2" />
                <div>
                  <span className="text-xs text-gray-600 uppercase">ภูมิภาค</span>
                  <p className="text-sm text-gray-900">{selectedLocation.type}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Entry Toggle - Minimal Style */}
      {!selectedLocation && !manualEntry && (
        <div className="text-center">
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">ไม่พบตำบลที่ต้องการ?</p>
            <button
              type="button"
              onClick={enableManualEntry}
              className="inline-flex items-center px-3 py-1.5 text-xs text-orange-600 bg-white border border-orange-300 rounded hover:bg-orange-50 hover:border-orange-400 transition-colors duration-150"
              disabled={disabled}
            >
              <Edit className="h-3 w-3 mr-1" />
              กรอกข้อมูลเอง
            </button>
          </div>
        </div>
      )}

      {/* Manual Entry Fields - Minimal Style */}
      {manualEntry && (
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-1.5 bg-orange-500 rounded-md mr-3">
                  <Edit className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">โหมดกรอกข้อมูลเอง</p>
                  <p className="text-xs text-gray-600">กรอกข้อมูลที่อยู่ด้วยตนเอง</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManualEntry(false)}
                className="text-xs text-gray-600 hover:text-gray-800 underline"
                disabled={disabled}
              >
                กลับไปค้นหา
              </button>
            </div>
          </div>

          {/* Manual Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                ตำบล/แขวง <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={manualData.district}
                onChange={(e) => handleManualInputChange('district', e.target.value)}
                className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-colors duration-150 placeholder:text-gray-400 text-sm"
                placeholder="กรอกตำบล/แขวง"
                disabled={disabled}
              />
              <p className="mt-1 text-xs text-gray-500 flex items-center">
                <Edit className="h-3 w-3 mr-1" />
                กรอกด้วยตนเอง
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                อำเภอ/เขต <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={manualData.amphoe}
                onChange={(e) => handleManualInputChange('amphoe', e.target.value)}
                className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-colors duration-150 placeholder:text-gray-400 text-sm"
                placeholder="กรอกอำเภอ/เขต"
                disabled={disabled}
              />
              <p className="mt-1 text-xs text-gray-500 flex items-center">
                <Edit className="h-3 w-3 mr-1" />
                กรอกด้วยตนเอง
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                จังหวัด <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={manualData.province}
                onChange={(e) => handleManualInputChange('province', e.target.value)}
                className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-colors duration-150 placeholder:text-gray-400 text-sm"
                placeholder="กรอกจังหวัด"
                disabled={disabled}
              />
              <p className="mt-1 text-xs text-gray-500 flex items-center">
                <Edit className="h-3 w-3 mr-1" />
                กรอกด้วยตนเอง
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                รหัสไปรษณีย์ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={manualData.zipcode}
                onChange={(e) => handleManualInputChange('zipcode', e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
                className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-200 transition-colors duration-150 placeholder:text-gray-400 text-sm"
                placeholder="รหัสไปรษณีย์ 5 หลัก"
                disabled={disabled}
                maxLength={5}
              />
              <p className="mt-1 text-xs text-gray-500 flex items-center">
                <Edit className="h-3 w-3 mr-1" />
                กรอกด้วยตนเอง
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClearAll}
              disabled={disabled}
              className="inline-flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-150"
            >
              <X className="h-4 w-4 mr-1" />
              ล้างข้อมูลและกลับไปค้นหา
            </button>
          </div>
        </div>
      )}
      
      {/* Usage Instructions - Minimal Style */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start">
          <div className="p-1.5 bg-gray-400 rounded-md mr-3 flex-shrink-0">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
          <div className="text-xs text-gray-600">
            <p className="font-medium mb-2">💡 วิธีการใช้งาน:</p>
            <div className="space-y-1 text-gray-500">
              <p>• พิมพ์ชื่อตำบล อำเภอ หรือจังหวัด เพื่อค้นหา</p>
              <p>• เลือกจากรายการที่ปรากฏ ระบบจะกรอกข้อมูลให้อัตโนมัติ</p>
              <p>• หากไม่พบตำบลที่ต้องการ กดปุ่ม "กรอกข้อมูลเอง"</p>
              <p>• กดปุ่ม "เปลี่ยน" เพื่อยกเลิกการเลือกและเลือกใหม่</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}