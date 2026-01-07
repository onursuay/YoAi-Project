import { NextResponse } from "next/server";
import { encrypt } from "@/lib/meta/crypto";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorReason = url.searchParams.get("error_reason");
  const errorDescription = url.searchParams.get("error_description");

  if (error) {
    const redirect = new URL("/dashboard/settings/integrations", url.origin);
    redirect.searchParams.set("meta", "error");
    redirect.searchParams.set("error", error);
    if (errorReason) redirect.searchParams.set("error_reason", errorReason);
    if (errorDescription) redirect.searchParams.set("error_description", errorDescription);
    return NextResponse.redirect(redirect);
  }

  if (!code) {
    const redirect = new URL("/dashboard/settings/integrations", url.origin);
    redirect.searchParams.set("meta", "error");
    redirect.searchParams.set("error", "missing_code");
    return NextResponse.redirect(redirect);
  }

  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = process.env.META_REDIRECT_URI;

  if (!appId || !appSecret || !redirectUri) {
    const redirect = new URL("/dashboard/settings/integrations", url.origin);
    redirect.searchParams.set("meta", "error");
    redirect.searchParams.set("error", "configuration_missing");
    return NextResponse.redirect(redirect);
  }

  try {
    // Step 1: Exchange code for short-lived access token
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`;
    
    const tokenResponse = await fetch(tokenUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error("Token exchange failed:", errorData);
      throw new Error(errorData.error?.message || "Token exchange failed");
    }

    const tokenData = await tokenResponse.json();
    const shortLivedToken = tokenData.access_token;

    if (!shortLivedToken) {
      throw new Error("No access token received");
    }

    // Step 2: Exchange short-lived token for long-lived token
    const longLivedTokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;
    
    const longLivedResponse = await fetch(longLivedTokenUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let finalToken = shortLivedToken;
    let expiresIn = tokenData.expires_in || 3600;

    if (longLivedResponse.ok) {
      const longLivedData = await longLivedResponse.json();
      if (longLivedData.access_token) {
        finalToken = longLivedData.access_token;
        expiresIn = longLivedData.expires_in || 5184000; // 60 days default
      }
    } else {
      console.warn("Long-lived token exchange failed, using short-lived token");
    }

    // Step 3: Encrypt and store token in cookie
    const encryptedToken = encrypt(finalToken);
    if (!encryptedToken) {
      const redirect = new URL("/dashboard/settings/integrations", url.origin);
      redirect.searchParams.set("meta", "error");
      redirect.searchParams.set("error", "encryption_failed");
      return NextResponse.redirect(redirect);
    }

    const redirectResponse = NextResponse.redirect(
      new URL("/dashboard/settings/integrations?meta=connected", url.origin)
    );

    // Set cookie with max age based on token expiration
    const maxAge = Math.min(expiresIn, 60 * 60 * 24 * 90); // Max 90 days
    redirectResponse.cookies.set("meta_token", encryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge,
      path: "/",
    });

    // Store token expiration timestamp
    const expiresAt = Date.now() + expiresIn * 1000;
    redirectResponse.cookies.set("meta_token_expires_at", expiresAt.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge,
      path: "/",
    });

    return redirectResponse;
  } catch (error) {
    console.error("OAuth callback error:", error);
    const redirect = new URL("/dashboard/settings/integrations", url.origin);
    redirect.searchParams.set("meta", "error");
    redirect.searchParams.set("error", "token_exchange_failed");
    return NextResponse.redirect(redirect);
  }
}

