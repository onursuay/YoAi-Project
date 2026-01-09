import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { metaGraphFetch } from '@/lib/metaGraph'

// CACHE: 60 saniye boyunca aynı veriyi dön
export const dynamic = 'force-dynamic'
export const revalidate = 60

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

    const adsetParams: Record<string, string> = {
      fields: 'id,name,status,effective_status,daily_budget,campaign_id',
      limit: '50',
    }
    if (after) adsetParams.after = after

    const adsetResponse = await metaGraphFetch(`/${accountId}/adsets`, accessToken.value, { params: adsetParams })
    if (!adsetResponse.ok) {
      const errorData = await adsetResponse.json().catch(() => ({}))
      return NextResponse.json({ error: 'meta_api_error', details: errorData.error || { message: `HTTP ${adsetResponse.status}` } }, { status: 502 })
    }

    const adsetData = await adsetResponse.json()
    const adsets = adsetData.data || []
    if (adsets.length === 0) return NextResponse.json({ data: [], paging: {} })

    const insightsParams: Record<string, string> = {
      level: 'adset',
      fields: 'adset_id,spend,impressions,clicks,ctr,cpc,actions,action_values,purchase_roas',
      date_preset: datePreset,
      limit: '50',
    }
    const insightsResponse = await metaGraphFetch(`/${accountId}/insights`, accessToken.value, { params: insightsParams })
    
    const insightsMap = new Map<string, any>()
    if (insightsResponse.ok) {
      const insightsData = await insightsResponse.json()
      const insights = insightsData.data || []
      insights.forEach((insight: any) => {
        if (insight.adset_id) insightsMap.set(insight.adset_id, insight)
      })
    }

    const enrichedAdsets = adsets.map((adset: any) => {
      const insight = insightsMap.get(adset.id)
      const effectiveStatus = adset.effective_status || adset.status || 'UNKNOWN'
      const budget = adset.daily_budget ? parseFloat(adset.daily_budget) / 100 : 0

      const spend = insight?.spend ? parseFloat(insight.spend) : 0
      const impressions = insight?.impressions ? parseInt(insight.impressions, 10) : 0
      const clicks = insight?.clicks ? parseInt(insight.clicks, 10) : 0
      const ctr = insight?.ctr ? parseFloat(insight.ctr) : 0
      const cpc = insight?.cpc ? parseFloat(insight.cpc) : 0

      let purchases = 0
      if (insight?.actions) {
        const purchaseAction = insight.actions.find((a: any) => a.action_type === 'purchase' || a.action_type === 'omni_purchase')
        if (purchaseAction) purchases = parseInt(purchaseAction.value || '0', 10)
      }

      let roas = 0
      if (insight?.purchase_roas) {
        roas = parseFloat(insight.purchase_roas)
      } else if (insight?.action_values && spend > 0) {
        const purchaseValue = insight.action_values.find((av: any) => av.action_type === 'purchase' || av.action_type === 'omni_purchase')
        if (purchaseValue) roas = parseFloat(purchaseValue.value || '0') / spend
      }

      return {
        id: adset.id,
        name: adset.name || 'Unnamed Ad Set',
        status: effectiveStatus,
        statusLabel: getStatusLabel(effectiveStatus),
        statusColor: getStatusColor(effectiveStatus),
        campaignId: adset.campaign_id || '',
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

    return NextResponse.json({
      data: enrichedAdsets,
      paging: adsetData.paging?.cursors?.after ? { nextCursor: adsetData.paging.cursors.after } : {},
    })
  } catch (error) {
    console.error('Adsets fetch error:', error)
    return NextResponse.json({ error: 'meta_api_error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    'ACTIVE': 'Aktif', 'PAUSED': 'Duraklatıldı', 'ARCHIVED': 'Arşivlendi', 'DELETED': 'Silindi',
    'DISAPPROVED': 'Reddedildi', 'PREAPPROVED': 'Ön Onaylı', 'PENDING_REVIEW': 'İnceleme Bekliyor',
    'PENDING_BILLING_INFO': 'Faturalama Bekliyor', 'CAMPAIGN_PAUSED': 'Duraklatıldı',
    'ADGROUP_PAUSED': 'Duraklatıldı', 'WITH_ISSUES': 'Sorunlu',
  }
  return statusMap[status] || status
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'ACTIVE': 'bg-green-100 text-green-800', 'PAUSED': 'bg-yellow-100 text-yellow-800',
    'ARCHIVED': 'bg-gray-100 text-gray-800', 'DELETED': 'bg-red-100 text-red-800',
    'DISAPPROVED': 'bg-red-100 text-red-800', 'PREAPPROVED': 'bg-blue-100 text-blue-800',
    'PENDING_REVIEW': 'bg-yellow-100 text-yellow-800', 'PENDING_BILLING_INFO': 'bg-yellow-100 text-yellow-800',
    'CAMPAIGN_PAUSED': 'bg-yellow-100 text-yellow-800', 'ADGROUP_PAUSED': 'bg-yellow-100 text-yellow-800',
    'WITH_ISSUES': 'bg-red-100 text-red-800',
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}
