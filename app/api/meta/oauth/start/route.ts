import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

export async function GET() {
  const appId = process.env.META_APP_ID
  const redirectUri = process.env.META_REDIRECT_URI
  const scopes = process.env.META_SCOPES || 'ads_read,business_management'

  if (!appId || !redirectUri) {
    return NextResponse.json(
      { error: 'Konfigürasyon eksik: META_APP_ID veya META_REDIRECT_URI tanımlı değil' },
      { status: 400 }
    )
  }

  const state = randomUUID()
  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${state}&response_type=code`

  return NextResponse.redirect(authUrl)
}

