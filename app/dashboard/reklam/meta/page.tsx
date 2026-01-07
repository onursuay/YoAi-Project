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

export default function MetaPage() {
  const [activeTab, setActiveTab] = useState('kampanyalar')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [adsets, setAdsets] = useState<AdSet[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [adAccountId, setAdAccountId] = useState<string | null>(null)
  const [adAccountName, setAdAccountName] = useState<string>('')
  const [dateRange, setDateRange] = useState({ preset: 'last_30d', start: '', end: '' })
  const [showInactive, setShowInactive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [campaignsMap, setCampaignsMap] = useState<Record<string, string>>({})

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
          if (statusData.connected && statusData.adAccountId) {
            setAdAccountId(statusData.adAccountId)
            setAdAccountName(statusData.adAccountName || '')
            await fetchData('kampanyalar')
          } else {
            setIsLoading(false)
          }
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Status check failed:', error)
        setIsLoading(false)
      }
    }

    checkStatus()
  }, [])

  useEffect(() => {
    if (adAccountId) {
      fetchData(activeTab)
    }
  }, [activeTab, dateRange, adAccountId])

  const fetchData = async (tab: string) => {
    if (!adAccountId) return

    setIsLoading(true)
    const datePreset = getMetaDatePreset(dateRange.preset)

    try {
      if (tab === 'kampanyalar') {
        const response = await fetch(`/api/meta/campaigns?date_preset=${datePreset}`)
        if (response.ok) {
          const data = await response.json()
          setCampaigns(data.campaigns || [])
          // Build campaigns map for adsets
          const map: Record<string, string> = {}
          data.campaigns?.forEach((c: Campaign) => {
            map[c.id] = c.name
          })
          setCampaignsMap(map)
        }
      } else if (tab === 'reklam-setleri') {
        const response = await fetch(`/api/meta/adsets?date_preset=${datePreset}`)
        if (response.ok) {
          const data = await response.json()
          setAdsets(data.adsets || [])
        }
      } else if (tab === 'reklamlar') {
        const response = await fetch(`/api/meta/ads?date_preset=${datePreset}`)
        if (response.ok) {
          const data = await response.json()
          setAds(data.ads || [])
        }
      }
    } catch (error) {
      console.error(`Failed to fetch ${tab}:`, error)
    } finally {
      setIsLoading(false)
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

  // Calculate stats for active tab
  const stats = useMemo(() => {
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
    
    // Calculate ROAS: total purchase value / total spend
    // For now, we'll estimate from purchases count (simplified)
    // In real implementation, we'd need purchase_value from action_values
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
  }, [activeTab, filteredCampaigns, filteredAdsets, filteredAds])

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
              value={isLoading ? '...' : `₺${stats.spend.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              change={0}
              trend="up"
            />
            <StatCard
              title="Alışveriş Dönüşümü"
              value={isLoading ? '...' : stats.purchases.toLocaleString('tr-TR')}
              change={0}
              trend="up"
            />
            <StatCard
              title="ROAS"
              value={isLoading ? '...' : stats.roas ? `${stats.roas.toFixed(1)}x` : '0x'}
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
                <DataTable columns={getColumns()} data={getTableData()} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
