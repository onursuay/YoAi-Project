import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const error = url.searchParams.get("error")
  const errorDescription = url.searchParams.get("error_description")

  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard/entegrasyon?meta=error&reason=${encodeURIComponent(errorDescription || error)}`, url.origin)
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/dashboard/entegrasyon?meta=error&reason=missing_code_or_state', url.origin)
    )
  }

  const cookieStore = await cookies()
  const expectedState = cookieStore.get("meta_oauth_state")?.value

  if (!expectedState || expectedState !== state) {
    return NextResponse.redirect(
      new URL('/dashboard/entegrasyon?meta=error&reason=invalid_state', url.origin)
    )
  }

  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET

  if (!appId || !appSecret) {
    return NextResponse.redirect(
      new URL('/dashboard/entegrasyon?meta=error&reason=missing_app_config', url.origin)
    )
  }

  const origin = url.origin
  const redirectUri = process.env.META_REDIRECT_URI ?? `${origin}/api/meta/callback`

  // Exchange code -> access_token
  const tokenUrl = new URL("https://graph.facebook.com/v20.0/oauth/access_token")
  tokenUrl.searchParams.set("client_id", appId)
  tokenUrl.searchParams.set("client_secret", appSecret)
  tokenUrl.searchParams.set("redirect_uri", redirectUri)
  tokenUrl.searchParams.set("code", code)

  const tokenRes = await fetch(tokenUrl.toString(), { method: "GET" })
  const tokenJson: any = await tokenRes.json()

  if (!tokenRes.ok || !tokenJson?.access_token) {
    const reason = tokenJson?.error?.message || "token_exchange_failed"
    return NextResponse.redirect(
      new URL(`/dashboard/entegrasyon?meta=error&reason=${encodeURIComponent(reason)}`, url.origin)
    )
  }

  const response = NextResponse.redirect(
    new URL('/connect/meta', url.origin)
  )

  // clear one-time state cookie
  response.cookies.set("meta_oauth_state", "", { maxAge: 0, path: "/" })

  // store access token as httpOnly cookie
  response.cookies.set("meta_access_token", tokenJson.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  // Store expiry time
  const expiresAt = Date.now() + (60 * 60 * 24 * 30 * 1000)
  response.cookies.set("meta_access_expires_at", expiresAt.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })

  return response
}
