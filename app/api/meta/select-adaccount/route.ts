import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { adAccountId } = body

    if (!adAccountId || typeof adAccountId !== 'string') {
      return NextResponse.json(
        { error: 'adAccountId is required' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('meta_token')

    if (!tokenCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ ok: true })

    response.cookies.set('meta_adaccount', adAccountId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 90,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Select ad account error:', error)
    return NextResponse.json(
      { error: 'Failed to save ad account' },
      { status: 500 }
    )
  }
}

