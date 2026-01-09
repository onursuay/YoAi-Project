'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems } from '@/lib/nav'
import { Bell, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function SidebarNav() {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<string[]>(['reklam'])

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return pathname === href
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="text-2xl font-bold text-gray-900">YoAI</div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          if (item.children) {
            const isOpen = openGroups.includes(item.id)
            return (
              <div key={item.id}>
                <button
                  onClick={() => toggleGroup(item.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href || '#'}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActive(child.href)
                            ? 'bg-primary/10 text-primary font-medium'
                            : child.disabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className={`w-1 h-5 rounded-full ${
                            isActive(child.href) ? 'bg-primary' : ''
                          }`}
                        />
                        {child.iconPath ? (
                          <img
                            src={child.iconPath}
                            alt=""
                            width="18"
                            height="18"
                            className="shrink-0"
                          />
                        ) : (
                          <child.icon className="w-5 h-5 shrink-0" />
                        )}
                        <span>{child.label}</span>
                        {child.disabled && (
                          <span className="ml-auto text-xs text-gray-400">
                            Yakında
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.id}
              href={item.href || '#'}
              className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-primary/10 text-primary'
                  : item.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
              KK
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                Kemal Koçak
              </div>
              <div className="text-xs text-gray-500">Kullanıcı</div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

