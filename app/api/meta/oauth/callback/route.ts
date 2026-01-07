import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/meta/crypto'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      new URL('/dashboard/entegrasyon?meta=error', request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/dashboard/entegrasyon?meta=error', request.url)
    )
  }

  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  const redirectUri = process.env.META_REDIRECT_URI

  if (!appId || !appSecret || !redirectUri) {
    return NextResponse.json(
      { error: 'Konfigürasyon eksik' },
      { status: 400 }
    )
  }

  try {
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`
    
    const response = await fetch(tokenUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Token exchange failed')
    }

    const data = await response.json()
    const accessToken = data.access_token

    if (!accessToken) {
      throw new Error('No access token received')
    }

    const encryptedToken = encrypt(accessToken)
    if (!encryptedToken) {
      return NextResponse.json(
        { error: 'Token şifreleme hatası' },
        { status: 500 }
      )
    }

    const redirectResponse = NextResponse.redirect(
      new URL('/dashboard/entegrasyon?meta=connected', request.url)
    )

    redirectResponse.cookies.set('meta_token', encryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 90,
      path: '/',
    })

    return redirectResponse
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/dashboard/entegrasyon?meta=error', request.url)
    )
  }
}

