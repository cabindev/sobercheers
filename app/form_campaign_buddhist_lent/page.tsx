"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface CampaignBuddhistLent {
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
  motivation: string[];
  healthImpact: string;
}

export default function ListCampaignBuddhistLent() {
  const [campaigns, setCampaigns] = useState<CampaignBuddhistLent[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchCampaigns();
  }, [search, sort, page, rowsPerPage]);

  const fetchCampaigns = async () => {
    try {
      const query = new URLSearchParams({ search, sort, page: page.toString(), limit: rowsPerPage.toString() }).toString();
      const res = await axios.get(`/api/campaign-buddhist-lent?${query}`);
      const data = res.data;

      if (data && Array.isArray(data.campaigns)) {
        setCampaigns(data.campaigns);
        setTotalItems(data.totalItems);
      } else {
        console.error('Invalid campaigns data:', data);
        setCampaigns([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns', error);
      setCampaigns([]);
      setTotalItems(0);
    }
  };

  const handleApplyFilters = () => {
    fetchCampaigns();
  };

  const deleteCampaign = async (id: number) => {
    try {
      await axios.delete(`/api/campaign-buddhist-lent/${id}`);
      fetchCampaigns();
    } catch (error) {
      console.error('Failed to delete the campaign', error);
    }
  };

  const totalPages = Math.ceil(totalItems / rowsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="hero bg-gradient-to-r from-amber-500 to-amber-700 text-white py-10 mb-8 rounded-lg shadow-lg relative overflow-hidden">
        <div className="relative z-10 hero-content text-center">
          <h1 className="text-4xl font-bold drop-shadow-lg">
            กิจกรรม : SOBER CHEERs ชวนช่วย ชมเชียร์ ชมเชียร์
          </h1>
          <p className="mt-4 text-lg">
            ร่วมเป็นส่วนหนึ่งในการเปลี่ยนแปลงและสนับสนุนการงดเหล้าเข้าพรรษา
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

      <div className="hidden lg:block shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ชื่อ
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                วันเกิด
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
                งาน
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
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {campaign.firstName} {campaign.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(campaign.birthday).toLocaleDateString("en-GB")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {campaign.addressLine1}, {campaign.district},{" "}
                    {campaign.amphoe}, {campaign.province}, {campaign.zipcode}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {campaign.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal">
                  <div className="text-sm font-medium text-gray-900">
                    {campaign.job}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm font-medium">
                  <Link
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    href={`/form_campaign_buddhist_lent/edit/${campaign.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCampaign(campaign.id)}
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

      <div className="lg:hidden">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white shadow-md rounded-lg p-4 mb-4"
          >
            <div className="flex flex-col space-y-2">
              <div className="text-lg font-semibold text-gray-900">
                {campaign.firstName} {campaign.lastName}
              </div>
              <div className="text-sm text-gray-700">
                Birthday:{" "}
                {new Date(campaign.birthday).toLocaleDateString("en-GB")}
              </div>
              <div className="text-sm text-gray-700">
                Address: {campaign.addressLine1}, {campaign.district},{" "}
                {campaign.amphoe}, {campaign.province}, {campaign.zipcode}
              </div>
              <div className="text-sm text-gray-700">
                Phone: {campaign.phone}
              </div>
              <div className="text-sm text-gray-700">Job: {campaign.job}</div>
              <div className="flex space-x-4">
                <Link
                  className="text-indigo-600 hover:text-indigo-900"
                  href={`/form_campaign_buddhist_lent/edit/${campaign.id}`}
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteCampaign(campaign.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
            className="mx-2 px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        href="/form_campaign_buddhist_lent/create"
      >
        Create a New Campaign
      </Link>
    </div>
  );
}
