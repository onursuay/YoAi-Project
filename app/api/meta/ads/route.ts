import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { metaGraphFetch } from '@/lib/metaGraph'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const datePreset = searchParams.get('date_preset') || 'last_30d'
  const after = searchParams.get('after') || null

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('meta_access_token')
  const selectedAdAccountId = cookieStore.get('meta_selected_ad_account_id')

  if (!accessToken || !accessToken.value) {
    return NextResponse.json(
      { error: 'missing_token' },
      { status: 401 }
    )
  }

  if (!selectedAdAccountId || !selectedAdAccountId.value) {
    return NextResponse.json(
      { error: 'no_ad_account_selected' },
      { status: 400 }
    )
  }

  // Check token expiration if available
  const expiresAtCookie = cookieStore.get('meta_access_expires_at')
  if (expiresAtCookie) {
    const expiresAt = parseInt(expiresAtCookie.value, 10)
    if (Date.now() >= expiresAt) {
      return NextResponse.json(
        { error: 'token_expired' },
        { status: 401 }
      )
    }
  }

  try {
    // Ensure ad_account_id starts with 'act_'
    const accountId = selectedAdAccountId.value.startsWith('act_')
      ? selectedAdAccountId.value
      : `act_${selectedAdAccountId.value.replace('act_', '')}`

    const params: Record<string, string> = {
      fields: 'id,name,status,effective_status,adset_id,campaign_id',
      limit: '50',
    }

    if (after) {
      params.after = after
    }

    const response = await metaGraphFetch(`/${accountId}/ads`, accessToken.value, {
      params,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        {
          error: 'meta_api_error',
          details: errorData.error || { message: `HTTP ${response.status}` },
        },
        { status: 502 }
      )
    }

    const data = await response.json()
    const ads = (data.data || []).map((ad: any) => {
      const effectiveStatus = ad.effective_status || ad.status || 'UNKNOWN'
      const statusLabel = getStatusLabel(effectiveStatus)
      const statusColor = getStatusColor(effectiveStatus)

      return {
        id: ad.id,
        name: ad.name || 'Unnamed Ad',
        status: effectiveStatus,
        statusLabel,
        statusColor,
        adsetId: ad.adset_id || '',
        spent: 0,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        cpc: 0,
        purchases: 0,
        roas: null,
      }
    })

    const nextCursor = data.paging?.cursors?.after || null

    return NextResponse.json({
      data: ads,
      paging: nextCursor ? { nextCursor } : {},
    })
  } catch (error) {
    console.error('Ads fetch error:', error)
    return NextResponse.json(
      {
        error: 'meta_api_error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
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

