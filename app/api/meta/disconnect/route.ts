import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  const response = NextResponse.json({ success: true })

  // Clear all Meta-related cookies
  const metaCookies = [
    'meta_access_token',
    'meta_access_expires_at',
    'meta_selected_ad_account_id',
    'meta_selected_ad_account_name',
    'meta_oauth_state',
  ]

  metaCookies.forEach((cookieName) => {
    response.cookies.set(cookieName, '', {
      maxAge: 0,
      path: '/',
      httpOnly: cookieName === 'meta_access_token' || cookieName === 'meta_oauth_state',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
  })

  return response
}
