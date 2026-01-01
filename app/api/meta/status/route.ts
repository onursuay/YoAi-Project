import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Priority 1: Check system user token from environment variables
    const systemUserToken = process.env.META_SYSTEM_USER_TOKEN;
    
    if (systemUserToken) {
      try {
        // Validate system user token by checking ad accounts (Marketing API)
        const accountsUrl = new URL('https://graph.facebook.com/v21.0/me/adaccounts');
        accountsUrl.searchParams.set('access_token', systemUserToken);
        accountsUrl.searchParams.set('fields', 'id,name,account_id');
        accountsUrl.searchParams.set('limit', '1');

        const accountsResponse = await fetch(accountsUrl.toString(), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json();
          
          // Check if response has data or if error indicates invalid token
          if (accountsData.data) {
            let accountId = accountsData.data.length > 0 
              ? (accountsData.data[0].account_id || accountsData.data[0].id)
              : null;
            
            // Ensure account_id has 'act_' prefix
            if (accountId && !accountId.startsWith('act_')) {
              accountId = `act_${accountId}`;
            }
            
            // Store account_id in cookie if not already stored
            const cookieStore = await cookies();
            const storedAccountId = cookieStore.get('meta_account_id')?.value;
            if (!storedAccountId && accountId) {
              cookieStore.set('meta_account_id', accountId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 5184000,
                path: '/',
              });
            }
            
            return NextResponse.json({
              connected: true,
              accountId: accountId,
            });
          }
          
          // If no data but no error, token might be valid but no accounts
          if (!accountsData.error) {
            return NextResponse.json({
              connected: true,
              accountId: null,
            });
          }
        }
        
        // If accounts endpoint failed, try basic token validation
        const verifyUrl = new URL('https://graph.facebook.com/v21.0/me');
        verifyUrl.searchParams.set('access_token', systemUserToken);
        verifyUrl.searchParams.set('fields', 'id');

        const verifyResponse = await fetch(verifyUrl.toString(), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          if (verifyData.id && !verifyData.error) {
            return NextResponse.json({
              connected: true,
              accountId: null,
            });
          }
        }
      } catch (error) {
        console.error('System user token verification error:', error);
      }
    }

    // Priority 2: Check OAuth token from cookies
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

      const verifyResponse = await fetch(verifyUrl.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

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

