// app/dashboard/Buddhist2025/components/charts/monthlyExpenseSummary.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { getMonthlyExpenseSummaryData } from '../../actions/GetChartData';

interface ExpenseSummary {
  total: number;
  average: number;
  participantCount: number;
}

const MonthlyExpenseSummary: React.FC = () => {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getMonthlyExpenseSummaryData();
        if (result.success && result.data) {
          setSummary(result.data);
        }
      } catch (error) {
        console.error('Error fetching monthly expense summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-sm text-gray-500">ไม่พบข้อมูลค่าใช้จ่ายรายเดือน | No monthly expense data found</div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { 
      style: 'currency', 
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const campaignSavings = summary.total * 3;
  const annualSavings = summary.total * 12;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header Section */}


      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                รวมต่อเดือน | Total Monthly
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(summary.total)}
              </div>
              <div className="text-xs text-gray-600">
                รายจ่ายรวมทั้งหมด | Total Expenses
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                เฉลี่ยต่อคน | Average Per Person
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(summary.average)}
              </div>
              <div className="text-xs text-gray-600">
                ค่าใช้จ่ายเฉลี่ย | Average Expense
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-center">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                ผู้ให้ข้อมูล | Participants
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {summary.participantCount.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">
                คน | People
              </div>
            </div>
          </div>
        </div>

        {/* Savings Projection */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              การประหยัดที่คาดหวัง | Projected Savings
            </h3>
            <p className="text-sm text-gray-600">
              จำนวนเงินที่อาจประหยัดได้จากการงดแอลกอฮอล์ | Potential savings from alcohol abstinence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="text-center">
                <div className="text-sm font-medium text-orange-700 mb-3">
                  ช่วงเข้าพรรษา | Buddhist Lent Period
                </div>
                <div className="text-xs text-orange-600 mb-4">
                  3 เดือน | 3 Months
                </div>
                <div className="bg-white rounded-lg p-4 border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {formatCurrency(campaignSavings)}
                  </div>
                  <div className="text-sm text-orange-700">
                    ประหยัดได้ | Potential Savings
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="text-center">
                <div className="text-sm font-medium text-green-700 mb-3">
                  ตลอดปี | Annual Period
                </div>
                <div className="text-xs text-green-600 mb-4">
                  12 เดือน | 12 Months
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(annualSavings)}
                  </div>
                  <div className="text-sm text-green-700">
                    ประหยัดได้ | Annual Savings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Analysis */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              ประโยชน์เพิ่มเติม | Additional Benefits
            </h3>
            <p className="text-sm text-gray-600">
              ผลประโยชน์นอกเหนือจากการประหยัดเงิน | Benefits beyond monetary savings
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                title: "สุขภาพ | Health",
                description: "ปรับปรุงสุขภาพกายและใจ | Physical & mental health improvement"
              },
              { 
                title: "ครอบครัว | Family",
                description: "ความสัมพันธ์ที่ดีขึ้น | Improved relationships"
              },
              { 
                title: "การทำงาน | Work",
                description: "ประสิทธิภาพที่เพิ่มขึ้น | Enhanced productivity"
              },
              { 
                title: "สังคม | Social",
                description: "บทบาทที่ดีในสังคม | Better social role"
              }
            ].map((benefit, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-4 border border-gray-200 text-center"
              >
                <div className="text-sm font-medium text-gray-800 mb-2">
                  {benefit.title}
                </div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  {benefit.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Statement */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6 border border-gray-300 text-center">
          <h3 className="text-base font-semibold text-gray-800 mb-2">
            สรุปผล | Summary
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            การงดแอลกอฮอล์ในช่วงเข้าพรรษาไม่เพียงแต่ช่วยประหยัดค่าใช้จ่าย 
            แต่ยังส่งผลดีต่อสุขภาพ ครอบครัว และสังคมโดยรวม
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Abstaining from alcohol during Buddhist Lent not only saves money 
            but also benefits health, family, and society as a whole.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyExpenseSummary;