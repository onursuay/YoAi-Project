import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/meta/crypto'
import { metaFetch } from '@/lib/meta/fetcher'

export async function GET() {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('meta_token')
  const adAccountCookie = cookieStore.get('meta_adaccount')
  const adAccountNameCookie = cookieStore.get('meta_adaccount_name')

  if (!tokenCookie) {
    return NextResponse.json({ connected: false })
  }

  const decryptedToken = decrypt(tokenCookie.value)
  if (!decryptedToken) {
    return NextResponse.json({ connected: false })
  }

  let adAccountName = adAccountNameCookie?.value || ''

  // If name not in cookie, fetch from API
  if (!adAccountName && adAccountCookie?.value) {
    try {
      const response = await metaFetch(
        '/me/adaccounts',
        decryptedToken,
        {
          params: {
            fields: 'id,name',
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        const account = (data.data || []).find((acc: any) => acc.id === adAccountCookie.value)
        if (account) {
          adAccountName = account.name || ''
        }
      }
    } catch (error) {
      console.error('Failed to fetch ad account name:', error)
    }
  }

  return NextResponse.json({
    connected: true,
    adAccountId: adAccountCookie?.value || undefined,
    adAccountName: adAccountName || undefined,
  })
}

