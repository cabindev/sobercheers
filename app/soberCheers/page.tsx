'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { TotalCount } from './components/totalCount';
import EditSoberCheersModal from './components/editSoberCheersModal';

interface SoberCheer {
  id: number;
  firstName: string;
  lastName: string;
  birthday: string;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  phone: string;
  job: string;
  alcoholConsumption: string;
  drinkingFrequency: string;
  intentPeriod: string;
  monthlyExpense: number;
  motivations: string[];
  healthImpact: string;
  type: string;
}

export default function ListSoberCheers() {
  const [allSoberCheers, setAllSoberCheers] = useState<SoberCheer[]>([]);
  const [filteredSoberCheers, setFilteredSoberCheers] = useState<SoberCheer[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [participantCount, setParticipantCount] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [updateTotalCountTrigger, setUpdateTotalCountTrigger] = useState(0);
  const { data: session } = useSession();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSoberCheerId, setEditingSoberCheerId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    fetchSoberCheers();
    fetchParticipantCount();
    fetchTypes();
    setUpdateTotalCountTrigger(prev => prev + 1);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);  // Remove dependencies, we'll handle updates manually
  const fetchTypes = async () => {
    try {
      const response = await axios.get('/api/soberCheers/typeRegions');
      setTypes(response.data.typeRegions);
    } catch (error) {
      console.error('Failed to fetch type regions:', error);
    }
  };

  const fetchParticipantCount = async () => {
    try {
      const response = await axios.get('/api/soberCheers/count/');
      if (typeof response.data.count === 'number') {
        setParticipantCount(response.data.count);
      } else {
        console.error('Invalid participant count received:', response.data);
        setParticipantCount(null);
      }
    } catch (error) {
      console.error('Failed to fetch participant count:', error);
      setParticipantCount(null);
    }
  };

  const fetchSoberCheers = async () => {
    try {
      const query = new URLSearchParams({
        sort,
      }).toString();
      const res = await axios.get(`/api/soberCheers?${query}`);
      const data = res.data;
      if (data && Array.isArray(data.soberCheers)) {
        setAllSoberCheers(data.soberCheers);
        applyFiltersAndPagination(data.soberCheers);
      } else {
        console.error('Invalid soberCheers data:', data);
        setAllSoberCheers([]);
        setFilteredSoberCheers([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Failed to fetch soberCheers', error);
      setAllSoberCheers([]);
      setFilteredSoberCheers([]);
      setTotalItems(0);
    }
  };

  const applyFiltersAndPagination = (soberCheers: SoberCheer[]) => {
    const filtered = soberCheers.filter(cheer => 
      (selectedType === '' || cheer.type === selectedType) &&
      (search === '' || 
        cheer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        cheer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        cheer.addressLine1.toLowerCase().includes(search.toLowerCase()) ||
        cheer.district.toLowerCase().includes(search.toLowerCase()) ||
        cheer.amphoe.toLowerCase().includes(search.toLowerCase()) ||
        cheer.province.toLowerCase().includes(search.toLowerCase())
      )
    );
    setTotalItems(filtered.length);
    setFilteredSoberCheers(filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage));
  };

  useEffect(() => {
    applyFiltersAndPagination(allSoberCheers);
  }, [page, rowsPerPage, selectedType, search, allSoberCheers]);

  const deleteSelectedSoberCheers = async () => {
    try {
      await Promise.all(selectedItems.map(id => axios.delete(`/api/soberCheers/${id}`)));
      await fetchSoberCheers();
      await fetchParticipantCount();
      setSelectedItems([]);
      setUpdateTotalCountTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Failed to delete selected SoberCheers', error);
    }
  };

  const calculateAge = (birthday: string): number => {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleEditClick = (id: number) => {
    setEditingSoberCheerId(id);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditingSoberCheerId(null);
  };

  const handleUpdateSuccess = () => {
    fetchSoberCheers();
    setUpdateTotalCountTrigger(prev => prev + 1);
  };

  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const isAdmin = session?.user?.role === 'admin';

  const renderMobileCard = (item: SoberCheer, index: number) => (
    <div
      key={item.id}
      className="bg-white shadow-md rounded-lg p-4 border border-amber-200 mb-4"
    >
      <div className="flex justify-between items-start">
        {isAdmin && (
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => handleSelectItem(item.id)}
            className="form-checkbox h-4 w-4 text-amber-600"
          />
        )}
        <div className="text-sm font-semibold text-amber-700">
          {(page - 1) * rowsPerPage + index + 1}. {item.firstName} {item.lastName}
        </div>
        {index === 0 && (
          <span className="px-2 inline-flex text-xxs leading-5 font-semibold rounded-full bg-green-100 text-green-800 animate-pulse">
            ล่าสุด
          </span>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-600">
        <p>อายุ: {calculateAge(item.birthday)} ปี</p>
        <p>ที่อยู่: {item.addressLine1}, {item.district}, {item.amphoe}, {item.province}, {item.zipcode}</p>
        <p>ภาค: {item.type}</p>
        <p>สถานะการดื่ม: {item.alcoholConsumption}</p>
        <p>ความตั้งใจ: {item.intentPeriod || "-"}</p>
      </div>
      <div className="mt-2 flex space-x-3">
        <button
          onClick={() => handleEditClick(item.id)}
          className="text-indigo-600 hover:text-indigo-900 text-xs"
        >
          แก้ไข
        </button>
        <Link
          href={`/soberCheers/edit/${item.id}`}
          className="text-amber-600 hover:text-amber-900 text-xs"
        >
          ดูรายละเอียด
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <div className="mb-8 relative">
        <div className="bg-gradient-to-br from-amber-500 to-orange-700 text-white py-8 rounded-lg shadow-md text-center relative">
          <h1 className="text-4xl font-bold mb-4">SOBER CHEERs</h1>
          <p className="text-xl mb-2">ชวนช่วย ชมเชียร์ เชิดชู</p>
          <p className="text-lg mb-2">
            ร่วมเป็นส่วนหนึ่งในการเปลี่ยนแปลงและสนับสนุน งดเหล้าครบพรรษา ปี 2567
          </p>
          <div className="text-sm">
            จำนวนผู้เข้าร่วมโครงการ:{" "}
            <TotalCount updateTrigger={updateTotalCountTrigger} />
          </div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="ค้นหาตามชื่อ, ที่อยู่..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">ทุกภาค</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <Link
            href="/soberCheers/create"
            className="bg-amber-600 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-amber-500 transition duration-150"
          >
            เพิ่มรายชื่อ
          </Link>
          {isAdmin && selectedItems.length > 0 && (
            <button
              onClick={deleteSelectedSoberCheers}
              className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-red-500 transition duration-150"
            >
              ลบรายการที่เลือก ({selectedItems.length})
            </button>
          )}
        </div>
        {isMobile ? (
          <div className="space-y-4">
            {filteredSoberCheers.map((item, index) =>
              renderMobileCard(item, index)
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-amber-200 table-fixed">
              <thead className="bg-amber-50">
                <tr>
                  {isAdmin && (
                    <th className="px-3 py-2 text-left text-xxs font-medium text-slate-700 uppercase tracking-wider w-10">
                      เลือก
                    </th>
                  )}
                  <th className="px-3 py-2 text-left text-xxs font-medium text-slate-700 uppercase tracking-wider w-10">
                    ลำดับ
                  </th>
                  <th className="px-3 py-2 text-left text-xxs font-medium text-slate-700 uppercase tracking-wider w-28">
                    ชื่อ
                  </th>
                  <th className="px-3 py-2 text-left text-xxs font-medium text-slate-700 uppercase tracking-wider w-16">
                    อายุ
                  </th>
                  <th className="px-3 py-2 text-left text-xxs font-medium text-slate-700 uppercase tracking-wider">
                    ที่อยู่
                  </th>
                  <th className="px-3 py-2 text-left text-xxs font-medium text-slate-700 uppercase tracking-wider w-24">
                    ภาค
                  </th>
                  <th className="px-3 py-2 text-left text-xxs font-medium text-slate-700 uppercase tracking-wider w-32">
                    สถานะการดื่ม
                  </th>
                  <th className="px-3 py-2 text-left text-xxs font-medium text-slate-700 uppercase tracking-wider w-24">
                    ความตั้งใจ
                  </th>
                  <th className="px-3 py-2 text-left text-xxs font-medium text-slate-700 uppercase tracking-wider w-16">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-amber-100">
                {filteredSoberCheers.map((soberCheer, index) => (
                  <tr
                    key={soberCheer.id}
                    className={`${
                      index % 2 === 0 ? "bg-amber-50" : "bg-white"
                    } hover:bg-amber-100 transition-colors duration-150 ease-in-out`}
                  >
                    {isAdmin && (
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(soberCheer.id)}
                          onChange={() => handleSelectItem(soberCheer.id)}
                          className="form-checkbox h-4 w-4 text-amber-600"
                        />
                      </td>
                    )}
                    <td className="px-3 py-2 whitespace-nowrap text-xxs text-gray-500">
                      {(page - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-xxs font-medium text-gray-900">
                          {soberCheer.firstName} {soberCheer.lastName}
                        </div>
                        {index === 0 && (
                          <span className="ml-2 px-2 inline-flex text-xxs leading-5 font-semibold rounded-full bg-green-100 text-green-800 animate-pulse">
                            ล่าสุด
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xxs text-gray-500">
                      {calculateAge(soberCheer.birthday)} ปี
                    </td>
                    <td className="px-3 py-2 whitespace-normal text-xxs text-gray-500">
                      {soberCheer.addressLine1}, {soberCheer.district},{" "}
                      {soberCheer.amphoe}, {soberCheer.province},{" "}
                      {soberCheer.zipcode}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xxs text-gray-500">
                      {soberCheer.type}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xxs text-gray-500">
                      {soberCheer.alcoholConsumption}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xxs text-gray-500">
                      {soberCheer.intentPeriod || "-"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xxs font-medium">
                      <button
                        onClick={() => handleEditClick(soberCheer.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        แก้ไข
                      </button>
                      <Link
                        href={`/soberCheers/edit/${soberCheer.id}`}
                        className="text-amber-600 hover:text-amber-900"
                      >
                        ดูรายละเอียด
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value));
                setPage(1);
              }}
              className="mx-2 px-2 py-1 border border-amber-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-xs text-gray-700">รายการต่อหน้า</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700">
              {filteredSoberCheers.length > 0
                ? `${(page - 1) * rowsPerPage + 1}-${Math.min(
                    page * rowsPerPage,
                    totalItems
                  )} จาก ${totalItems}`
                : "ไม่พบข้อมูล"}
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-2 py-1 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
              >
                ก่อนหน้า
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={
                  page === totalPages || filteredSoberCheers.length === 0
                }
                className="px-2 py-1 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      </div>
      {editingSoberCheerId && (
        <EditSoberCheersModal
          soberCheerId={editingSoberCheerId}
          isOpen={editModalOpen}
          onClose={handleEditModalClose}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
}