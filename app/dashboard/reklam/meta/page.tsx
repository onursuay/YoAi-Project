'use client'

import { useState, useEffect, useMemo } from 'react'
import Topbar from '@/components/Topbar'
import Tabs from '@/components/Tabs'
import Toolbar from '@/components/Toolbar'
import ToggleSwitch from '@/components/ToggleSwitch'
import CircularProgress from '@/components/CircularProgress'
import MiniChart from '@/components/MiniChart'
import CampaignCreateModal from '@/components/CampaignCreateModal'

interface Campaign {
  id: string
  name: string
  status: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  purchases: number
  roas: number | null
}

interface InsightsData {
  spendTRY: number
  purchases: number
  roas: number
  impressions: number
  clicks: number
  ctr: number
  cpcTRY: number
}

export default function MetaPage() {
  const [activeTab, setActiveTab] = useState('kampanyalar')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [adAccountName, setAdAccountName] = useState<string>('')
  const [dateRange, setDateRange] = useState({ preset: 'last_30d', start: '', end: '' })
  const [showInactive, setShowInactive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const getMetaDatePreset = (preset: string): string => {
    const presetMap: Record<string, string> = {
      'today': 'today',
      'yesterday': 'yesterday',
      'last_7d': 'last_7d',
      'last_30d': 'last_30d',
      'this_month': 'this_month',
      'last_month': 'last_month',
      'custom': 'last_30d',
    }
    return presetMap[preset] || 'last_30d'
  }

  useEffect(() => {
    const init = async () => {
      try {
        const statusResponse = await fetch('/api/meta/status')
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          if (statusData.connected) {
            setAdAccountName(statusData.adAccountName || '')
            await fetchCampaigns()
            await fetchInsights()
          }
        }
      } catch (error) {
        console.error('Init failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  useEffect(() => {
    fetchCampaigns()
      fetchInsights()
  }, [dateRange])

  const fetchInsights = async () => {
    try {
      const datePreset = getMetaDatePreset(dateRange.preset)
      const response = await fetch(`/api/meta/insights?datePreset=${datePreset}`)
      if (response.ok) {
        const data = await response.json()
        setInsights(data)
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error)
    }
  }

  const fetchCampaigns = async () => {
    setIsLoading(true)
    try {
      const datePreset = getMetaDatePreset(dateRange.preset)
        const response = await fetch(`/api/meta/campaigns?date_preset=${datePreset}`)
        if (response.ok) {
          const data = await response.json()
          setCampaigns(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusToggle = async (campaignId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    try {
      const response = await fetch('/api/meta/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objectId: campaignId, status: newStatus }),
      })
      if (response.ok) {
        await fetchCampaigns()
      }
    } catch (error) {
      console.error('Toggle error:', error)
    }
  }

  const handleDateChange = (startDate: string, endDate: string, preset?: string) => {
    setDateRange({ preset: preset || 'custom', start: startDate, end: endDate })
  }

  const filteredCampaigns = useMemo(() => {
    let filtered = campaigns
    if (!showInactive) {
      filtered = filtered.filter(c => c.status === 'ACTIVE')
    }
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return filtered
  }, [campaigns, showInactive, searchQuery])

  const tabs = [
    { id: 'kampanyalar', label: 'Kampanyalar' },
    { id: 'reklam-setleri', label: 'Reklam Setleri' },
    { id: 'reklamlar', label: 'Reklamlar' },
  ]

  // Mock chart data
  const generateMockData = () => Array.from({ length: 10 }, () => Math.random() * 100 + 50)

  return (
    <>
      <Topbar
        title="Reklam Yöneticisi"
        description="İşletmeniz için yeni bir reklam kampanyası oluşturun."
        actionButton={{
          label: 'Kampanya Oluştur',
          onClick: () => setShowCreateModal(true),
        }}
        adAccountName={adAccountName}
      />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 space-y-6">
          {/* KPI Cards with Mini Charts */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Harcanan tutar</div>
              <div className="text-sm text-gray-400 mb-2">26/Ara - 01/Oca</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-500 text-xs">↓ %14,7</span>
                <span className="text-2xl font-bold">₺{insights?.spendTRY.toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) || '0'}</span>
              </div>
              <MiniChart data={generateMockData()} color="red" />
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Tıklamalar</div>
              <div className="text-sm text-gray-400 mb-2">26/Ara - 01/Oca</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-500 text-xs">↓ %27,6</span>
                <span className="text-2xl font-bold">{insights?.clicks.toLocaleString('tr-TR') || '0'}</span>
              </div>
              <MiniChart data={generateMockData()} color="red" />
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Dönüşüm Değeri</div>
              <div className="text-sm text-gray-400 mb-2">26/Ara - 01/Oca</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-500 text-xs">↓ %15,9</span>
                <span className="text-2xl font-bold">{insights?.purchases || '0'}</span>
              </div>
              <MiniChart data={generateMockData()} color="red" />
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Dön. Değeri / Maliyet</div>
              <div className="text-sm text-gray-400 mb-2">26/Ara - 01/Oca</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-500 text-xs">↑ %22,9</span>
                <span className="text-2xl font-bold">₺{insights?.roas.toFixed(0) || '0'}</span>
              </div>
              <MiniChart data={generateMockData()} color="green" />
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">TBM (Tıklama Başına Maliyet)</div>
              <div className="text-sm text-gray-400 mb-2">26/Ara - 01/Oca</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-500 text-xs">↑ %16,1</span>
                <span className="text-2xl font-bold">₺{insights?.cpcTRY.toFixed(0) || '0'}</span>
              </div>
              <MiniChart data={generateMockData()} color="green" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <Toolbar
              onDateChange={handleDateChange}
              onShowInactiveChange={setShowInactive}
              onSearch={setSearchQuery}
              showInactive={showInactive}
              searchQuery={searchQuery}
            />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-y border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yayın</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opt. Puanı</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlangıç Tarihi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kampanya</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bütçe</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harcanan tutar</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Gösterimler</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tıklamalar</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">CTR</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">CPC</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">ROAS</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                    <tr>
                      <td colSpan={13} className="px-4 py-12 text-center text-gray-500">
                        Yükleniyor...
                      </td>
                    </tr>
                  ) : filteredCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="px-4 py-12 text-center text-gray-500">
                        Henüz veri bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <ToggleSwitch
                            enabled={campaign.status === 'ACTIVE'}
                            onChange={() => handleStatusToggle(campaign.id, campaign.status)}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <CircularProgress percentage={Math.floor(Math.random() * 30 + 70)} />
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {new Date().toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{campaign.name}</td>
                        <td className="px-4 py-4 text-sm text-right text-gray-900">
                          ₺{campaign.budget.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-4 text-sm text-right text-gray-900">
                          ₺{campaign.spent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-4 text-sm text-right text-gray-900">
                          {campaign.impressions.toLocaleString('tr-TR')}
                        </td>
                        <td className="px-4 py-4 text-sm text-right text-gray-900">
                          {campaign.clicks.toLocaleString('tr-TR')}
                        </td>
                        <td className="px-4 py-4 text-sm text-right text-gray-900">
                          {campaign.ctr.toFixed(2)}%
                        </td>
                        <td className="px-4 py-4 text-sm text-right text-gray-900">
                          ₺{campaign.cpc.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 text-sm text-right text-gray-900">
                          {campaign.roas ? `${campaign.roas.toFixed(1)}x` : '-'}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button className="p-1.5 text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CampaignCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchCampaigns}
      />
    </>
  )
}
