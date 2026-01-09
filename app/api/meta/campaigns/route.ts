import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { metaGraphFetch } from '@/lib/metaGraph'

export const revalidate = 60 // Cache for 60 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const datePreset = searchParams.get('date_preset') || 'lifetime'
  const after = searchParams.get('after') || null

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('meta_access_token')
  const selectedAdAccountId = cookieStore.get('meta_selected_ad_account_id')

  if (!accessToken || !accessToken.value) {
    return NextResponse.json({ error: 'missing_token' }, { status: 401 })
  }

  if (!selectedAdAccountId || !selectedAdAccountId.value) {
    return NextResponse.json({ error: 'no_ad_account_selected' }, { status: 400 })
  }

  const expiresAtCookie = cookieStore.get('meta_access_expires_at')
  if (expiresAtCookie) {
    const expiresAt = parseInt(expiresAtCookie.value, 10)
    if (Date.now() >= expiresAt) {
      return NextResponse.json({ error: 'token_expired' }, { status: 401 })
    }
  }

  try {
    const accountId = selectedAdAccountId.value.startsWith('act_')
      ? selectedAdAccountId.value
      : `act_${selectedAdAccountId.value.replace('act_', '')}`

    // Step 1: Fetch campaigns
    const campaignParams: Record<string, string> = {
      fields: 'id,name,status,effective_status,daily_budget,lifetime_budget',
      limit: '50',
    }

    if (after) {
      campaignParams.after = after
    }

    const campaignResponse = await metaGraphFetch(
      `/${accountId}/campaigns`,
      accessToken.value,
      { params: campaignParams }
    )

    if (!campaignResponse.ok) {
      const errorData = await campaignResponse.json().catch(() => ({}))
      return NextResponse.json(
        { error: 'meta_api_error', details: errorData.error || { message: `HTTP ${campaignResponse.status}` } },
        { status: 502 }
      )
    }

    const campaignData = await campaignResponse.json()
    const campaigns = campaignData.data || []

    if (campaigns.length === 0) {
      return NextResponse.json({ data: [], paging: {} })
    }

    // Step 2: Fetch ALL campaign insights in ONE request
    const insightsParams: Record<string, string> = {
      level: 'campaign',
      fields: 'campaign_id,spend,impressions,clicks,ctr,cpc,actions,action_values,purchase_roas',
      date_preset: datePreset,
      limit: '50',
    }

    const insightsResponse = await metaGraphFetch(
      `/${accountId}/insights`,
      accessToken.value,
      { params: insightsParams }
    )

    // Create insights map
    const insightsMap = new Map<string, any>()
    
    if (insightsResponse.ok) {
      const insightsData = await insightsResponse.json()
      const insights = insightsData.data || []
      
      insights.forEach((insight: any) => {
        if (insight.campaign_id) {
          insightsMap.set(insight.campaign_id, insight)
        }
      })
    }

    // Step 3: Merge campaigns with insights
    const enrichedCampaigns = campaigns.map((campaign: any) => {
      const insight = insightsMap.get(campaign.id)
      
      const effectiveStatus = campaign.effective_status || campaign.status || 'UNKNOWN'
      const statusLabel = getStatusLabel(effectiveStatus)
      const statusColor = getStatusColor(effectiveStatus)

      const dailyBudget = campaign.daily_budget ? parseFloat(campaign.daily_budget) / 100 : 0
      const lifetimeBudget = campaign.lifetime_budget ? parseFloat(campaign.lifetime_budget) / 100 : 0
      const budget = dailyBudget || lifetimeBudget

      // Parse insights
      const spend = insight?.spend ? parseFloat(insight.spend) : 0
      const impressions = insight?.impressions ? parseInt(insight.impressions, 10) : 0
      const clicks = insight?.clicks ? parseInt(insight.clicks, 10) : 0
      const ctr = insight?.ctr ? parseFloat(insight.ctr) : 0
      const cpc = insight?.cpc ? parseFloat(insight.cpc) : 0

      let purchases = 0
      if (insight?.actions) {
        const purchaseAction = insight.actions.find(
          (a: any) => a.action_type === 'purchase' || a.action_type === 'omni_purchase'
        )
        if (purchaseAction) {
          purchases = parseInt(purchaseAction.value || '0', 10)
        }
      }

      let roas = 0
      if (insight?.purchase_roas) {
        roas = parseFloat(insight.purchase_roas)
      } else if (insight?.action_values && spend > 0) {
        const purchaseValue = insight.action_values.find(
          (av: any) => av.action_type === 'purchase' || av.action_type === 'omni_purchase'
        )
        if (purchaseValue) {
          const value = parseFloat(purchaseValue.value || '0')
          roas = value / spend
        }
      }

      return {
        id: campaign.id,
        name: campaign.name || 'Unnamed Campaign',
        status: effectiveStatus,
        statusLabel,
        statusColor,
        budget,
        spent: spend,
        impressions,
        clicks,
        ctr,
        cpc,
        purchases,
        roas: roas > 0 ? roas : null,
      }
    })

    const nextCursor = campaignData.paging?.cursors?.after || null

    return NextResponse.json({
      data: enrichedCampaigns,
      paging: nextCursor ? { nextCursor } : {},
    })
  } catch (error) {
    console.error('Campaigns fetch error:', error)
    return NextResponse.json(
      { error: 'meta_api_error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    'ACTIVE': 'Aktif',
    'PAUSED': 'Duraklatıldı',
    'ARCHIVED': 'Arşivlendi',
    'DELETED': 'Silindi',
    'DISAPPROVED': 'Reddedildi',
    'PREAPPROVED': 'Ön Onaylı',
    'PENDING_REVIEW': 'İnceleme Bekliyor',
    'PENDING_BILLING_INFO': 'Faturalama Bekliyor',
    'CAMPAIGN_PAUSED': 'Duraklatıldı',
    'ADGROUP_PAUSED': 'Duraklatıldı',
    'WITH_ISSUES': 'Sorunlu',
  }
  return statusMap[status] || status
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'ACTIVE': 'bg-green-100 text-green-800',
    'PAUSED': 'bg-yellow-100 text-yellow-800',
    'ARCHIVED': 'bg-gray-100 text-gray-800',
    'DELETED': 'bg-red-100 text-red-800',
    'DISAPPROVED': 'bg-red-100 text-red-800',
    'PREAPPROVED': 'bg-blue-100 text-blue-800',
    'PENDING_REVIEW': 'bg-yellow-100 text-yellow-800',
    'PENDING_BILLING_INFO': 'bg-yellow-100 text-yellow-800',
    'CAMPAIGN_PAUSED': 'bg-yellow-100 text-yellow-800',
    'ADGROUP_PAUSED': 'bg-yellow-100 text-yellow-800',
    'WITH_ISSUES': 'bg-red-100 text-red-800',
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}
