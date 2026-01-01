import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    // Generate a secure random state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');
    
    // Store state in httpOnly cookie for verification
    const cookieStore = await cookies();
    cookieStore.set('meta_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    // Meta OAuth configuration
    const clientId = process.env.META_APP_ID || process.env.NEXT_PUBLIC_META_APP_ID;
    const redirectUri = process.env.META_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/meta/callback`;
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Meta App ID not configured' },
        { status: 500 }
      );
    }

    // Required scopes for Meta Marketing API
    const scopes = [
      'ads_read',
      'ads_management',
      'business_management',
      'read_insights',
    ].join(',');

    // Build Meta OAuth URL
    const authUrl = new URL('https://www.facebook.com/v21.0/dialog/oauth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('response_type', 'code');

    // Redirect to Meta OAuth
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('Meta OAuth auth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    );
  }
}

