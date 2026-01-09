import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { metaGraphFetch } from '@/lib/metaGraph'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { adsetId, dailyBudget } = body

    if (!adsetId || typeof adsetId !== 'string') {
      return NextResponse.json(
        { error: 'adsetId is required' },
        { status: 400 }
      )
    }

    if (dailyBudget === undefined || dailyBudget === null || typeof dailyBudget !== 'number') {
      return NextResponse.json(
        { error: 'dailyBudget is required and must be a number' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('meta_access_token')

    if (!accessToken || !accessToken.value) {
      return NextResponse.json(
        { error: 'missing_token' },
        { status: 401 }
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

    // Convert TRY to minor units (TL * 100)
    // UI sends TRY (e.g., 10000.00), Meta expects minor units (e.g., 1000000)
    const dailyBudgetMinor = Math.round(dailyBudget * 100)

    // Update daily_budget via Meta Graph API
    const formData = new URLSearchParams()
    formData.append('daily_budget', dailyBudgetMinor.toString())

    const response = await metaGraphFetch(`/${adsetId}`, accessToken.value, {
      method: 'POST',
      body: formData.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
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

    return NextResponse.json({
      ok: true,
      adsetId,
      daily_budget: dailyBudgetMinor,
    })
  } catch (error) {
    console.error('Adset budget update error:', error)
    return NextResponse.json(
      {
        error: 'meta_api_error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
