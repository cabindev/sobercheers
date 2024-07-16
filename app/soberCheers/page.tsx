"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

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
  const [soberCheers, setSoberCheers] = useState<SoberCheer[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [participantCount, setParticipantCount] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchSoberCheers();
    fetchParticipantCount();
  }, [search, sort, page, rowsPerPage, selectedType]);

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
        search,
        sort,
        page: page.toString(),
        limit: rowsPerPage.toString(),
        type: selectedType,
      }).toString();
      const res = await axios.get(`/api/soberCheers?${query}`);
      const data = res.data;

      if (data && Array.isArray(data.soberCheers)) {
        setSoberCheers(data.soberCheers);
        setTotalItems(data.totalItems);
      } else {
        console.error('Invalid soberCheers data:', data);
        setSoberCheers([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Failed to fetch soberCheers', error);
      setSoberCheers([]);
      setTotalItems(0);
    }
  };

  const deleteSoberCheer = async (id: number) => {
    try {
      await axios.delete(`/api/soberCheers/${id}`);
      await fetchSoberCheers(); // Fetch the updated list
      await fetchParticipantCount(); // Fetch the updated count
    } catch (error) {
      console.error('Failed to delete the SoberCheer', error);
    }
  };

  const calculateAge = (birthday: string): number => {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const totalPages = Math.ceil(totalItems / rowsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="bg-gradient-to-br from-amber-500 to-orange-700 text-white py-8 rounded-lg shadow-md text-center">
          <h1 className="text-4xl font-bold">SOBER CHEERs</h1>
          <p className="text-xl mt-2">ชวนช่วย ชมเชียร์ เชิดชู</p>
          <p className="text-lg mt-4">ร่วมเป็นส่วนหนึ่งในการเปลี่ยนแปลงและสนับสนุน งดเหล้าครบพรรษา ปี 2567</p>
        </div>
        {/* <div className="flex justify-end mt-4">
          <button className="bg-white text-amber-600 py-2 px-4 rounded-lg shadow-sm">
            ผู้เข้าร่วมทั้งหมด: {participantCount?.toLocaleString() ?? "..."} คน
          </button>
        </div> */}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="ค้นหาตามชื่อ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Link href="/soberCheers/create" className="bg-amber-600 text-white py-2 px-4 rounded-lg shadow-sm hover:bg-amber-500 transition duration-150">
            เพิ่มรายชื่อ
          </Link>
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-amber-200">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">ลำดับ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">ชื่อ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">อายุ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">ที่อยู่</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">ภาค</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">สถานะการดื่ม</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">ความตั้งใจ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-amber-100">
              {soberCheers.map((soberCheer, index) => (
                <tr key={soberCheer.id} className={`${index % 2 === 0 ? 'bg-amber-50' : 'bg-white'} hover:bg-amber-100 transition-colors duration-150 ease-in-out`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{soberCheer.firstName} {soberCheer.lastName}</div>
                      {index === 0 && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 animate-pulse">
                          ล่าสุด
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateAge(soberCheer.birthday)} ปี</td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{soberCheer.addressLine1}, {soberCheer.district}, {soberCheer.amphoe}, {soberCheer.province}, {soberCheer.zipcode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{soberCheer.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{soberCheer.alcoholConsumption}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{soberCheer.intentPeriod || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/soberCheers/edit/${soberCheer.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">แก้ไข</Link>
                    {/* <button onClick={() => deleteSoberCheer(soberCheer.id)} className="text-red-600 hover:text-red-900">ลบ</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden space-y-4">
          {soberCheers.map((soberCheer, index) => (
            <div key={soberCheer.id} className="bg-white shadow-md rounded-lg p-4 border border-amber-200">
              <div className="flex justify-between items-start">
                <div className="text-lg font-semibold text-amber-700">{index + 1}. {soberCheer.firstName} {soberCheer.lastName}</div>
                {index === 0 && (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 animate-pulse">ล่าสุด</span>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>อายุ: {calculateAge(soberCheer.birthday)} ปี</p>
                <p>ที่อยู่: {soberCheer.addressLine1}, {soberCheer.district}, {soberCheer.amphoe}, {soberCheer.province}, {soberCheer.zipcode}</p>
                <p>ภาค: {soberCheer.type}</p>
                <p>สถานะการดื่ม: {soberCheer.alcoholConsumption}</p>
                <p>ความตั้งใจ: {soberCheer.intentPeriod || "-"}</p>
              </div>
              <div className="mt-4 flex space-x-4">
                <Link href={`/soberCheers/edit/${soberCheer.id}`} className="text-indigo-600 hover:text-indigo-900">แก้ไข</Link>
                {/* <button onClick={() => deleteSoberCheer(soberCheer.id)} className="text-red-600 hover:text-red-900">ลบ</button> */}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center">
            <select value={rowsPerPage} onChange={(e) => setRowsPerPage(parseInt(e.target.value))} className="mx-2 px-2 py-1 border border-amber-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-700">รายการต่อหน้า</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">{page * rowsPerPage - rowsPerPage + 1}-{Math.min(page * rowsPerPage, totalItems)} จาก {totalItems}</span>
            <div className="flex space-x-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50">ก่อนหน้า</button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50">ถัดไป</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}