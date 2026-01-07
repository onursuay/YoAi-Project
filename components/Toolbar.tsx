'use client'

import { useState } from 'react'
import { RefreshCw, Edit, Trash2, Search, Calendar, Eye, EyeOff } from 'lucide-react'

interface ToolbarProps {
  showGraphFilter?: boolean
  onDateChange?: (startDate: string, endDate: string, preset?: string) => void
  onShowInactiveChange?: (show: boolean) => void
  onSearch?: (query: string) => void
  showInactive?: boolean
  searchQuery?: string
}

export default function Toolbar({ 
  showGraphFilter = false,
  onDateChange,
  onShowInactiveChange,
  onSearch,
  showInactive = false,
  searchQuery = ''
}: ToolbarProps) {
  const [datePreset, setDatePreset] = useState<string>('last_30d')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)

  const handlePresetChange = (preset: string) => {
    setDatePreset(preset)
    setShowCustomDatePicker(preset === 'custom')
    
    if (preset !== 'custom' && onDateChange) {
      const today = new Date()
      let startDate = ''
      let endDate = today.toISOString().split('T')[0]

      switch (preset) {
        case 'today':
          startDate = endDate
          break
        case 'yesterday':
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          startDate = endDate = yesterday.toISOString().split('T')[0]
          break
        case 'last_7d':
          const last7d = new Date(today)
          last7d.setDate(last7d.getDate() - 7)
          startDate = last7d.toISOString().split('T')[0]
          break
        case 'last_30d':
          const last30d = new Date(today)
          last30d.setDate(last30d.getDate() - 30)
          startDate = last30d.toISOString().split('T')[0]
          break
        case 'this_month':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
          break
        case 'last_month':
          const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
          startDate = lastMonth.toISOString().split('T')[0]
          endDate = lastMonthEnd.toISOString().split('T')[0]
          break
      }

      onDateChange(startDate, endDate, preset)
    }
  }

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate && onDateChange) {
      onDateChange(customStartDate, customEndDate, 'custom')
    }
  }

  const formatDateRange = () => {
    if (datePreset === 'custom' && customStartDate && customEndDate) {
      const start = new Date(customStartDate)
      const end = new Date(customEndDate)
      const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
      return `${start.getDate().toString().padStart(2, '0')} ${months[start.getMonth()]} ${start.getFullYear()} - ${end.getDate().toString().padStart(2, '0')} ${months[end.getMonth()]} ${end.getFullYear()}`
    }
    
    const today = new Date()
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
    
    switch (datePreset) {
      case 'today':
        return `${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`
      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        return `${yesterday.getDate().toString().padStart(2, '0')} ${months[yesterday.getMonth()]} ${yesterday.getFullYear()}`
      case 'last_7d':
        const last7d = new Date(today)
        last7d.setDate(last7d.getDate() - 7)
        return `${last7d.getDate().toString().padStart(2, '0')} ${months[last7d.getMonth()]} - ${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]}`
      case 'last_30d':
        const last30d = new Date(today)
        last30d.setDate(last30d.getDate() - 30)
        return `${last30d.getDate().toString().padStart(2, '0')} ${months[last30d.getMonth()]} - ${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]}`
      case 'this_month':
        return `01 ${months[today.getMonth()]} - ${today.getDate().toString().padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`
      case 'last_month':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
        return `01 ${months[lastMonth.getMonth()]} - ${lastMonthEnd.getDate().toString().padStart(2, '0')} ${months[lastMonthEnd.getMonth()]} ${lastMonthEnd.getFullYear()}`
      default:
        return 'Tarih Seç'
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Edit className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="İsim veya id ile ara..."
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button
          onClick={() => {
            const newValue = !showInactive
            onShowInactiveChange?.(newValue)
          }}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            showInactive
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {showInactive ? <Eye className="w-4 h-4 inline mr-1" /> : <EyeOff className="w-4 h-4 inline mr-1" />}
          Pasifleri Göster
        </button>
        <div className="relative">
          <select
            value={datePreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
          >
            <option value="today">Bugün</option>
            <option value="yesterday">Dün</option>
            <option value="last_7d">Son 7 Gün</option>
            <option value="last_30d">Son 30 Gün</option>
            <option value="this_month">Bu Ay</option>
            <option value="last_month">Geçen Ay</option>
            <option value="custom">Özel Tarih</option>
          </select>
          <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
        {showCustomDatePicker && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button
              onClick={handleCustomDateChange}
              className="px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Uygula
            </button>
          </div>
        )}
        {!showCustomDatePicker && (
          <div className="text-sm text-gray-600 min-w-[150px]">
            {formatDateRange()}
          </div>
        )}
        {showGraphFilter && (
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer">
              <option>Grafik Filtreleme</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

