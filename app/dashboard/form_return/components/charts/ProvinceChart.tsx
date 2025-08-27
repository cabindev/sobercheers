'use client'

import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface ProvinceData {
  province: string
  count: number
  percentage: number
}

interface ProvinceChartProps {
  data: ProvinceData[]
}

export default function ProvinceChart({ data }: ProvinceChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data.length) return

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current)

    const option: echarts.EChartsOption = {
      title: {
        text: 'การกระจายตามจังหวัด',
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
            <div class="text-gray-600 text-xs">จำนวน: ${params.value.toLocaleString('th-TH')} ฟอร์ม</div>
            <div class="text-gray-600 text-xs">สัดส่วน: ${params.percent}%</div>
          </div>`
        }
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        bottom: 0,
        textStyle: {
          fontSize: 10,
          color: '#6b7280'
        }
      },
      series: [
        {
          name: 'จังหวัด',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 1
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'normal',
              color: '#92400e'
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
          data: data.slice(0, 15).map((item, index) => ({
            value: item.count,
            name: item.province,
            itemStyle: {
              color: `hsl(${45 + index * 8}, 65%, ${60 + index * 2}%)`
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

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
      <div 
        ref={chartRef} 
        className="w-full h-72"
      />
      
      {/* Top provinces list */}
      <div className="mt-3 pt-3 border-t border-amber-50">
        <h4 className="text-xs font-medium text-amber-800 mb-2">
          จังหวัดที่มีการส่งฟอร์มมากที่สุด
        </h4>
        <div className="grid grid-cols-1 gap-1">
          {data.slice(0, 5).map((item, index) => (
            <div key={item.province} className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <div 
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: `hsl(${45 + index * 8}, 65%, ${60 + index * 2}%)` }}
                />
                <span className="text-gray-700 font-light">{item.province}</span>
              </div>
              <div className="text-amber-700 font-light">
                {item.count.toLocaleString('th-TH')} ({item.percentage}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}