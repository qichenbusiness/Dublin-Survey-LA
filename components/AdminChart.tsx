import React from 'react'

interface ChartData {
  label: string
  count: number
}

interface AdminChartProps {
  data: ChartData[]
  title: string
}

export default function AdminChart({ data, title }: AdminChartProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-navy mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item) => {
          const percentage = (item.count / maxCount) * 100
          return (
            <div key={item.label} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-gray-700">
                {item.label}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                <div
                  className="h-full bg-navy rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold">
                    {item.count > 0 && item.count}
                  </span>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-medium text-gray-700">
                {item.count}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}