'use client'

import React from 'react'

interface StatsCardProps {
  title: string
  value: number
  icon: string
  color: 'yellow'
  trend?: number
}

export default function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('th-TH').format(num)
  }

  const colorClasses = {
    yellow: {
      bg: 'bg-gradient-to-r from-amber-400 to-yellow-500',
      border: 'border-amber-200',
      text: 'text-amber-700',
      icon: 'bg-amber-50'
    }
  }

  const currentColor = colorClasses[color]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-amber-100 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className={`${currentColor.bg} h-1`}></div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={`${currentColor.icon} w-8 h-8 rounded-full flex items-center justify-center text-sm`}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center text-xs font-light ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-400'
            }`}>
              {trend > 0 && '↗'}
              {trend < 0 && '↘'}
              {trend === 0 && '→'}
              <span className="ml-1">{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-gray-500 text-xs font-light">{title}</p>
          <p className={`text-xl font-light ${currentColor.text}`}>
            {formatNumber(value)}
          </p>
        </div>

        {trend !== undefined && (
          <div className="mt-3 pt-3 border-t border-amber-50">
            <p className="text-xs text-gray-400 font-light">
              {trend > 0 ? 'เพิ่มขึ้น' : trend < 0 ? 'ลดลง' : 'ไม่เปลี่ยนแปลง'} จากเดือนที่แล้ว
            </p>
          </div>
        )}
      </div>
    </div>
  )
}