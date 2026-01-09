'use client'

import { useState, useEffect, useMemo } from 'react'
import Topbar from '@/components/Topbar'
import StatCard from '@/components/StatCard'
import Tabs from '@/components/Tabs'
import Toolbar from '@/components/Toolbar'
import DataTable from '@/components/DataTable'

interface Campaign {
  id: string
  name: string
  status: string
  statusLabel: string
  statusColor: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  purchases: number
  roas: number | null
}

interface AdSet {
  id: string
  name: string
  status: string
  statusLabel: string
  statusColor: string
  campaignId: string
  budget: number
  spent: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  purchases: number
  roas: number | null
}

interface Ad {
  id: string
  name: string
  status: string
  statusLabel: string
  statusColor: string
  adsetId: string
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
  const [adsets, setAdsets] = useState<AdSet[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [insightsLoading, setInsightsLoading] = useState(true)
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [adAccountId, setAdAccountId] = useState<string | null>(null)
  const [adAccountName, setAdAccountName] = useState<string>('')
  const [dateRange, setDateRange] = useState({ preset: 'last_30d', start: '', end: '' })
  const [showInactive, setShowInactive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [campaignsMap, setCampaignsMap] = useState<Record<string, string>>({})
  const [editingBudget, setEditingBudget] = useState<Record<string, { editing: boolean; value: number }>>({})

  // Convert date preset to Meta API format
  const getMetaDatePreset = (preset: string): string => {
    const presetMap: Record<string, string> = {
      'today': 'today',
      'yesterday': 'yesterday',
      'last_7d': 'last_7d',
      'last_30d': 'last_30d',
      'this_month': 'this_month',
      'last_month': 'last_month',
      'custom': 'last_30d', // For custom, we'll use last_30d as fallback
    }
    return presetMap[preset] || 'last_30d'
  }

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const statusResponse = await fetch('/api/meta/status')
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          if (statusData.connected) {
            setAdAccountName(statusData.adAccountName || '')
            // Get selected ad account
            const selectedResponse = await fetch('/api/meta/selected-adaccount')
            if (selectedResponse.ok) {
              const selectedData = await selectedResponse.json()
              if (selectedData.adAccountId) {
                setAdAccountId(selectedData.adAccountId)
                await Promise.all([
                  fetchData('kampanyalar'),
                  fetchInsights(),
                ])
              } else {
                setIsLoading(false)
                setInsightsLoading(false)
              }
            } else {
              setIsLoading(false)
              setInsightsLoading(false)
            }
          } else {
            setIsLoading(false)
            setInsightsLoading(false)
          }
        } else {
          setIsLoading(false)
          setInsightsLoading(false)
        }
      } catch (error) {
        console.error('Status check failed:', error)
        setIsLoading(false)
        setInsightsLoading(false)
      }
    }

    checkStatus()
  }, [])

  useEffect(() => {
    if (adAccountId) {
      fetchData(activeTab)
      fetchInsights()
    }
  }, [activeTab, dateRange, adAccountId])

  const fetchInsights = async () => {
    if (!adAccountId) return

    try {
      setInsightsLoading(true)
      const datePreset = getMetaDatePreset(dateRange.preset)
      const response = await fetch(`/api/meta/insights?datePreset=${datePreset}`)
      
      if (response.ok) {
        const data = await response.json()
        setInsights(data)
      } else {
        // If error, set null to show placeholder
        setInsights(null)
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error)
      setInsights(null)
    } finally {
      setInsightsLoading(false)
    }
  }

  const fetchData = async (tab: string) => {
    if (!adAccountId) return

    setIsLoading(true)
    const datePreset = getMetaDatePreset(dateRange.preset)

    try {
      if (tab === 'kampanyalar') {
        const response = await fetch(`/api/meta/campaigns?date_preset=${datePreset}`)
        if (response.ok) {
          const data = await response.json()
          setCampaigns(data.data || [])
          // Build campaigns map for adsets
          const map: Record<string, string> = {}
          data.data?.forEach((c: Campaign) => {
            map[c.id] = c.name
          })
          setCampaignsMap(map)
        }
      } else if (tab === 'reklam-setleri') {
        const response = await fetch(`/api/meta/adsets?date_preset=${datePreset}`)
        if (response.ok) {
          const data = await response.json()
          setAdsets(data.data || [])
        }
      } else if (tab === 'reklamlar') {
        const response = await fetch(`/api/meta/ads?date_preset=${datePreset}`)
        if (response.ok) {
          const data = await response.json()
          setAds(data.data || [])
        }
      }
    } catch (error) {
      console.error(`Failed to fetch ${tab}:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusToggle = async (objectId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    
    try {
      const response = await fetch('/api/meta/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objectId,
          status: newStatus,
        }),
      })

      if (response.ok) {
        // Refresh the current tab data
        await fetchData(activeTab)
      } else {
        const error = await response.json()
        console.error('Failed to update status:', error)
        alert('Durum güncellenemedi. Lütfen tekrar deneyin.')
      }
    } catch (error) {
      console.error('Status toggle error:', error)
      alert('Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const handleBudgetUpdate = async (adsetId: string, newBudget: number) => {
    try {
      const response = await fetch('/api/meta/adset-budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adsetId,
          dailyBudget: newBudget,
        }),
      })

      if (response.ok) {
        // Refresh adsets data
        await fetchData('reklam-setleri')
      } else {
        const error = await response.json()
        console.error('Failed to update budget:', error)
        alert('Bütçe güncellenemedi. Lütfen tekrar deneyin.')
      }
    } catch (error) {
      console.error('Budget update error:', error)
      alert('Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const handleDateChange = (startDate: string, endDate: string, preset?: string) => {
    setDateRange({
      preset: preset || 'custom',
      start: startDate,
      end: endDate,
    })
  }

  // Filter data based on showInactive and searchQuery
  const filteredCampaigns = useMemo(() => {
    let filtered = campaigns

    if (!showInactive) {
      filtered = filtered.filter(c => c.status === 'ACTIVE')
    }

    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [campaigns, showInactive, searchQuery])

  const filteredAdsets = useMemo(() => {
    let filtered = adsets

    if (!showInactive) {
      filtered = filtered.filter(a => a.status === 'ACTIVE')
    }

    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [adsets, showInactive, searchQuery])

  const filteredAds = useMemo(() => {
    let filtered = ads

    if (!showInactive) {
      filtered = filtered.filter(a => a.status === 'ACTIVE')
    }

    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [ads, showInactive, searchQuery])

  // Use insights data for KPI cards if available
  const stats = useMemo(() => {
    if (insights) {
      return {
        spend: insights.spendTRY,
        purchases: insights.purchases,
        roas: insights.roas,
      }
    }
    
    // Fallback to calculated stats from table data
    let items: (Campaign | AdSet | Ad)[] = []
    
    if (activeTab === 'kampanyalar') {
      items = filteredCampaigns
    } else if (activeTab === 'reklam-setleri') {
      items = filteredAdsets
    } else if (activeTab === 'reklamlar') {
      items = filteredAds
    }

    const totalSpend = items.reduce((sum, item) => sum + item.spent, 0)
    const totalPurchases = items.reduce((sum, item) => sum + item.purchases, 0)
    
    let roas: number | null = null
    const itemsWithRoas = items.filter(item => item.roas !== null && item.roas !== undefined)
    if (itemsWithRoas.length > 0 && totalSpend > 0) {
      const totalRoasValue = itemsWithRoas.reduce((sum, item) => {
        return sum + (item.roas || 0) * item.spent
      }, 0)
      roas = totalRoasValue / totalSpend
    }

    return {
      spend: totalSpend,
      purchases: totalPurchases,
      roas,
    }
  }, [insights, activeTab, filteredCampaigns, filteredAdsets, filteredAds])

  const tabs = [
    { id: 'kampanyalar', label: 'Kampanyalar' },
    { id: 'reklam-setleri', label: 'Reklam Setleri' },
    { id: 'reklamlar', label: 'Reklamlar' },
  ]

  const campaignColumns = [
    { key: 'status', label: 'Durum' },
    { key: 'name', label: 'Kampanya Adı' },
    { key: 'budget', label: 'Bütçe' },
    { key: 'spent', label: 'Harcanan' },
    { key: 'impressions', label: 'Gösterimler' },
    { key: 'clicks', label: 'Tıklamalar' },
    { key: 'ctr', label: 'CTR' },
    { key: 'cpc', label: 'CPC' },
    { key: 'roas', label: 'ROAS' },
  ]

  const adsetColumns = [
    { key: 'status', label: 'Durum' },
    { key: 'name', label: 'Reklam Seti Adı' },
    { key: 'campaign', label: 'Kampanya' },
    { key: 'budget', label: 'Bütçe' },
    { key: 'spent', label: 'Harcanan' },
    { key: 'impressions', label: 'Gösterimler' },
    { key: 'clicks', label: 'Tıklamalar' },
    { key: 'ctr', label: 'CTR' },
    { key: 'cpc', label: 'CPC' },
    { key: 'roas', label: 'ROAS' },
  ]

  const adColumns = [
    { key: 'status', label: 'Durum' },
    { key: 'name', label: 'Reklam Adı' },
    { key: 'adset', label: 'Reklam Seti' },
    { key: 'spent', label: 'Harcanan' },
    { key: 'impressions', label: 'Gösterimler' },
    { key: 'clicks', label: 'Tıklamalar' },
    { key: 'ctr', label: 'CTR' },
    { key: 'cpc', label: 'CPC' },
    { key: 'roas', label: 'ROAS' },
  ]

  const formatCampaignData = (campaign: Campaign) => ({
    _id: campaign.id,
    _status: campaign.status,
      status: (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${campaign.statusColor}`}>
        {campaign.statusLabel}
      </span>
    ),
    name: campaign.name,
    budget: `₺${campaign.budget.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    spent: `₺${campaign.spent.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    impressions: campaign.impressions.toLocaleString('tr-TR'),
    clicks: campaign.clicks.toLocaleString('tr-TR'),
    ctr: `${campaign.ctr.toFixed(2)}%`,
    cpc: `₺${campaign.cpc.toFixed(2)}`,
    roas: campaign.roas ? `${campaign.roas.toFixed(1)}x` : '-',
  })

  const formatAdsetData = (adset: AdSet) => ({
    _id: adset.id,
    _status: adset.status,
    _budget: adset.budget,
      status: (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${adset.statusColor}`}>
        {adset.statusLabel}
      </span>
    ),
    name: adset.name,
    campaign: campaignsMap[adset.campaignId] || '-',
    budget: `₺${adset.budget.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    spent: `₺${adset.spent.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    impressions: adset.impressions.toLocaleString('tr-TR'),
    clicks: adset.clicks.toLocaleString('tr-TR'),
    ctr: `${adset.ctr.toFixed(2)}%`,
    cpc: `₺${adset.cpc.toFixed(2)}`,
    roas: adset.roas ? `${adset.roas.toFixed(1)}x` : '-',
  })

  const formatAdData = (ad: Ad) => ({
    _id: ad.id,
    _status: ad.status,
      status: (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${ad.statusColor}`}>
        {ad.statusLabel}
      </span>
    ),
    name: ad.name,
    adset: ad.adsetId ? `Ad Set ${ad.adsetId.slice(-8)}` : '-',
    spent: `₺${ad.spent.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    impressions: ad.impressions.toLocaleString('tr-TR'),
    clicks: ad.clicks.toLocaleString('tr-TR'),
    ctr: `${ad.ctr.toFixed(2)}%`,
    cpc: `₺${ad.cpc.toFixed(2)}`,
    roas: ad.roas ? `${ad.roas.toFixed(1)}x` : '-',
  })

  const getTableData = () => {
    if (activeTab === 'kampanyalar') {
      return filteredCampaigns.map(formatCampaignData)
    } else if (activeTab === 'reklam-setleri') {
      return filteredAdsets.map(formatAdsetData)
    } else {
      return filteredAds.map(formatAdData)
    }
  }

  const getTableActions = () => {
    return (row: any, index: number) => {
      const objectId = row._id
      const currentStatus = row._status
      const isEditing = editingBudget[objectId]?.editing || false
      const budgetValue = editingBudget[objectId]?.value ?? row._budget ?? 0

      if (activeTab === 'reklam-setleri') {
        // AdSet: Status toggle + Budget edit
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusToggle(objectId, currentStatus)}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title={currentStatus === 'ACTIVE' ? 'Duraklat' : 'Aktifleştir'}
            >
              {currentStatus === 'ACTIVE' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={budgetValue}
                  onChange={(e) => {
                    setEditingBudget({
                      ...editingBudget,
                      [objectId]: { editing: true, value: parseFloat(e.target.value) || 0 },
                    })
                  }}
                  className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                  step="0.01"
                  min="0"
                />
                <button
                  onClick={async () => {
                    await handleBudgetUpdate(objectId, budgetValue)
                    setEditingBudget({
                      ...editingBudget,
                      [objectId]: { editing: false, value: budgetValue },
                    })
                  }}
                  className="p-1 text-green-600 hover:text-green-700"
                  title="Kaydet"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setEditingBudget({
                      ...editingBudget,
                      [objectId]: { editing: false, value: row._budget || 0 },
                    })
                  }}
                  className="p-1 text-red-600 hover:text-red-700"
                  title="İptal"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setEditingBudget({
                    ...editingBudget,
                    [objectId]: { editing: true, value: row._budget || 0 },
                  })
                }}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title="Bütçe Düzenle"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
          </div>
        )
      } else {
        // Campaign/Ad: Status toggle only
        return (
          <button
            onClick={() => handleStatusToggle(objectId, currentStatus)}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title={currentStatus === 'ACTIVE' ? 'Duraklat' : 'Aktifleştir'}
          >
            {currentStatus === 'ACTIVE' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        )
      }
    }
  }

  const getColumns = () => {
    if (activeTab === 'kampanyalar') {
      return campaignColumns
    } else if (activeTab === 'reklam-setleri') {
      return adsetColumns
    } else {
      return adColumns
    }
  }

  return (
    <>
      <Topbar
        title="Reklam Yöneticisi"
        description="Meta reklam kampanyalarınızı yönetin"
        actionButton={{
          label: 'Kampanya Oluştur',
          onClick: () => {},
        }}
        adAccountName={adAccountName}
      />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Harcanan Tutar"
              value={insightsLoading || isLoading ? '...' : insights ? `₺${insights.spendTRY.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₺0'}
              change={0}
              trend="up"
            />
            <StatCard
              title="Alışveriş Dönüşümü"
              value={insightsLoading || isLoading ? '...' : insights ? insights.purchases.toLocaleString('tr-TR') : '0'}
              change={0}
              trend="up"
            />
            <StatCard
              title="ROAS"
              value={insightsLoading || isLoading ? '...' : insights && insights.roas > 0 ? `${insights.roas.toFixed(1)}x` : '0x'}
              change={0}
              trend="up"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <Toolbar
              onDateChange={handleDateChange}
              onShowInactiveChange={setShowInactive}
              onSearch={setSearchQuery}
              showInactive={showInactive}
              searchQuery={searchQuery}
            />
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Yükleniyor...</p>
                </div>
              ) : getTableData().length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Henüz veri bulunmuyor.</p>
                </div>
              ) : (
                <DataTable columns={getColumns()} data={getTableData()} actions={getTableActions()} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
