'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable, { TableColumn, TableRow } from 'react-data-table-component';
import { CSVLink } from 'react-csv';

interface Campaign {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
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
  motivation: string;
  healthImpact: string;
  createdAt: string;
  updatedAt: string;
}

const TablePage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedRows, setSelectedRows] = useState<Campaign[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true); // เพิ่มสถานะการโหลด

  useEffect(() => {
    fetchCampaigns();
  }, [page, limit, search, type]);

  const fetchCampaigns = async () => {
    setLoading(true); // เริ่มการโหลดข้อมูล
    try {
      const response = await axios.get(`/api/table`, {
        params: {
          page,
          limit,
          search,
          type,
        },
      });
      setCampaigns(response.data.campaigns);
      setTotalItems(response.data.totalItems);
      setTypes(response.data.types.map((item: { type: string }) => item.type));
    } catch (error) {
      console.error('Failed to fetch campaigns', error);
    } finally {
      setLoading(false); // เสร็จสิ้นการโหลดข้อมูล
    }
  };

  useEffect(() => {
    setCsvData(selectedRows.length > 0 ? selectedRows : campaigns);
  }, [selectedRows, campaigns]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setPage(1); // Reset to first page when filtering
  };

  const columns: TableColumn<Campaign>[] = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'User ID', selector: row => row.userId, sortable: true },
    { name: 'First Name', selector: row => row.firstName, sortable: true },
    { name: 'Last Name', selector: row => row.lastName, sortable: true },
    { name: 'Phone', selector: row => row.phone, sortable: true },
    { name: 'Address', selector: row => row.addressLine1, sortable: true },
    { name: 'District', selector: row => row.district, sortable: true },
    { name: 'Amphoe', selector: row => row.amphoe, sortable: true },
    { name: 'Province', selector: row => row.province, sortable: true },
    { name: 'Zipcode', selector: row => row.zipcode, sortable: true },
    { name: 'Type', selector: row => row.type, sortable: true },
    { name: 'Job', selector: row => row.job, sortable: true },
    { name: 'Alcohol Consumption', selector: row => row.alcoholConsumption, sortable: true },
    { name: 'Drinking Frequency', selector: row => row.drinkingFrequency, sortable: true },
    { name: 'Intent Period', selector: row => row.intentPeriod, sortable: true },
    { name: 'Monthly Expense', selector: row => row.monthlyExpense, sortable: true },
    { name: 'Motivation', selector: row => row.motivation, sortable: true },
    { name: 'Health Impact', selector: row => row.healthImpact, sortable: true },
    { name: 'Created At', selector: row => row.createdAt, sortable: true },
    { name: 'Updated At', selector: row => row.updatedAt, sortable: true },
  ];

  const csvHeaders = [
    { label: 'ID', key: 'id' },
    { label: 'User ID', key: 'userId' },
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Phone', key: 'phone' },
    { label: 'Address', key: 'addressLine1' },
    { label: 'District', key: 'district' },
    { label: 'Amphoe', key: 'amphoe' },
    { label: 'Province', key: 'province' },
    { label: 'Zipcode', key: 'zipcode' },
    { label: 'Type', key: 'type' },
    { label: 'Job', key: 'job' },
    { label: 'Alcohol Consumption', key: 'alcoholConsumption' },
    { label: 'Drinking Frequency', key: 'drinkingFrequency' },
    { label: 'Intent Period', key: 'intentPeriod' },
    { label: 'Monthly Expense', key: 'monthlyExpense' },
    { label: 'Motivation', key: 'motivation' },
    { label: 'Health Impact', key: 'healthImpact' },
    { label: 'Created At', key: 'createdAt' },
    { label: 'Updated At', key: 'updatedAt' },
  ];

  const handleRowSelected = (selectedRows: { selectedRows: Campaign[] }) => {
    setSelectedRows(selectedRows.selectedRows);
  };

  return (
    <div>
      <div className='text-center text-xl mb-4'>
        <h1 className='text-xl my-4'>ข้อมูลลงทะเบียนเข้าร่วม งดเหล้าเข้าพรรษา</h1>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={handleSearch}
          className="input input-bordered w-full max-w-xs mx-2"
        />
        <select value={type} onChange={handleTypeChange} className="input input-bordered w-full max-w-xs">
          <option className="text-slate-400" value="">เลือกภาค</option>
          {types.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename="campaigns.csv"
          className="btn btn-sm mb-4 p-2 bg-slate-800 text-white rounded-md mx-2"
          target="_blank"
        >
          Export CSV
        </CSVLink>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="hidden lg:block">
            <DataTable
              columns={columns}
              data={campaigns}
              pagination
              paginationServer
              paginationTotalRows={totalItems}
              onChangePage={(page) => setPage(page)}
              onChangeRowsPerPage={(newLimit) => setLimit(newLimit)}
              highlightOnHover
              selectableRows
              onSelectedRowsChange={handleRowSelected}
              persistTableHead
            />
          </div>
          <div className="lg:hidden">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                <div className="flex flex-col space-y-2">
                  <div className="text-lg font-semibold text-gray-900">
                    {campaign.firstName} {campaign.lastName}
                  </div>
                  <div className="text-sm text-gray-700">
                    Phone: {campaign.phone}
                  </div>
                  <div className="text-sm text-gray-700">
                    Address: {campaign.addressLine1}, {campaign.district}, {campaign.amphoe}, {campaign.province}, {campaign.zipcode}
                  </div>
                  <div className="text-sm text-gray-700">
                    Type: {campaign.type}
                  </div>
                  <div className="text-sm text-gray-700">
                    Job: {campaign.job}
                  </div>
                  <div className="text-sm text-gray-700">
                    Alcohol Consumption: {campaign.alcoholConsumption}
                  </div>
                  <div className="text-sm text-gray-700">
                    Drinking Frequency: {campaign.drinkingFrequency}
                  </div>
                  <div className="text-sm text-gray-700">
                    Intent Period: {campaign.intentPeriod}
                  </div>
                  <div className="text-sm text-gray-700">
                    Monthly Expense: {campaign.monthlyExpense}
                  </div>
                  <div className="text-sm text-gray-700">
                    Motivation: {campaign.motivation}
                  </div>
                  <div className="text-sm text-gray-700">
                    Health Impact: {campaign.healthImpact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TablePage;
