'use client'

import { ChevronDown } from 'lucide-react'

interface TopbarProps {
  title: string
  description?: string
  actionButton?: {
    label: string
    onClick: () => void
  }
  adAccountName?: string
}

export default function Topbar({ title, description, actionButton, adAccountName }: TopbarProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer">
            <option>{adAccountName || 'Hesap Seç'}</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            {actionButton.label}
          </button>
        )}
      </div>
    </div>
  )
}

