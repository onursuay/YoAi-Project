import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/meta/crypto'
import { metaFetch } from '@/lib/meta/fetcher'

export async function GET() {
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

  try {
    const response = await metaFetch(
      '/me/adaccounts',
      decryptedToken,
      {
        params: {
          fields: 'id,name,account_status,currency,timezone_name',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch ad accounts' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const accounts = (data.data || []).map((account: any) => ({
      id: account.id,
      name: account.name,
      status: account.account_status,
      currency: account.currency,
      timezone: account.timezone_name,
    }))

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('Ad accounts fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ad accounts' },
      { status: 500 }
    )
  }
}

