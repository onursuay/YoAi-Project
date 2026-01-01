import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorReason = searchParams.get('error_reason');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error('Meta OAuth error:', { error, errorReason, errorDescription });
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/dashboard?meta_oauth_error=${error}`
      );
    }

    // Verify state parameter
    const cookieStore = await cookies();
    const storedState = cookieStore.get('meta_oauth_state')?.value;
    
    if (!state || !storedState || state !== storedState) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/dashboard?meta_oauth_error=invalid_state`
      );
    }

    // Clear the state cookie
    cookieStore.delete('meta_oauth_state');

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/dashboard?meta_oauth_error=no_code`
      );
    }

    // Exchange authorization code for access token
    const clientId = process.env.META_APP_ID || process.env.NEXT_PUBLIC_META_APP_ID;
    const clientSecret = process.env.META_APP_SECRET;
    const redirectUri = process.env.META_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/meta/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/dashboard?meta_oauth_error=config_error`
      );
    }

    // Exchange code for USER ACCESS TOKEN
    const tokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
    tokenUrl.searchParams.set('client_id', clientId);
    tokenUrl.searchParams.set('client_secret', clientSecret);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const tokenResponse = await fetch(tokenUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange error:', errorData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/dashboard?meta_oauth_error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Token response error:', tokenData.error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/dashboard?meta_oauth_error=${tokenData.error.message || 'token_error'}`
      );
    }

    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in || 5184000; // Default to 60 days if not provided

    if (!accessToken) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/dashboard?meta_oauth_error=no_token`
      );
    }

    // Get long-lived USER ACCESS TOKEN
    let longLivedToken = accessToken;
    let finalExpiresIn = expiresIn;
    try {
      const longLivedTokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
      longLivedTokenUrl.searchParams.set('grant_type', 'fb_exchange_token');
      longLivedTokenUrl.searchParams.set('client_id', clientId);
      longLivedTokenUrl.searchParams.set('client_secret', clientSecret);
      longLivedTokenUrl.searchParams.set('fb_exchange_token', accessToken);

      const longLivedResponse = await fetch(longLivedTokenUrl.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (longLivedResponse.ok) {
        const longLivedData = await longLivedResponse.json();
        if (longLivedData.access_token && !longLivedData.error) {
          longLivedToken = longLivedData.access_token;
          finalExpiresIn = longLivedData.expires_in || expiresIn;
        }
      }
    } catch (err) {
      console.warn('Failed to get long-lived token, using short-lived:', err);
    }

    // Store USER ACCESS TOKEN securely in httpOnly cookie (server-side only)
    cookieStore.set('meta_access_token', longLivedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: finalExpiresIn,
      path: '/',
    });

    // DO NOT auto-select account - user must select manually via /api/meta/accounts
    // Just verify token works by checking user info
    try {
      const meUrl = new URL('https://graph.facebook.com/v19.0/me');
      meUrl.searchParams.set('access_token', longLivedToken);
      meUrl.searchParams.set('fields', 'id,name');

      const meResponse = await fetch(meUrl.toString());
      if (!meResponse.ok) {
        const errorText = await meResponse.text();
        console.error('Token validation failed:', errorText);
      } else {
        const meData = await meResponse.json();
        console.log('Meta OAuth successful, user ID:', meData.id);
      }
    } catch (err) {
      console.warn('Failed to validate token:', err);
    }

    // Redirect to dashboard with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/dashboard?meta_connected=true`
    );
  } catch (error) {
    console.error('Meta OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/dashboard?meta_oauth_error=callback_error`
    );
  }
}

