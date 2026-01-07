'use client'

import { useState, useEffect } from 'react'
import Topbar from '@/components/Topbar'
import StatCard from '@/components/StatCard'
import Tabs from '@/components/Tabs'
import Toolbar from '@/components/Toolbar'
import DataTable from '@/components/DataTable'

interface InsightsData {
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  purchases: number
  roas: number | null
}

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

export default function MetaPage() {
  const [activeTab, setActiveTab] = useState('kampanyalar')
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(false)
  const [campaignsError, setCampaignsError] = useState<string | null>(null)
  const [adAccountId, setAdAccountId] = useState<string | null>(null)

  useEffect(() => {
    // Check connection status and get ad account
    const checkStatus = async () => {
      try {
        const statusResponse = await fetch('/api/meta/status')
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          if (statusData.connected && statusData.adAccountId) {
            setAdAccountId(statusData.adAccountId)
            await Promise.all([
              fetchInsights(statusData.adAccountId),
              fetchCampaigns()
            ])
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

  const fetchInsights = async (accountId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/meta/insights?ad_account_id=${accountId}&date_preset=last_30d`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.insights && data.insights.length > 0) {
          // Aggregate insights data
          const aggregated = data.insights.reduce((acc: InsightsData, item: any) => {
            acc.spend += item.spend || 0
            acc.impressions += item.impressions || 0
            acc.clicks += item.clicks || 0
            acc.purchases += item.purchases || 0
            return acc
          }, {
            spend: 0,
            impressions: 0,
            clicks: 0,
            ctr: 0,
            cpc: 0,
            purchases: 0,
            roas: null,
          })

          // Calculate averages
          if (aggregated.clicks > 0) {
            aggregated.ctr = (aggregated.clicks / aggregated.impressions) * 100
            aggregated.cpc = aggregated.spend / aggregated.clicks
          }

          // Calculate ROAS if available
          if (data.insights[0].roas !== null && data.insights[0].roas !== undefined) {
            aggregated.roas = data.insights[0].roas
          } else if (aggregated.spend > 0) {
            // Estimate ROAS from purchases (simplified)
            aggregated.roas = aggregated.purchases > 0 ? (aggregated.purchases * 100) / aggregated.spend : null
          }

          setInsights(aggregated)
        }
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCampaigns = async () => {
    try {
      setIsCampaignsLoading(true)
      setCampaignsError(null)
      const response = await fetch('/api/meta/campaigns')
      
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data.campaigns || [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        setCampaignsError(errorData.error || 'Kampanyalar yüklenemedi')
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
      setCampaignsError('Kampanyalar yüklenirken bir hata oluştu')
    } finally {
      setIsCampaignsLoading(false)
    }
  }

  const tabs = [
    { id: 'kampanyalar', label: 'Kampanyalar' },
    { id: 'reklam-setleri', label: 'Reklam Setleri' },
    { id: 'reklamlar', label: 'Reklamlar' },
  ]

  const columns = [
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

  // Format campaign data for DataTable
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

  const tableData = campaigns.map(formatCampaignData)

  return (
    <>
      <Topbar
        title="Reklam Yöneticisi"
        description="Meta reklam kampanyalarınızı yönetin"
        actionButton={{
          label: 'Kampanya Oluştur',
          onClick: () => {},
        }}
      />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Harcanan Tutar"
              value={isLoading ? '...' : insights ? `₺${insights.spend.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₺0'}
              change={0}
              trend="up"
            />
            <StatCard
              title="Alışveriş Dönüşümü"
              value={isLoading ? '...' : insights ? insights.purchases.toLocaleString('tr-TR') : '0'}
              change={0}
              trend="up"
            />
            <StatCard
              title="ROAS"
              value={isLoading ? '...' : insights && insights.roas ? `${insights.roas.toFixed(1)}x` : '0x'}
              change={0}
              trend="up"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <Toolbar />
            <div className="p-6">
              {isCampaignsLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Kampanyalar yükleniyor...</p>
                </div>
              ) : campaignsError ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{campaignsError}</p>
                  <button
                    onClick={fetchCampaigns}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Tekrar Dene
                  </button>
                </div>
              ) : tableData.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Henüz kampanya bulunmuyor.</p>
                </div>
              ) : (
                <DataTable columns={columns} data={tableData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

