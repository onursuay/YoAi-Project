'use client'

interface MiniChartProps {
  data: number[]
  color: 'red' | 'green'
}

export default function MiniChart({ data, color }: MiniChartProps) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="100%" height="40" viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-10">
      <polyline
        points={points}
        fill="none"
        stroke={color === 'red' ? '#EF4444' : '#10B981'}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
