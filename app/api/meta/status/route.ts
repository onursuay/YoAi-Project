import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/meta/crypto'

export async function GET() {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('meta_token')
  const adAccountCookie = cookieStore.get('meta_adaccount')

  if (!tokenCookie) {
    return NextResponse.json({ connected: false })
  }

  const decryptedToken = decrypt(tokenCookie.value)
  if (!decryptedToken) {
    return NextResponse.json({ connected: false })
  }

  return NextResponse.json({
    connected: true,
    adAccountId: adAccountCookie?.value || undefined,
  })
}

