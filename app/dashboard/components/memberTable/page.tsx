'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Select, Button, Space, Typography, Card, Row, Col, Checkbox, ConfigProvider } from 'antd';
import { DownloadOutlined, FileExcelOutlined, SearchOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Option } = Select;
const { Title, Text } = Typography;

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
  phone: string;
  job: string;
  alcoholConsumption: string;
  drinkingFrequency: string;
  intentPeriod: string;
  monthlyExpense: number;
  motivations: string;
  healthImpact: string;
}

const MemberTable: React.FC = () => {
  const [data, setData] = useState<SoberCheersItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const theme = {
    token: {
      colorPrimary: '#f59e0b',
      fontSize: 12,
    },
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, pageSize, search, selectedType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/campaign-buddhist-lent', {
        params: {
          page,
          limit: pageSize,
          search,
          type: selectedType,
        },
      });
      setData(response.data.campaigns);
      setTotalItems(response.data.totalItems);
      setTypes(Array.from(new Set(response.data.campaigns.map((item: SoberCheersItem) => item.type))));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setPage(1);
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
    { title: 'แรงจูงใจในการเลิกดื่ม', dataIndex: 'motivations' },
  ];

  const handleExportCSV = () => {
    const dataToExport = selectedRowKeys.length > 0 
      ? data.filter(item => selectedRowKeys.includes(item.id))
      : data;
  
    const csvContent = [
      columns.map(col => col.title).join(';'),
      ...dataToExport.map(item => 
        columns.map(col => {
          let value = col.dataIndex ? item[col.dataIndex as keyof SoberCheersItem] : '';
          if (col.render) {
            value = col.render(value, item);
          }
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(';')
      )
    ].join('\r\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
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
      ? data.filter(item => selectedRowKeys.includes(item.id))
      : data;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(item => {
      return columns.reduce((acc, col) => {
        let value = col.dataIndex ? item[col.dataIndex as keyof SoberCheersItem] : '';
        if (col.render) {
          value = col.render(value, item);
        }
        acc[col.title] = value;
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
      <Text style={{ fontSize: '12px' }}><strong>แรงจูงใจในการเลิกดื่ม:</strong> {item.motivations}</Text>
    </Card>
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <ConfigProvider theme={theme}>
      <div style={{ padding: "20px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
        <Card style={{ marginBottom: 20, boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
          <Title level={3} style={{ color: "#f59e0b", marginBottom: 20, fontSize: "18px" }}>
            ข้อมูล Sober Cheers
          </Title>
          <Space style={{ marginBottom: 16 }} wrap>
            <Input
              placeholder="ค้นหาด้วยชื่อ"
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Select
              style={{ width: 200 }}
              placeholder="เลือกภาค"
              onChange={handleTypeChange}
              value={selectedType}
            >
              <Option value="">ทั้งหมด</Option>
              {types.map((type) => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Space>
        </Card>
        
        {isMobile ? (
          <Row gutter={[16, 16]}>
            {data.map((item) => (
              <Col xs={24} sm={12} md={8} key={item.id}>
                {renderMobileCard(item)}
              </Col>
            ))}
          </Row>
        ) : (
          <Card style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              loading={loading}
              rowKey="id"
              pagination={{
                total: totalItems,
                current: page,
                pageSize: pageSize,
                onChange: (page, pageSize) => {
                  setPage(page);
                  setPageSize(pageSize);
                },
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `รวม ${total} รายการ`,
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
              onClick={() => setSelectedRowKeys(data.map((item) => item.id))}
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

export default MemberTable;