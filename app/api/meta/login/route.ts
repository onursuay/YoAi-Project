import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const appId = process.env.META_APP_ID;

  if (!appId) {
    return NextResponse.json(
      { error: "META_APP_ID or META_REDIRECT_URI is not configured" },
      { status: 500 }
    );
  }

  // Get redirect URI from env or generate from request origin
  const envRedirect = process.env.META_REDIRECT_URI;
  const origin = new URL(request.url).origin;
  const redirectUri = envRedirect ?? `${origin}/api/meta/callback`;

  // Generate state for CSRF protection
  const state = randomUUID();

  // Build Meta OAuth authorize URL
  const authorizeUrl = new URL("https://www.facebook.com/v20.0/dialog/oauth");
  authorizeUrl.searchParams.set("client_id", appId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "ads_read,ads_management,business_management");
  authorizeUrl.searchParams.set("state", state);

  // Store state in httpOnly cookie
  const cookieStore = await cookies();
  const response = NextResponse.redirect(authorizeUrl.toString());
  
  response.cookies.set("meta_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  return response;
}

