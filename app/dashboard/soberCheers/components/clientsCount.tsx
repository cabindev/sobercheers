'use client';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import { Card, Col, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const ClientCount: NextPage = () => {
  const [clientsCount, setClientsCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchClientsCount = async () => {
      try {
        const res = await axios.get('/api/form_return?count=true');
        setClientsCount(res.data.totalForms);
      } catch (error) {
        console.error('Error fetching clients count:', error);
      }
    };

    fetchClientsCount();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', backgroundColor: '#FFFBEA', borderRadius: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <UserOutlined style={{ fontSize: '48px', color: '#F59E0B', marginBottom: '16px' }} />
              <div style={{ fontSize: '20px', color: '#D97706' }}>องค์กร : คืนข้อมูลเข้าพรรษา</div>
              <div style={{ fontSize: '36px', color: '#000' }}>
                {clientsCount !== null ? `${clientsCount.toLocaleString()} หน่วยงาน` : 'Loading...'}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClientCount;
