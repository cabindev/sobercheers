import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ExpenseSummary {
  total: number;
  average: number;
  participantCount: number;
}

const MonthlyExpenseSummary: React.FC = () => {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/soberCheersCharts');
        const { monthlyExpenseSummary } = response.data;
        setSummary(monthlyExpenseSummary);
      } catch (error) {
        console.error('Error fetching monthly expense data:', error);
      }
    };

    fetchData();
  }, []);

  if (!summary) {
    return <div>Loading...</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  const campaignSavings = summary.total * 3; // 3 เดือนของแคมเปญ
  const annualSavings = summary.total * 12; // 1 ปีเต็ม

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>สรุปค่าใช้จ่ายรายเดือนในการดื่มแอลกอฮอล์</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', margin: '10px' }}>
          <h3>ยอดรวมทั้งหมด</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6384' }}>{formatCurrency(summary.total)}</p>
        </div>
        <div style={{ textAlign: 'center', margin: '10px' }}>
          <h3>ค่าเฉลี่ยต่อคน</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#36A2EB' }}>{formatCurrency(summary.average)}</p>
        </div>
      </div>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        จำนวนผู้ให้ข้อมูล: {summary.participantCount} คน
      </p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '5px' }}>
        <h3>ข้อมูลน่าสนใจ :</h3>
        <p>หากทุกคนเลิกดื่ม 3 เดือนช่วงเข้าพรรษานี้ จะประหยัดเงินได้ {formatCurrency(campaignSavings)}</p>
        <p>และหากทุกคนเลิกดื่มต่อเนื่อง จะประหยัดได้ {formatCurrency(annualSavings)} ต่อปี</p>
      </div>
    </div>
  );
};

export default MonthlyExpenseSummary;