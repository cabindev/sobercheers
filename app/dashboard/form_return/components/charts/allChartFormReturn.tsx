'use client'

import React, { useEffect, useState } from 'react'
import { getFormReturnChartData, FormReturnChartData } from '../../actions/GetChartData'
import StatsCard from './StatsCard'
import ProvinceChart from './ProvinceChart'
import TypeChart from './TypeChart'
import MonthlyChart from './MonthlyChart'

export default function DashboardFormReturn() {
  const [data, setData] = useState<FormReturnChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getFormReturnChartData()
        setData(result)
        setError(null)
      } catch (err) {
        console.error('Error fetching chart data:', err)
        setError('ไม่สามารถโหลดข้อมูลได้')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-light text-amber-800">
            Dashboard การคืนข้อมูลงดเหล้าเข้าพรรษา
          </h1>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 text-sm font-light">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm font-light rounded hover:bg-red-700 transition-colors"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-amber-50/30 via-white to-yellow-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-light text-amber-800">
          Dashboard การคืนข้อมูลงดเหล้าเข้าพรรษา
        </h1>
        <div className="text-xs text-amber-600 font-light">
          อัพเดทล่าสุด: {new Date().toLocaleDateString('th-TH')}
        </div>
      </div>

      {/* Stats 2024 */}
      <div className="mb-6">
        <h2 className="text-md font-light text-amber-800 mb-3">สถิติปี 2024</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="ฟอร์มทั้งหมด"
            value={data.stats2024.totalForms}
            icon="📋"
            color="yellow"
          />
          <StatsCard
            title="จำนวนองค์กร"
            value={data.stats2024.totalOrganizations}
            icon="🏢"
            color="yellow"
          />
          <StatsCard
            title="รวมทั้งหมด"
            value={data.stats2024.totalForms + data.stats2025.totalForms}
            icon="📈"
            color="yellow"
          />
        </div>
      </div>

      {/* Stats 2025 */}
      <div className="mb-6">
        <h2 className="text-md font-light text-amber-800 mb-3">สถิติปี 2025</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="ฟอร์มทั้งหมด"
            value={data.stats2025.totalForms}
            icon="📋"
            color="yellow"
            trend={data.stats2025.monthlyGrowth}
          />
          <StatsCard
            title="จำนวนองค์กร"
            value={data.stats2025.totalOrganizations}
            icon="🏢"
            color="yellow"
          />
          <StatsCard
            title="แนวโน้มรายเดือน"
            value={data.stats2025.monthlyGrowth}
            icon="📊"
            color="yellow"
            trend={data.stats2025.monthlyGrowth}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProvinceChart data={data.provinceData} />
        <TypeChart data={data.typeData} />
        <MonthlyChart data={data.monthlyData} />
      </div>
    </div>
  )
}