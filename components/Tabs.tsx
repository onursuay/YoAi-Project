'use client'

interface TabsProps {
  tabs: { id: string; label: string }[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-2 py-2 rounded-t-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 text-center text-sm font-medium px-3 py-2 rounded-lg transition ${
            activeTab === tab.id
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

