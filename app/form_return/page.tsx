"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

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

export default function ListFormReturn() {
  const [forms, setForms] = useState<FormReturn[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchForms();
  }, [search, sort, page, rowsPerPage]);

  const fetchForms = async () => {
    try {
      const query = new URLSearchParams({ search, sort, page: page.toString(), limit: rowsPerPage.toString() }).toString();
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
      setForms([]);
      setTotalItems(0);
    }
  };

  const deleteForm = async (id: number) => {
    try {
      await axios.delete(`/api/form_return/${id}`);
      fetchForms();
    } catch (error) {
      console.error('Failed to delete the form', error);
    }
  };

  const totalPages = Math.ceil(totalItems / rowsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Table view for larger screens */}
      <div className="hidden md:block shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ลำดับ
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ชื่อผู้ส่งข้อมูล
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ชื่อองค์กร
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ที่อยู่
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                เบอร์โทร
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                เข้าร่วม
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                รูป/1
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                รูป/2
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {forms.map((form, index) => (
              <tr key={form.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(page - 1) * rowsPerPage + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {form.firstName} {form.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {form.organizationName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {form.addressLine1}, {form.subDistrict}, {form.district},{" "}
                    {form.province}, {form.zipcode}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {form.phoneNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {form.numberOfSigners.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  {form.image1 && (
                    <div className="avatar">
                      <div className="w-8 rounded">
                        <img
                          src={form.image1}
                          alt={`image1-${form.id}`}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  {form.image2 && (
                    <div className="avatar">
                      <div className="w-8 rounded">
                        <img
                          src={form.image2}
                          alt={`image2-${form.id}`}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm font-medium">
                  <Link
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    href={`/form_return/edit/${form.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteForm(form.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for smaller screens */}
      <div className="md:hidden space-y-4">
        {forms.map((form, index) => (
          <div key={form.id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600">
                ลำดับ: {(page - 1) * rowsPerPage + index + 1}
              </span>
              <div className="flex space-x-2">
                <Link
                  href={`/form_return/edit/${form.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteForm(form.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold">
              {form.firstName} {form.lastName}
            </h3>
            <p className="text-sm text-gray-600">{form.organizationName}</p>
            <p className="text-sm text-gray-600 mt-2">
              {form.addressLine1}, {form.subDistrict}, {form.district},{" "}
              {form.province}, {form.zipcode}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              เบอร์โทร: {form.phoneNumber}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              เข้าร่วม: {form.numberOfSigners.toLocaleString()} คน
            </p>
            <div className="flex space-x-4 mt-2">
              {form.image1 && (
                <div className="avatar">
                  <div className="w-12 rounded">
                    <img
                      src={form.image1}
                      alt={`image1-${form.id}`}
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              {form.image2 && (
                <div className="avatar">
                  <div className="w-12 rounded">
                    <img
                      src={form.image2}
                      alt={`image2-${form.id}`}
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <span>Rows per page: </span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
            className="mx-2 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">
            {page * rowsPerPage - rowsPerPage + 1}-
            {Math.min(page * rowsPerPage, totalItems)} of {totalItems}
          </span>
          <div className="flex space-x-1">
            <button
              className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              {"<<"}
            </button>
            <button
              className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              {"<"}
            </button>
            <button
              className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              {">"}
            </button>
            <button
              className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>

      <Link
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        href="/form_return/create"
      >
        Create a New Form
      </Link>
    </div>
  );
}