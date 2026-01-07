import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/meta/crypto'
import { metaFetch } from '@/lib/meta/fetcher'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const datePreset = searchParams.get('date_preset') || 'last_30d'

  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('meta_token')
  const adAccountCookie = cookieStore.get('meta_adaccount')

  if (!tokenCookie) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  if (!adAccountCookie) {
    return NextResponse.json(
      { error: 'Ad account not selected' },
      { status: 400 }
    )
  }

  const decryptedToken = decrypt(tokenCookie.value)
  if (!decryptedToken) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }

  // Check token expiration
  const expiresAtCookie = cookieStore.get('meta_token_expires_at')
  if (expiresAtCookie) {
    const expiresAt = parseInt(expiresAtCookie.value, 10)
    if (Date.now() >= expiresAt) {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      )
    }
  }

  try {
    // Ensure ad_account_id starts with 'act_'
    const accountId = adAccountCookie.value.startsWith('act_') 
      ? adAccountCookie.value 
      : `act_${adAccountCookie.value.replace('act_', '')}`
    
    // Build insights field with date_preset
    const insightsField = `insights.date_preset(${datePreset}){spend,impressions,clicks,ctr,cpc,actions,action_values}`
    
    // Fetch ads with insights
    const response = await metaFetch(
      `/${accountId}/ads`,
      decryptedToken,
      {
        params: {
          fields: `id,name,status,effective_status,adset_id,creative,${insightsField}`,
          limit: '100',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Handle rate limiting
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch ads' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Process ads data
    const ads = (data.data || []).map((ad: any) => {
      const insights = ad.insights?.data?.[0] || ad.insights || {}
      
      // Parse actions for purchases
      const actions = insights.actions || []
      const purchaseAction = actions.find((a: any) => a.action_type === 'purchase')
      const purchases = purchaseAction ? parseInt(purchaseAction.value || '0', 10) : 0
      
      // Calculate ROAS from action_values
      let roas: number | null = null
      if (insights.action_values && insights.action_values.length > 0) {
        const purchaseValue = insights.action_values.find((av: any) => av.action_type === 'purchase')
        if (purchaseValue && insights.spend) {
          const spend = parseFloat(insights.spend || '0')
          const value = parseFloat(purchaseValue.value || '0')
          if (spend > 0) {
            roas = value / spend
          }
        }
      }

      // Format status
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
        spent: parseFloat(insights.spend || '0'),
        impressions: parseInt(insights.impressions || '0', 10),
        clicks: parseInt(insights.clicks || '0', 10),
        ctr: parseFloat(insights.ctr || '0'),
        cpc: parseFloat(insights.cpc || '0'),
        purchases,
        roas,
      }
    })

    return NextResponse.json({ ads })
  } catch (error) {
    console.error('Ads fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ads' },
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

