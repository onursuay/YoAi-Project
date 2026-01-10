import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('meta_access_token')

  if (!accessToken || !accessToken.value) {
    return NextResponse.json(
      { error: 'Not connected' },
      { status: 401 }
    )
  }

  // Check token expiration if available
  const expiresAtCookie = cookieStore.get('meta_access_expires_at')
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
    // Fetch ad accounts from Meta Graph API
    const url = new URL('https://graph.facebook.com/v20.0/me/adaccounts')
    url.searchParams.set('fields', 'id,name,account_status,currency,timezone_name')
    url.searchParams.set('limit', '100')
    url.searchParams.set('access_token', accessToken.value)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Meta API error - return 502 with readable message
      return NextResponse.json(
        {
          error: 'Failed to fetch ad accounts',
          details: errorData.error?.message || `HTTP ${response.status}`,
          meta_error: errorData.error || null,
        },
        { status: 502 }
      )
    }

    const data = await response.json()
    
    // Normalize accounts data - map fields to UI expected format
    const accounts = (data.data || []).map((account: any) => ({
      id: account.id,
      name: account.name || 'Unnamed Account',
      account_id: account.id, // Add account_id alias for compatibility
      status: account.account_status || 0,
      account_status: account.account_status || 0,
      currency: account.currency || '',
      timezone: account.timezone_name || '',
      timezone_name: account.timezone_name || '',
    }))

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('Ad accounts fetch error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch ad accounts',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 502 }
    )
  }
}

