'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import Link from 'next/link';

interface SoberSheer {
  id: number;
  firstName: string;
  lastName: string;
  birthday: string;
  phone: string;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  type: string;
  job: string;
  alcoholConsumption: string;
  drinkingFrequency: string;
  intentPeriod: string;
  monthlyExpense: number;
  motivations: string[];
  healthImpact: string;
  createdAt: string;
  updatedAt: string;
}

const TablePage = () => {
  const [soberSheers, setSoberSheers] = useState<SoberSheer[]>([]);
  const [selectedRows, setSelectedRows] = useState<SoberSheer[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<SoberSheer[]>([]);
  const [loading, setLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState<number | null>(null);

  useEffect(() => {
    fetchSoberSheers();
    fetchParticipantCount();
  }, [page, perPage, search, type]);

  const fetchParticipantCount = async () => {
    try {
      const response = await axios.get('/api/soberSheers/count/');
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

  const fetchSoberSheers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/soberTable`, {
        params: {
          page,
          perPage,
          search,
          type,
        },
      });
      setSoberSheers(response.data.soberSheers);
      setTotalItems(response.data.totalItems);
      setTypes(response.data.types.map((item: { type: string }) => item.type));
    } catch (error) {
      console.error('Failed to fetch sober sheers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCsvData(selectedRows.length > 0 ? selectedRows : soberSheers);
  }, [selectedRows, soberSheers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setPage(1);
  };

  const calculateAge = (birthday: string): number => {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const columns: TableColumn<SoberSheer>[] = [
    {
      name: "ชื่อ",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "อายุ",
      selector: (row) => calculateAge(row.birthday),
      sortable: true,
    },
    {
      name: "ที่อยู่",
      selector: (row) =>
        `${row.addressLine1}, ${row.district}, ${row.amphoe}, ${row.province}, ${row.zipcode}`,
      sortable: true,
    },
    { name: "ภาค", selector: (row) => row.type, sortable: true },
    {
      name: "สถานะการดื่ม",
      selector: (row) => row.alcoholConsumption,
      sortable: true,
    },
    {
      name: "ความตั้งใจ",
      selector: (row) => row.intentPeriod || "-",
      sortable: true,
    },
    {
      name: "จัดการ",
      cell: (row) => (
        <>
          <Link
            href={`/soberTable/edit/${row.id}`}
            className="text-indigo-600 hover:text-indigo-900 mr-4"
          >
            แก้ไข
          </Link>
          <button
            onClick={() => deleteSoberSheer(row.id)}
            className="text-red-600 hover:text-red-900"
          >
            ลบ
          </button>
        </>
      ),
    },
  ];

  const csvHeaders = [
    { label: 'ID', key: 'id' },
    { label: 'ชื่อ', key: 'firstName' },
    { label: 'นามสกุล', key: 'lastName' },
    { label: 'อายุ', key: 'age' },
    { label: 'เบอร์โทรศัพท์', key: 'phone' },
    { label: 'ที่อยู่', key: 'addressLine1' },
    { label: 'ตำบล', key: 'district' },
    { label: 'อำเภอ', key: 'amphoe' },
    { label: 'จังหวัด', key: 'province' },
    { label: 'รหัสไปรษณีย์', key: 'zipcode' },
    { label: 'ภาค', key: 'type' },
    { label: 'อาชีพ', key: 'job' },
    { label: 'สถานะการดื่ม', key: 'alcoholConsumption' },
    { label: 'ความถี่ในการดื่ม', key: 'drinkingFrequency' },
    { label: 'ระยะเวลาที่ตั้งใจ', key: 'intentPeriod' },
    { label: 'ค่าใช้จ่ายต่อเดือน', key: 'monthlyExpense' },
    { label: 'แรงจูงใจ', key: 'motivations' },
    { label: 'ผลกระทบต่อสุขภาพ', key: 'healthImpact' },
    { label: 'วันที่สร้าง', key: 'createdAt' },
    { label: 'วันที่อัปเดต', key: 'updatedAt' },
  ];

  const handleRowSelected = (state: { selectedRows: SoberSheer[] }) => {
    setSelectedRows(state.selectedRows);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePerRowsChange = async (newPerPage: number, newPage: number) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const deleteSoberSheer = async (id: number) => {
    try {
      await axios.delete(`/api/soberTable/${id}`);
      fetchSoberSheers();
    } catch (error) {
      console.error('Failed to delete the SoberTable entry', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="relative mb-12">
        <div className="hero-content text-center">
          <h1 className="text-2xl font-bold mb-4">
            SOBER CHEERs
          </h1>
          <p className="text-lg mb-2">
            ชวน ช่วย ชมเชียร์ เชิดชู
          </p>
          <p className="mt-4 text-base max-w-2xl mx-auto">
            ร่วมเป็นส่วนหนึ่งในการเปลี่ยนแปลงและสนับสนุน งดเหล้าครบพรรษา ปี 2567
          </p>
        </div>
      </div>

      <div className="mt-12 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <input
                type="text"
                placeholder="ค้นหาตามชื่อ..."
                value={search}
                onChange={handleSearch}
                className="px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-auto"
              />
              <select 
                value={type} 
                onChange={handleTypeChange} 
                className="px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">เลือกภาค</option>
                {types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <Link
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-150 ease-in-out"
              href="/soberSheers/create"
            >
              เพิ่มรายชื่อ
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-4">กำลังโหลด...</div>
          ) : (
            <DataTable
              columns={columns}
              data={soberSheers}
              pagination
              paginationServer
              paginationTotalRows={totalItems}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
              paginationComponentOptions={{
                rowsPerPageText: 'แถวต่อหน้า:',
                rangeSeparatorText: 'จาก',
                noRowsPerPage: false,
                selectAllRowsItem: false,
                selectAllRowsItemText: 'ทั้งหมด'
              }}
              highlightOnHover
              selectableRows
              onSelectedRowsChange={handleRowSelected}
              persistTableHead
            />
          )}

          <div className="mt-4">
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename="sober_sheers.csv"
              className="btn btn-sm p-2 bg-slate-800 text-white rounded-md"
              target="_blank"
            >
              Export CSV
            </CSVLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablePage; 
