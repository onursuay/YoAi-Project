'use client'

interface TabsProps {
  tabs: { id: string; label: string }[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex gap-6 border-b border-gray-200 px-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === tab.id
              ? 'text-green-600 border-b-2 border-green-500'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

