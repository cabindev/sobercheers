// app/soberCheersCharts/totalCount/page.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const TotalCount: React.FC = () => {
  const [totalRegistered, setTotalRegistered] = useState(0);

  const fetchTotalRegistered = async () => {
    try {
      const response = await axios.get('/api/soberCheersCharts/totalCount');
      setTotalRegistered(response.data.totalCount);
    } catch (error) {
      console.error('Error fetching total registered:', error);
    }
  };

  useEffect(() => {
    fetchTotalRegistered();

    // Set up an interval to fetch data every minute (adjust as needed)
    const intervalId = setInterval(fetchTotalRegistered, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', backgroundColor: '#E2F3E4', borderRadius: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <UserOutlined style={{ fontSize: '48px', color: '#f58220', marginBottom: '16px' }} />
              <div style={{ fontSize: '20px', color: '#595959' }}>จำนวนผู้ลงทะเบียน</div>
              <div style={{ fontSize: '36px', color: '#000' }}>{totalRegistered}</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TotalCount;