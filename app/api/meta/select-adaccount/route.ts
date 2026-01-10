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
    const accessToken = cookieStore.get('meta_access_token')

    if (!accessToken || !accessToken.value) {
      return NextResponse.json(
        { error: 'Not connected' },
        { status: 401 }
      )
    }

    // Fetch account name from Meta API
    const accountResponse = await fetch(
      `https://graph.facebook.com/v20.0/${adAccountId}?fields=name&access_token=${accessToken.value}`
    )
    
    let accountName = 'Unknown Account'
    if (accountResponse.ok) {
      const accountData = await accountResponse.json()
      accountName = accountData.name || accountName
    }

    const response = NextResponse.json({ ok: true })

    // CORRECT cookie names to match status endpoint
    response.cookies.set('meta_selected_ad_account_id', adAccountId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    response.cookies.set('meta_selected_ad_account_name', accountName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
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
