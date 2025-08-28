'use client'

import React from 'react'

interface StatsCardProps {
  title: string
  value: number
  icon: string
  color: 'yellow' | 'orange' | 'emerald'
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
    },
    orange: {
      bg: 'bg-gradient-to-r from-orange-400 to-orange-500',
      border: 'border-orange-200',
      text: 'text-orange-700',
      icon: 'bg-orange-50'
    },
    emerald: {
      bg: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      icon: 'bg-emerald-50'
    }
  }

  const currentColor = colorClasses[color]

  return (
    <div className={`bg-white rounded-xl shadow-sm border-0 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${color === 'orange' ? 'ring-1 ring-orange-100/50' : color === 'emerald' ? 'ring-1 ring-emerald-100/50' : 'ring-1 ring-amber-100/50'}`}>
      <div className={`${currentColor.bg} h-1.5`}></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`${currentColor.icon} w-10 h-10 rounded-xl flex items-center justify-center text-base shadow-sm`}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              trend > 0 ? 'text-green-700 bg-green-50' : trend < 0 ? 'text-red-700 bg-red-50' : 'text-gray-500 bg-gray-50'
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
          <p className={`text-2xl font-semibold ${currentColor.text} tracking-tight`}>
            {formatNumber(value)}
          </p>
        </div>

        {trend !== undefined && (
          <div className={`mt-4 pt-4 border-t ${color === 'orange' ? 'border-orange-100/60' : 'border-amber-100/60'}`}>
            <p className="text-xs text-gray-500 font-medium">
              {trend > 0 ? 'เพิ่มขึ้น' : trend < 0 ? 'ลดลง' : 'ไม่เปลี่ยนแปลง'} จากเดือนที่แล้ว
            </p>
          </div>
        )}
      </div>
    </div>
  )
}