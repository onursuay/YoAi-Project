'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface TopbarProps {
  title: string
  description: string
  actionButton?: {
    label: string
    onClick: () => void
  }
  adAccountName?: string
}

interface AdAccount {
  id: string
  name: string
  account_id: string
}

export default function Topbar({ title, description, actionButton, adAccountName }: TopbarProps) {
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)

  useEffect(() => {
    fetchAdAccounts()
  }, [])

  const fetchAdAccounts = async () => {
    try {
      const response = await fetch('/api/meta/adaccounts')
      if (response.ok) {
        const data = await response.json()
        setAdAccounts(data.accounts || [])
        
        // Get currently selected account
        const statusResponse = await fetch('/api/meta/status')
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          setSelectedAccount(statusData.adAccountId)
        }
      }
    } catch (error) {
      console.error('Failed to fetch ad accounts:', error)
    }
  }

  const handleSelectAccount = async (accountId: string) => {
    try {
      const response = await fetch('/api/meta/select-adaccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adAccountId: accountId }),
      })

      if (response.ok) {
        setShowDropdown(false)
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to select account:', error)
    }
  }

  const handleDisconnect = async () => {
    if (confirm('Meta bağlantısını kesmek istediğinize emin misiniz?')) {
      await fetch('/api/meta/disconnect', { method: 'POST' })
      router.push('/dashboard/entegrasyon')
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          {adAccountName && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">{adAccountName}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-xs font-medium text-gray-500">REKLAM HESAPLARI</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {adAccounts.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => handleSelectAccount(account.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          selectedAccount === account.id ? 'bg-green-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{account.name}</p>
                            <p className="text-xs text-gray-500">ID: {account.account_id}</p>
                          </div>
                          {selectedAccount === account.id && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <button
                      onClick={handleDisconnect}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      Bağlantıyı Kes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              {actionButton.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
