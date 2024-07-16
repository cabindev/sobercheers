'use client';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import { Card, Col, Row } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';

const SignerCount: NextPage = () => {
  const [sumSigners, setSumSigners] = useState<number | null>(null);

  useEffect(() => {
    const fetchSumSigners = async () => {
      try {
        const res = await axios.get('/api/form_return?sumSigners=true');
        setSumSigners(res.data.sumSigners);
      } catch (error) {
        console.error('Error fetching sum of signers:', error);
      }
    };

    fetchSumSigners();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card bordered={false} style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', backgroundColor: '#FAF5FF', borderRadius: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <UsergroupAddOutlined style={{ fontSize: '48px', color: '#9D4EDD', marginBottom: '16px' }} />
              <div style={{ fontSize: '20px', color: '#7C3AED' }}>ยอดรวมคนเข้าร่วม : คืนข้อมูลเข้าพรรษา</div>
              <div style={{ fontSize: '36px', color: '#000' }}>
                {sumSigners !== null ? `${sumSigners.toLocaleString()} คน` : 'Loading...'}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SignerCount;
