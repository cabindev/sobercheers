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
      {/* Search Input */}
      {!manualEntry && (
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          
          <input
            type="text"
            className={`
              w-full pl-10 pr-12 py-3.5
              bg-white/80 backdrop-blur-sm
              border-2 border-gray-200/60
              rounded-xl
              focus:border-amber-400 focus:ring-4 focus:ring-amber-100
              transition-all duration-200 ease-out
              placeholder:text-gray-400
              shadow-sm hover:shadow-md
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
              <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Dropdown Results */}
      {isDropdownOpen && !manualEntry && (
        <div className="
          absolute z-50 w-full mt-2
          bg-white/95 backdrop-blur-md
          border border-gray-200/50
          rounded-xl shadow-xl shadow-gray-200/50
          max-h-80 overflow-y-auto
        ">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100">
              ผลการค้นหา ({results.length} รายการ)
            </div>
            
            {results.length > 0 ? (
              <div className="py-1">
                {results.map((result, index) => (
                  <button
                    key={`${result.geocode}-${index}`}
                    type="button"
                    onClick={() => handleSelectLocation(result)}
                    className="
                      w-full text-left p-3 rounded-lg
                      hover:bg-amber-50/80 hover:border-amber-200
                      transition-all duration-150 ease-out
                      border border-transparent
                      group
                    "
                  >
                    <div className="flex items-start">
                      <div className="p-2 bg-gray-100 group-hover:bg-amber-100 rounded-lg mr-3 transition-colors">
                        <MapPin className="h-4 w-4 text-gray-500 group-hover:text-amber-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {result.type} {result.district}
                          </span>
                          {result.zipcode && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 group-hover:bg-amber-100 text-gray-600 rounded-full">
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
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">ไม่พบผลลัพธ์สำหรับ "{debouncedQuery}"</p>
                <p className="text-xs mt-1">ลองค้นหาด้วยคำอื่น หรือกรอกข้อมูลเอง</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ ปรับปรุงการแสดงผลที่อยู่ที่เลือก - แยกข้อมูลให้ชัดเจน */}
      {selectedLocation && selectedLocation.district && !manualEntry && (
        <div className="p-4 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">
                  ✅ เลือกที่อยู่แล้ว
                </p>
                <p className="text-xs text-green-600">
                  ข้อมูลถูกกรอกอัตโนมัติจากระบบ
                </p>
              </div>
            </div>
            
            {!disabled && (
              <button
                type="button"
                onClick={handleClearAll}
                className="
                  flex items-center px-3 py-1.5 
                  text-xs text-green-700 hover:text-green-800 
                  bg-green-100 hover:bg-green-200 
                  border border-green-300 rounded-lg
                  transition-all duration-200
                "
              >
                <X className="h-3 w-3 mr-1" />
                เปลี่ยน
              </button>
            )}
          </div>
          
          {/* ✅ แยกข้อมูลแต่ละส่วนให้ชัดเจน */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* ตำบล/แขวง */}
            <div className="p-4 bg-white/80 rounded-xl border border-green-200/60 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                  ตำบล/แขวง
                </span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {selectedLocation.district}
              </p>
              <p className="text-xs text-green-600 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                กรอกอัตโนมัติ
              </p>
            </div>

            {/* อำเภอ/เขต */}
            <div className="p-4 bg-white/80 rounded-xl border border-green-200/60 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                  อำเภอ/เขต
                </span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {selectedLocation.amphoe}
              </p>
              <p className="text-xs text-green-600 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                กรอกอัตโนมัติ
              </p>
            </div>

            {/* จังหวัด */}
            <div className="p-4 bg-white/80 rounded-xl border border-green-200/60 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                  จังหวัด
                </span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {selectedLocation.province}
              </p>
              <p className="text-xs text-green-600 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                กรอกอัตโนมัติ
              </p>
            </div>

            {/* รหัสไปรษณีย์ */}
            <div className="p-4 bg-white/80 rounded-xl border border-green-200/60 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                  รหัสไปรษณีย์
                </span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {selectedLocation.zipcode || 'ไม่ระบุ'}
              </p>
              <p className="text-xs text-green-600 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                กรอกอัตโนมัติ
              </p>
            </div>
          </div>

          {/* ✅ แสดงข้อมูลภูมิภาคแยกต่างหาก */}
          {selectedLocation.type && (
            <div className="mt-4 p-3 bg-blue-50/60 backdrop-blur-sm border border-blue-200/50 rounded-xl">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                <div>
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                    ภูมิภาค
                  </span>
                  <p className="text-sm font-semibold text-blue-800">
                    {selectedLocation.type}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Entry Toggle */}
      {!selectedLocation && !manualEntry && (
        <div className="text-center">
          <div className="p-3 bg-blue-50/60 backdrop-blur-sm border border-blue-200/50 rounded-xl">
            <p className="text-xs text-blue-700 mb-2">ไม่พบตำบลที่ต้องการ?</p>
            <button
              type="button"
              onClick={enableManualEntry}
              className="
                inline-flex items-center px-3 py-1.5 
                text-xs font-medium text-blue-600 
                bg-white/80 border border-blue-200 
                rounded-lg hover:bg-blue-50 hover:border-blue-300
                transition-all duration-200
              "
              disabled={disabled}
            >
              <Edit className="h-3 w-3 mr-1" />
              กรอกข้อมูลเอง
            </button>
          </div>
        </div>
      )}

      {/* Manual Entry Fields */}
      {manualEntry && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Edit className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">โหมดกรอกข้อมูลเอง</p>
                  <p className="text-xs text-blue-600">กรอกข้อมูลที่อยู่ด้วยตนเอง</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManualEntry(false)}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
                disabled={disabled}
              >
                กลับไปค้นหา
              </button>
            </div>
          </div>

          {/* ✅ แยกฟิลด์การกรอกเองให้ชัดเจน */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                ตำบล/แขวง <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={manualData.district}
                onChange={(e) => handleManualInputChange('district', e.target.value)}
                className="
                  w-full px-4 py-3.5
                  bg-white/80 backdrop-blur-sm
                  border-2 border-gray-200/60
                  rounded-xl
                  focus:border-blue-400 focus:ring-4 focus:ring-blue-100
                  transition-all duration-200 ease-out
                  placeholder:text-gray-400
                  shadow-sm hover:shadow-md
                "
                placeholder="กรอกตำบล/แขวง"
                disabled={disabled}
              />
              <p className="mt-1 text-xs text-blue-600 flex items-center">
                <Edit className="h-3 w-3 mr-1" />
                กรอกด้วยตนเอง
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                อำเภอ/เขต <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={manualData.amphoe}
                onChange={(e) => handleManualInputChange('amphoe', e.target.value)}
                className="
                  w-full px-4 py-3.5
                  bg-white/80 backdrop-blur-sm
                  border-2 border-gray-200/60
                  rounded-xl
                  focus:border-blue-400 focus:ring-4 focus:ring-blue-100
                  transition-all duration-200 ease-out
                  placeholder:text-gray-400
                  shadow-sm hover:shadow-md
                "
                placeholder="กรอกอำเภอ/เขต"
                disabled={disabled}
              />
              <p className="mt-1 text-xs text-blue-600 flex items-center">
                <Edit className="h-3 w-3 mr-1" />
                กรอกด้วยตนเอง
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                จังหวัด <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={manualData.province}
                onChange={(e) => handleManualInputChange('province', e.target.value)}
                className="
                  w-full px-4 py-3.5
                  bg-white/80 backdrop-blur-sm
                  border-2 border-gray-200/60
                  rounded-xl
                  focus:border-blue-400 focus:ring-4 focus:ring-blue-100
                  transition-all duration-200 ease-out
                  placeholder:text-gray-400
                  shadow-sm hover:shadow-md
                "
                placeholder="กรอกจังหวัด"
                disabled={disabled}
              />
              <p className="mt-1 text-xs text-blue-600 flex items-center">
                <Edit className="h-3 w-3 mr-1" />
                กรอกด้วยตนเอง
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                รหัสไปรษณีย์ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={manualData.zipcode}
                onChange={(e) => handleManualInputChange('zipcode', e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
                className="
                  w-full px-4 py-3.5
                  bg-white/80 backdrop-blur-sm
                  border-2 border-gray-200/60
                  rounded-xl
                  focus:border-blue-400 focus:ring-4 focus:ring-blue-100
                  transition-all duration-200 ease-out
                  placeholder:text-gray-400
                  shadow-sm hover:shadow-md
                "
                placeholder="รหัสไปรษณีย์ 5 หลัก"
                disabled={disabled}
                maxLength={5}
              />
              <p className="mt-1 text-xs text-blue-600 flex items-center">
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
              className="
                inline-flex items-center px-3 py-2 
                text-sm text-rose-600 hover:text-rose-700 
                border border-rose-200 rounded-lg
                hover:bg-rose-50 transition-all duration-200
              "
            >
              <X className="h-4 w-4 mr-1" />
              ล้างข้อมูลและกลับไปค้นหา
            </button>
          </div>
        </div>
      )}
      
      {/* Usage Instructions */}
      <div className="p-4 bg-amber-50/60 backdrop-blur-sm border border-amber-200/50 rounded-xl">
        <div className="flex items-start">
          <div className="p-2 bg-amber-100 rounded-lg mr-3 flex-shrink-0">
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-xs text-amber-800">
            <p className="font-semibold mb-2">💡 วิธีการใช้งาน:</p>
            <div className="space-y-1 text-amber-700">
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