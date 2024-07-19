'use client'
import React, { useState, useEffect } from 'react';
import { Table, Select, Button, Space, Typography, Input, Card, List, Checkbox, ConfigProvider, Pagination } from 'antd';
import { DownloadOutlined, FileExcelOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';


const { Option } = Select;
const { Title, Text } = Typography;

type FilterType = 'district' | 'amphoe' | 'province' | 'type' | 'region' | 'job' | 'drinkingFrequency' | 'intentPeriod';

interface Filters {
  district: string;
  amphoe: string;
  province: string;
  type: string;
  region: string;
  name: string;
  job: string;
  drinkingFrequency: string;
  intentPeriod: string;
}

interface SoberCheersItem {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  birthday: string;
  addressLine1: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  type: string;
  alcoholConsumption: string;
  healthImpact: string;
  phone: string;
  job: string;
  drinkingFrequency: string;
  intentPeriod: string;
  monthlyExpense: number;
  motivations: any;
}

const SoberCheersTable: React.FC = () => {
  const [data, setData] = useState<SoberCheersItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<Filters>({
    district: '',
    amphoe: '',
    province: '',
    type: '',
    region: '',
    name: '',
    job: '',
    drinkingFrequency: '',
    intentPeriod: '',
  });
  
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const theme = {
    token: {
      colorPrimary: '#f59e0b',
      fontSize: 12,
    },
  };

  useEffect(() => {
    fetchData();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ soberCheers: SoberCheersItem[] }>('/api/soberCheersCharts');
      setData(response.data.soberCheers);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (value: string, filterType: FilterType | 'name') => {
    setFilters(prevFilters => ({ ...prevFilters, [filterType]: value }));
    setCurrentPage(1);
  };

  const filteredData = data.filter((item: SoberCheersItem) => {
    return (
      (!filters.district || item.district === filters.district) &&
      (!filters.amphoe || item.amphoe === filters.amphoe) &&
      (!filters.province || item.province === filters.province) &&
      (!filters.type || item.type === filters.type) &&
      (!filters.region || getRegion(item.province) === filters.region) &&
      (!filters.name || `${item.firstName} ${item.lastName}`.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.job || item.job === filters.job) &&
      (!filters.drinkingFrequency || item.drinkingFrequency === filters.drinkingFrequency) &&
      (!filters.intentPeriod || item.intentPeriod === filters.intentPeriod)
    );
  });

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getRegion = (province: string): string => {
    const northernProvinces = ['เชียงใหม่', 'เชียงราย', 'ลำปาง'];
    const centralProvinces = ['กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี'];
    if (northernProvinces.includes(province)) return 'ภาคเหนือ';
    if (centralProvinces.includes(province)) return 'ภาคกลาง';
    return 'ไม่ระบุ';
  };

  const columns = [
    {
      title: 'ชื่อ-นามสกุล',
      render: (_: any, record: SoberCheersItem) => `${record.firstName} ${record.lastName}`,
    },
    { title: 'เพศ', dataIndex: 'gender' },
    {
      title: 'วันเกิด',
      dataIndex: 'birthday',
      render: (date: string) => new Date(date).toLocaleDateString('th-TH'),
    },
    {
      title: 'ที่อยู่',
      render: (_: any, record: SoberCheersItem) => 
        `${record.addressLine1}, ${record.district}, ${record.amphoe}, ${record.province} ${record.zipcode}`,
    },
    { title: 'ภาค', dataIndex: 'type' },
    { title: 'การดื่มแอลกอฮอล์', dataIndex: 'alcoholConsumption' },
    { title: 'ผลกระทบต่อสุขภาพ', dataIndex: 'healthImpact' },
    { title: 'เบอร์โทรศัพท์', dataIndex: 'phone' },
    { title: 'อาชีพ', dataIndex: 'job' },
    { title: 'ความถี่ในการดื่ม', dataIndex: 'drinkingFrequency' },
    { title: 'ระยะเวลาตั้งใจเลิกดื่ม', dataIndex: 'intentPeriod' },
    { title: 'ค่าใช้จ่ายต่อเดือน (บาท)', dataIndex: 'monthlyExpense' },
    {
      title: 'แรงจูงใจในการเลิกดื่ม',
      dataIndex: 'motivations',
      render: (motivations: any) => JSON.stringify(motivations),
    },
  ];

  const handleExportCSV = () => {
    const dataToExport = selectedRowKeys.length > 0 
      ? filteredData.filter(item => selectedRowKeys.includes(item.id))
      : filteredData;
  
    const escapeCSV = (data: any) => {
      if (data == null) return '';
      return typeof data === 'string' ? `"${data.replace(/"/g, '""')}"` : data;
    };
  
    const csvContent = [
      columns.map(col => escapeCSV(col.title)).join(';'),
      ...dataToExport.map(item => 
        columns.map(col => {
          let value;
          if ('render' in col && typeof col.render === 'function') {
            value = col.render(item[col.dataIndex as keyof SoberCheersItem], item);
          } else {
            value = item[col.dataIndex as keyof SoberCheersItem];
          }
          return escapeCSV(value);
        }).join(';')
      )
    ].join('\r\n');

    const BOM = '\uFEFF';
    const csvContentWithBOM = BOM + csvContent;

    const blob = new Blob([csvContentWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'sober_cheers_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportExcel = () => {
    const dataToExport = selectedRowKeys.length > 0 
      ? filteredData.filter(item => selectedRowKeys.includes(item.id))
      : filteredData;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(item => {
      return columns.reduce((acc, col) => {
        if ('render' in col && typeof col.render === 'function') {
          acc[col.title] = col.render(item[col.dataIndex as keyof SoberCheersItem], item);
        } else {
          acc[col.title] = item[col.dataIndex as keyof SoberCheersItem];
        }
        return acc;
      }, {} as { [key: string]: any });
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sober Cheers Data");

    XLSX.writeFile(workbook, "sober_cheers_data.xlsx");
  };

  const renderMobileCard = (item: SoberCheersItem) => (
    <Card 
      key={item.id} 
      style={{ marginBottom: 16, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
      size="small"
      hoverable
    >
      <Checkbox
        checked={selectedRowKeys.includes(item.id)}
        onChange={(e) => {
          const newSelectedRowKeys = e.target.checked
            ? [...selectedRowKeys, item.id]
            : selectedRowKeys.filter(key => key !== item.id);
          setSelectedRowKeys(newSelectedRowKeys);
        }}
      >
        เลือก
      </Checkbox>
      <Title level={5} style={{ marginTop: 8, color: '#f59e0b', fontSize: '14px' }}>{item.firstName} {item.lastName}</Title>
      <Text style={{ fontSize: '12px' }}><strong>เพศ:</strong> {item.gender}</Text><br />
      <Text style={{ fontSize: '12px' }}><strong>วันเกิด:</strong> {new Date(item.birthday).toLocaleDateString('th-TH')}</Text><br />
      <Text style={{ fontSize: '12px' }}><strong>ที่อยู่:</strong> {item.addressLine1}, {item.district}, {item.amphoe}, {item.province} {item.zipcode}</Text><br />
      <Text style={{ fontSize: '12px' }}><strong>ภาค:</strong> {item.type}</Text><br />
      <Text style={{ fontSize: '12px' }}><strong>การดื่มแอลกอฮอล์:</strong> {item.alcoholConsumption}</Text><br />
      <Text style={{ fontSize: '12px' }}><strong>ผลกระทบต่อสุขภาพ:</strong> {item.healthImpact}</Text><br />
      <Text style={{ fontSize: '12px' }}><strong>เบอร์โทรศัพท์:</strong> {item.phone}</Text><br />
      <Text style={{ fontSize: '12px' }}><strong>อาชีพ:</strong> {item.job}</Text><br />
      <Text style={{ fontSize: '12px' }}><strong>ความถี่ในการดื่ม:</strong> {item.drinkingFrequency}</Text><br />
      <Text style={{ fontSize: '12px' }}><strong>ระยะเวลาตั้งใจเลิกดื่ม:</strong> {item.intentPeriod}</Text><br />
      <Text style={{ fontSize: '12px' }}><strong>ค่าใช้จ่ายต่อเดือน:</strong> {item.monthlyExpense} บาท</Text><br />
      <Text style={{ fontSize: '12px' }}><strong>แรงจูงใจในการเลิกดื่ม:</strong> {JSON.stringify(item.motivations)}</Text>
    </Card>
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const renderMobileView = () => (
    <>
      <List
        dataSource={paginatedData}
        renderItem={(item) => renderMobileCard(item)}
      />
      <Pagination
        current={currentPage}
        total={filteredData.length}
        pageSize={pageSize}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: 16, textAlign: 'center' }}
      />
    </>
  );

  return (
    <ConfigProvider theme={theme}>
      <div className='justify-center items-center' style={{ padding: "20px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
        <Card style={{ marginBottom: 20, boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
          <Title level={3} style={{ color: "#f59e0b", marginBottom: 20, fontSize: "18px" }}>
            ข้อมูล Sober Cheers
          </Title>
          <Space style={{ marginBottom: 16 }} wrap>
            <Input
              placeholder="ค้นหาด้วยชื่อ"
              onChange={(e) => handleFilterChange(e.target.value, "name")}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Select
              style={{ width: 200 }}
              placeholder="เลือกตำบล"
              onChange={(value: string) => handleFilterChange(value, "district")}
            >
              {Array.from(new Set(data.map((item) => item.district))).map(
                (district) => (
                  <Option key={district} value={district}>
                    {district}
                  </Option>
                )
              )}
            </Select>
            <Select
              style={{ width: 200 }}
              placeholder="เลือกอำเภอ"
              onChange={(value: string) => handleFilterChange(value, "amphoe")}
            >
              {Array.from(new Set(data.map((item) => item.amphoe))).map(
                (amphoe) => (
                  <Option key={amphoe} value={amphoe}>
                    {amphoe}
                  </Option>
                )
              )}
            </Select>
            <Select
              style={{ width: 200 }}
              placeholder="เลือกจังหวัด"
              onChange={(value: string) => handleFilterChange(value, "province")}
            >
              {Array.from(new Set(data.map((item) => item.province))).map(
                (province) => (
                  <Option key={province} value={province}>
                    {province}
                  </Option>
                )
              )}
            </Select>
            <Select
              style={{ width: 200 }}
              placeholder="เลือกภาค"
              onChange={(value: string) => handleFilterChange(value, "type")}
            >
              {Array.from(new Set(data.map((item) => item.type))).map(
                (type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                )
              )}
            </Select>
            <Select
              style={{ width: 200 }}
              placeholder="เลือกอาชีพ"
              onChange={(value: string) => handleFilterChange(value, "job")}
            >
              {Array.from(new Set(data.map((item) => item.job))).map((job) => (
                <Option key={job} value={job}>
                  {job}
                </Option>
              ))}
            </Select>
          </Space>
        </Card>
        
        {isMobile ? (
          renderMobileView()
        ) : (
          <Card style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredData}
              loading={loading}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: filteredData.length,
                onChange: (page) => setCurrentPage(page),
              }}
              size="small"
              scroll={{ x: true }}
            />
          </Card>
        )}

        <Card style={{ marginTop: 20, boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
          <Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportCSV}
              size="small"
            >
              CSV
            </Button>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={handleExportExcel}
              size="small"
            >
              Excel
            </Button>
            <Button
              onClick={() => setSelectedRowKeys(filteredData.map((item) => item.id))}
              size="small"
            >
              เลือกทั้งหมด
            </Button>
            <Button onClick={() => setSelectedRowKeys([])} size="small">
              ยกเลิกทั้งหมด
            </Button>
          </Space>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default SoberCheersTable;