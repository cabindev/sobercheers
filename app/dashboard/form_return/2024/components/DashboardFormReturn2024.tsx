'use client'

import React, { useEffect, useState } from 'react'
import { getFormReturn2024ChartData, FormReturn2024ChartData } from '../actions/GetChartData2024'
import StatsCard from '../../components/charts/StatsCard'
import ProvinceChart from '../../components/charts/ProvinceChart'
import RegionChart from '../../components/charts/RegionChart'
import TypeChart from '../../components/charts/TypeChart'
import MonthlyChart from '../../components/charts/MonthlyChart'

export default function DashboardFormReturn2024() {
  const [data, setData] = useState<FormReturn2024ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getFormReturn2024ChartData()
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
      <div className="p-8 space-y-8 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-100/30 min-h-screen">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-emerald-800 tracking-tight">
              Dashboard Form Return 2024
            </h1>
            <p className="text-sm text-emerald-600/70 mt-1">
              ภาพรวมข้อมูลการคืนฟอร์มปี 2024
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse ring-1 ring-emerald-100/50">
              <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-1.5 mb-4"></div>
              <div className="h-4 bg-emerald-100 rounded w-3/4 mb-3"></div>
              <div className="h-8 bg-emerald-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse ring-1 ring-emerald-100/50">
              <div className="h-5 bg-emerald-100 rounded w-1/3 mb-4"></div>
              <div className="h-48 bg-emerald-50 rounded-lg"></div>
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
            type="button"
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
    <div className="p-8 space-y-8 bg-gradient-to-br from-orange-50/40 via-white to-orange-100/30 min-h-screen">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-orange-800 tracking-tight">
            Dashboard Form Return 2024
          </h1>
          <p className="text-sm text-orange-600/70 mt-1">
            ภาพรวมข้อมูลการคืนฟอร์มปี 2024
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-full">
            อัพเดทล่าสุด: {new Date().toLocaleDateString('th-TH')}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="ฟอร์มทั้งหมด"
          value={data.stats.totalForms}
          icon="📋"
          color="emerald"
        />
        <StatsCard
          title="จำนวนองค์กร"
          value={data.stats.totalOrganizations}
          icon="🏢"
          color="emerald"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <ProvinceChart data={data.provinceData} />
        <RegionChart data={data.provinceData} />
        <TypeChart data={data.typeData} />
        <MonthlyChart data={data.monthlyData} />
      </div>
    </div>
  )
}