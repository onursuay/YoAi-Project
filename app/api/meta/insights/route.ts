import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/meta/crypto'
import { metaFetch, fetchAllPages } from '@/lib/meta/fetcher'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const adAccountId = searchParams.get('ad_account_id')
  const datePreset = searchParams.get('date_preset') || 'last_30d'
  const since = searchParams.get('since')
  const until = searchParams.get('until')
  const limit = parseInt(searchParams.get('limit') || '100', 10)

  if (!adAccountId) {
    return NextResponse.json(
      { error: 'ad_account_id is required' },
      { status: 400 }
    )
  }

  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('meta_token')

  if (!tokenCookie) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
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
    const accountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId.replace('act_', '')}`
    
    // Build query parameters
    const params: Record<string, string> = {
      fields: 'spend,impressions,clicks,ctr,cpc,cpp,reach,actions,action_values',
      level: 'account',
      limit: limit.toString(),
    }

    if (datePreset && !since && !until) {
      params.date_preset = datePreset
    } else if (since && until) {
      params.time_range = JSON.stringify({
        since: since,
        until: until,
      })
    } else {
      // Default to last_30d if no date specified
      params.date_preset = 'last_30d'
    }

    const response = await metaFetch(
      `/${accountId}/insights`,
      decryptedToken,
      { params }
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
        { error: errorData.error?.message || 'Failed to fetch insights' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Process insights data
    const insights = (data.data || []).map((item: any) => {
      // Parse actions if available
      const actions = item.actions || []
      const purchases = actions.find((a: any) => a.action_type === 'purchase')?.value || '0'
      const purchasesCount = actions.find((a: any) => a.action_type === 'purchase')?.value || '0'
      
      // Calculate ROAS if we have purchase value and spend
      let roas = null
      if (item.action_values && item.action_values.length > 0) {
        const purchaseValue = item.action_values.find((av: any) => av.action_type === 'purchase')?.value || '0'
        const spend = parseFloat(item.spend || '0')
        if (spend > 0) {
          roas = (parseFloat(purchaseValue) / spend).toFixed(2)
        }
      }

      return {
        date_start: item.date_start,
        date_stop: item.date_stop,
        spend: parseFloat(item.spend || '0'),
        impressions: parseInt(item.impressions || '0', 10),
        clicks: parseInt(item.clicks || '0', 10),
        ctr: parseFloat(item.ctr || '0'),
        cpc: parseFloat(item.cpc || '0'),
        cpp: parseFloat(item.cpp || '0'),
        reach: parseInt(item.reach || '0', 10),
        purchases: parseInt(purchasesCount, 10),
        roas: roas ? parseFloat(roas) : null,
      }
    })

    return NextResponse.json({
      insights,
      paging: data.paging || null,
    })
  } catch (error) {
    console.error('Insights fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}

