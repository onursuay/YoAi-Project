import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { metaGraphFetch } from '@/lib/metaGraph'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('meta_access_token')
  const selectedAdAccountId = cookieStore.get('meta_selected_ad_account_id')

  if (!accessToken || !accessToken.value) {
    return NextResponse.json({ error: 'missing_token' }, { status: 401 })
  }

  if (!selectedAdAccountId || !selectedAdAccountId.value) {
    return NextResponse.json({ error: 'no_ad_account_selected' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { name, objective, dailyBudget, status } = body

    if (!name || !objective) {
      return NextResponse.json(
        { error: 'name and objective are required' },
        { status: 400 }
      )
    }

    const accountId = selectedAdAccountId.value.startsWith('act_')
      ? selectedAdAccountId.value
      : `act_${selectedAdAccountId.value.replace('act_', '')}`

    const campaignData: any = {
      name,
      objective,
      status: status || 'PAUSED',
      special_ad_categories: [],
    }

    if (dailyBudget && dailyBudget > 0) {
      campaignData.daily_budget = Math.round(dailyBudget * 100)
    }

    const formData = new URLSearchParams()
    Object.keys(campaignData).forEach((key) => {
      if (Array.isArray(campaignData[key])) {
        formData.append(key, JSON.stringify(campaignData[key]))
      } else {
        formData.append(key, campaignData[key].toString())
      }
    })

    const response = await metaGraphFetch(
      `/${accountId}/campaigns`,
      accessToken.value,
      {
        method: 'POST',
        body: formData.toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

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
    return NextResponse.json({
      success: true,
      campaignId: data.id,
    })
  } catch (error) {
    console.error('Campaign create error:', error)
    return NextResponse.json(
      {
        error: 'server_error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
