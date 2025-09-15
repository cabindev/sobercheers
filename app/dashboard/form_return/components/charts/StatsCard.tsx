//dashboard/form_return/components/charts/StatsCard.tsx
'use client'

import React from 'react'

interface StatsCardProps {
  title: string
  value: number
  icon: string
  colorClass?: string
  trend?: number
}

export default function StatsCard({ title, value, icon, colorClass = 'text-amber-500', trend }: StatsCardProps) {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('th-TH').format(num)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border-0 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ring-1 ring-amber-100/50">

      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base shadow-sm">
            {icon}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              trend > 0 ? 'text-amber-800' : trend < 0 ? 'text-red-800' : 'text-gray-500'
            }`}>
              {trend > 0 && '↗'}
              {trend < 0 && '↘'}
              {trend === 0 && '→'}
              <span className="ml-1">{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-gray-500 text-sm font-medium tracking-wide">{title}</p>
          <p className={`text-2xl font-semibold ${colorClass} tracking-tight`}>
            {formatNumber(value)}
          </p>
        </div>

        {trend !== undefined && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 font-medium">
              {trend > 0 ? 'เพิ่มขึ้น' : trend < 0 ? 'ลดลง' : 'ไม่เปลี่ยนแปลง'} จากเดือนที่แล้ว
            </p>
          </div>
        )}
      </div>
    </div>
  )
}