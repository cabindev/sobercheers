'use client'

import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface OrganizationTypeData {
  type: string
  count: number
  percentage: number
}

interface OrganizationTypeChartProps {
  data: OrganizationTypeData[]
}

export default function OrganizationTypeChart({ data }: OrganizationTypeChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current)

    const option: echarts.EChartsOption = {
      title: {
        text: 'ประเภทอาชีพ/องค์กร',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#92400e'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `<div class="bg-white p-2 rounded shadow border text-sm">
            <div class="font-medium text-amber-800">${params.name}</div>
            <div class="text-gray-600 text-xs">จำนวน: ${params.value.toLocaleString('th-TH')} คน</div>
            <div class="text-gray-600 text-xs">สัดส่วน: ${params.percent}%</div>
          </div>`
        }
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        bottom: 0,
        textStyle: {
          fontSize: 9,
          color: '#6b7280'
        }
      },
      series: [
        {
          name: 'ประเภทอาชีพ',
          type: 'pie',
          radius: ['40%', '75%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 1
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'normal',
              color: '#92400e',
              formatter: '{b}\n{c} คน'
            },
            itemStyle: {
              shadowBlur: 6,
              shadowOffsetX: 0,
              shadowColor: 'rgba(146, 64, 14, 0.2)'
            }
          },
          labelLine: {
            show: false
          },
          data: data.map((item, index) => ({
            value: item.count,
            name: item.type,
            itemStyle: {
              color: `hsl(${45 + index * 12}, 68%, ${55 + (index % 5) * 5}%)`
            }
          }))
        }
      ]
    }

    chartInstance.current.setOption(option as any)

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
    }
  }, [data])

  const totalCount = data.reduce((sum, item) => sum + item.count, 0)
  const topTypes = data.slice(0, 3)

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
      <div 
        ref={chartRef} 
        className="w-full h-72"
      />
      
      {/* Top types list */}
      <div className="mt-3 pt-3 border-t border-amber-50">
        <h4 className="text-xs font-medium text-amber-800 mb-2">
          อาชีพ/องค์กรที่พบมากที่สุด
        </h4>
        <div className="grid grid-cols-1 gap-1">
          {topTypes.map((item, index) => (
            <div key={item.type} className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <div 
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: `hsl(${45 + index * 12}, 68%, ${55 + (index % 5) * 5}%)` }}
                />
                <span className="text-gray-700 font-light">{item.type}</span>
              </div>
              <div className="text-amber-700 font-light">
                {item.count.toLocaleString('th-TH')} ({item.percentage}%)
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-2 pt-2 border-t border-amber-50">
          <div className="text-center">
            <p className="text-xs text-gray-500 font-light">รวมทั้งหมด</p>
            <p className="text-sm font-light text-amber-800">
              {totalCount.toLocaleString('th-TH')} คน
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}