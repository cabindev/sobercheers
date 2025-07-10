// app/dashboard/organization/components/charts/AllChartsOrganization.tsx
// แก้ไข duplicate keys และเพิ่ม error handling + เปลี่ยน Organization Type เป็นแผนภูมิ
'use client'
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getOrganizationDashboardSummary, getOrganizationTypeChartData } from '../../actions/GetChartData';
import DashboardLoading from '../ui/DashboardLoading';
import OrganizationStats from './OrganizationStats';
import OrganizationCategoryChart from './OrganizationCategoryChart';
import ProvinceDistributionChart from './ProvinceDistributionChart';
import SignersChart from './SignersChart';
import SubmissionTrendChart from './SubmissionTrendChart';
import ImageCompletionChart from './ImageCompletionChart';
import MonthlySubmissionChart from './MonthlySubmissionChart';
import ContactStatsChart from './ContactStatsChart';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  children, 
  className = '', 
  description
}) => (
  <div className={`bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
    <div className="p-4 border-b border-gray-100">
      <h3 className="text-sm font-medium text-gray-800">{title}</h3>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
    <div className="p-0">
      {children}
    </div>
  </div>
);

// Organization Type Chart Component
const OrganizationTypeChart: React.FC = () => {
  const [typeData, setTypeData] = useState<Array<{ name: string; value: number }>>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getOrganizationTypeChartData();
        if (result.success && result.data) {
          setTypeData(result.data);
          setTotalCount(result.data.reduce((sum, item) => sum + item.value, 0));
        }
      } catch (error) {
        console.error('Error fetching organization type data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border border-green-200 border-t-green-500"></div>
        <span className="ml-2 text-xs text-gray-500">กำลังโหลด...</span>
      </div>
    );
  }

  if (!typeData.length) {
    return <div className="text-center text-xs text-gray-500 py-8">ไม่พบข้อมูลประเภทองค์กร</div>;
  }

  const option = {
    title: {
      text: 'ประเภทองค์กร',
      left: 'center',
      textStyle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4B5563'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'white',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: {
        fontSize: 11,
        color: '#374151'
      },
      formatter: (params: any) => {
        const percentage = ((params.value / totalCount) * 100).toFixed(1);
        return `${params.name}: ${params.value.toLocaleString()} องค์กร (${percentage}%)`;
      }
    },
    series: [
      {
        name: 'ประเภทองค์กร',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '55%'],
        data: typeData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: ['#10B981', '#34D399', '#6EE7B7', '#059669', '#047857'][index % 5] // Green gradient tones
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 8,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.1)'
          }
        },
        label: {
          show: true,
          formatter: (params: any) => {
            const percentage = ((params.value / totalCount) * 100).toFixed(1);
            const shortName = params.name.length > 8 ? 
              `${params.name.substring(0, 6)}...` : params.name;
            return `${shortName}\n${percentage}%`;
          },
          fontSize: 9,
          fontWeight: '400',
          color: '#4B5563'
        }
      }
    ]
  };

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="flex-1">
        <ReactECharts
          option={option}
          style={{ height: '240px', width: '100%' }}
        />
      </div>
      
      <div className="mt-3 space-y-1.5">
        {typeData.map((item, index) => {
          const colors = ['#10B981', '#34D399', '#6EE7B7', '#059669', '#047857'];
          const bgColors = ['bg-green-50', 'bg-green-100', 'bg-green-50', 'bg-green-100', 'bg-green-50'];
          const textColors = ['text-green-700', 'text-green-800', 'text-green-700', 'text-green-800', 'text-green-700'];
          
          const color = colors[index % colors.length];
          const bgColor = bgColors[index % bgColors.length];
          const textColor = textColors[index % textColors.length];
          const percentage = ((item.value / totalCount) * 100).toFixed(1);
          
          // สร้าง unique key เพื่อป้องกัน duplicate keys
          const uniqueKey = `type-${item.name}-${index}-${item.value}`;
          
          return (
            <div key={uniqueKey} className={`flex items-center justify-between py-1.5 px-2 rounded ${bgColor} hover:opacity-80 transition-opacity`}>
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className={`text-xs font-normal ${textColor} truncate`} title={item.name}>
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <div className={`text-xs font-medium ${textColor}`}>{item.value.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DashboardOrganization: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const result = await getOrganizationDashboardSummary();
        if (result.success && result.data) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (isLoading || !dashboardData) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Organization Dashboard 2025
            </h1>
            <p className="text-sm text-gray-600">
              แดชบอร์ดติดตามและวิเคราะห์ข้อมูลองค์กรที่เข้าร่วมระบบ | Dashboard for tracking and analyzing participating organizations
            </p>
          </div>

          {/* Summary Stats */}
          <div className="mb-8">
            <OrganizationStats />
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <ChartCard
              title="การกระจายตามจังหวัด | Provincial Distribution"
              description="แสดงการกระจายองค์กรตามจังหวัดต่างๆ | Distribution of organizations by provinces"
            >
              <ProvinceDistributionChart />
            </ChartCard>
            
            <ChartCard
              title="ประเภทองค์กร | Organization Types"
              description="แสดงการแบ่งตามประเภทองค์กร | Distribution by organization types"
            >
              <OrganizationTypeChart />
            </ChartCard>
            
            <ChartCard 
              title="หมวดหมู่องค์กร | Organization Categories"
              description="สัดส่วนองค์กรแยกตามหมวดหมู่ | Organization ratio by categories"
            >
              <OrganizationCategoryChart />
            </ChartCard>
          </div>

          {/* Signers and Submissions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard 
              title="จำนวนผู้ลงนาม | Number of Signers"
              description="การกระจายตามจำนวนผู้ลงนามในแต่ละองค์กร | Distribution by number of signers per organization"
            >
              <SignersChart />
            </ChartCard>
            
            <ChartCard 
              title="แนวโน้มการส่งข้อมูล | Submission Trends"
              description="แนวโน้มการส่งข้อมูลขององค์กรในช่วง 30 วันล่าสุด | Organization submission trends in the last 30 days"
            >
              <SubmissionTrendChart />
            </ChartCard>
          </div>

          {/* Data Quality Section */}
          <div className="mb-6">
            <div className="text-center mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                คุณภาพข้อมูล | Data Quality
              </h2>
              <p className="text-xs text-gray-600">
                สถิติและการวิเคราะห์คุณภาพข้อมูลขององค์กร | Statistics and analysis of organization data quality
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard 
                title="ความครบถ้วนของรูปภาพ | Image Completeness"
                description="สถิติความครบถ้วนของรูปภาพที่แนบมากับข้อมูลองค์กร | Statistics of image completeness in organization data"
              >
                <ImageCompletionChart />
              </ChartCard>
              
              <ChartCard 
                title="สถิติข้อมูลติดต่อ | Contact Information Stats"
                description="ความครบถ้วนของข้อมูลติดต่อขององค์กร | Completeness of organization contact information"
              >
                <ContactStatsChart />
              </ChartCard>
            </div>
          </div>

          {/* Temporal Analysis */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                การวิเคราะห์ตามเวลา | Temporal Analysis
              </h2>
              <p className="text-xs text-gray-600">
                แนวโน้มและรูปแบบการส่งข้อมูลขององค์กรตามช่วงเวลา | Trends and patterns of organization data submission over time
              </p>
            </div>
            
            <ChartCard 
              title="การส่งข้อมูลรายเดือน | Monthly Submissions"
              description="สถิติการส่งข้อมูลขององค์กรแบ่งตามเดือน | Monthly statistics of organization data submissions"
              className="w-full"
            >
              <MonthlySubmissionChart />
            </ChartCard>
          </div>

          {/* Additional Statistics */}
          <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                สถิติเพิ่มเติม | Additional Statistics
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  key: 'complete-images',
                  value: dashboardData.organizationsWithCompleteImages,
                  label1: 'องค์กรที่มีรูปครบ',
                  label2: 'Organizations with Complete Images'
                },
                {
                  key: 'recent-registrations', 
                  value: dashboardData.recentOrganizations,
                  label1: 'ลงทะเบียนใหม่',
                  label2: 'Recent Registrations (7 days)'
                },
                {
                  key: 'completeness-rate',
                  value: `${((dashboardData.organizationsWithCompleteImages / dashboardData.totalOrganizations) * 100).toFixed(1)}%`,
                  label1: 'อัตราความครบถ้วน',
                  label2: 'Completeness Rate'
                },
                {
                  key: 'avg-signers',
                  value: dashboardData.avgSignersPerOrganization,
                  label1: 'เฉลี่ยผู้ลงนาม',
                  label2: 'Average Signers per Org'
                }
              ].map((stat) => (
                <div key={stat.key} className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-semibold text-green-600 mb-1">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </div>
                  <div className="text-xs text-green-700 mb-1">{stat.label1}</div>
                  <div className="text-xs text-gray-500">{stat.label2}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Insights */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                สรุปข้อมูลสำคัญ | Key Insights
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-800 mb-2">📊 ภาพรวมองค์กร</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• มีองค์กรลงทะเบียนทั้งหมด {dashboardData.totalOrganizations.toLocaleString()} องค์กร</li>
                  <li>• กระจายตัวใน {dashboardData.totalProvinces} จังหวัด</li>
                  <li>• มีผู้ลงนามรวม {dashboardData.totalSigners.toLocaleString()} คน</li>
                  <li>• เฉลี่ย {dashboardData.avgSignersPerOrganization} คนต่อองค์กร</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-800 mb-2">📈 แนวโน้มและคุณภาพ</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• มีองค์กรลงทะเบียนใหม่ {dashboardData.recentOrganizations} องค์กรใน 7 วันล่าสุด</li>
                  <li>• อัตราความครบถ้วนของรูปภาพ {((dashboardData.organizationsWithCompleteImages / dashboardData.totalOrganizations) * 100).toFixed(1)}%</li>
                  <li>• มีหมวดหมู่องค์กรที่เปิดใช้งาน {dashboardData.totalCategories} ประเภท</li>
                  <li>• ข้อมูลมีการอัพเดทอย่างต่อเนื่อง</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-6 border-t border-gray-200 bg-white rounded-lg mt-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">
                Organization Dashboard 2025
              </p>
              <p className="text-xs text-gray-500">
                พัฒนาเพื่อติดตามข้อมูลองค์กร ประจำปี พ.ศ. 2568 | Developed for Organization Data Tracking 2025
              </p>
              <p className="text-xs text-gray-400">
                ข้อมูลอัพเดทล่าสุด | Last Updated: {new Date().toLocaleDateString('th-TH')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOrganization;