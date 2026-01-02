import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('meta_access_token')?.value;
    const accountId = cookieStore.get('meta_ad_account_id')?.value || cookieStore.get('meta_account_id')?.value;

    if (!accessToken) {
      return NextResponse.json({
        connected: false,
        accountId: null,
      });
    }

    // Verify OAuth token is still valid
    try {
      const verifyUrl = new URL('https://graph.facebook.com/v19.0/me');
      verifyUrl.searchParams.set('access_token', accessToken);
      verifyUrl.searchParams.set('fields', 'id');

      const verifyResponse = await fetch(verifyUrl.toString());

      if (!verifyResponse.ok) {
        // Token is invalid, clear cookies
        cookieStore.delete('meta_access_token');
        cookieStore.delete('meta_account_id');
        cookieStore.delete('meta_ad_account_id');
        
        return NextResponse.json({
          connected: false,
          accountId: null,
        });
      }

      const verifyData = await verifyResponse.json();
      
      if (verifyData.error) {
        cookieStore.delete('meta_access_token');
        cookieStore.delete('meta_account_id');
        cookieStore.delete('meta_ad_account_id');
        
        return NextResponse.json({
          connected: false,
          accountId: null,
        });
      }

      return NextResponse.json({
        connected: true,
        accountId: accountId || null,
      });
    } catch (error) {
      console.error('OAuth token verification error:', error);
      cookieStore.delete('meta_access_token');
      cookieStore.delete('meta_account_id');
      cookieStore.delete('meta_ad_account_id');
      
      return NextResponse.json({
        connected: false,
        accountId: null,
      });
    }
  } catch (error) {
    console.error('Meta status check error:', error);
    return NextResponse.json({
      connected: false,
      accountId: null,
    });
  }
}
