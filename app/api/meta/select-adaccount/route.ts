import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { adAccountId, adAccountName } = body

    if (!adAccountId || typeof adAccountId !== 'string') {
      return NextResponse.json(
        { error: 'adAccountId is required' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('meta_access_token')

    if (!accessToken || !accessToken.value) {
      return NextResponse.json(
        { error: 'Not connected' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ ok: true })

    // Set ad account ID cookie
    response.cookies.set('meta_adaccount_id', adAccountId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    // Set ad account name cookie if provided
    if (adAccountName && typeof adAccountName === 'string') {
      response.cookies.set('meta_adaccount_name', adAccountName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
    }

    return response
  } catch (error) {
    console.error('Select ad account error:', error)
    return NextResponse.json(
      { error: 'Failed to save ad account' },
      { status: 500 }
    )
  }
}

