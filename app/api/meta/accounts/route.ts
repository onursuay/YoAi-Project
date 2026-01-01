import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function getMetaCredentials() {
  const cookieStore = await cookies();
  // ONLY use USER ACCESS TOKEN from cookie (never system token)
  const accessToken = cookieStore.get('meta_access_token')?.value;
  return { accessToken };
}

export async function GET(request: NextRequest) {
  try {
    const { accessToken } = await getMetaCredentials();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Meta access token not found' },
        { status: 401 }
      );
    }

    const accountsUrl = new URL('https://graph.facebook.com/v19.0/me/adaccounts');
    accountsUrl.searchParams.set('access_token', accessToken);
    accountsUrl.searchParams.set('fields', 'id,name,account_id,account_status,currency,timezone_name');

    const response = await fetch(accountsUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch accounts' }));
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch Meta ad accounts' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message || 'Meta API error' },
        { status: 400 }
      );
    }

    const accounts = (data.data || []).map((account: any) => {
      let accountId = account.account_id || account.id;
      // Ensure account_id has 'act_' prefix
      if (accountId && !accountId.startsWith('act_')) {
        accountId = `act_${accountId}`;
      }
      return {
        id: accountId,
        name: account.name || 'Unnamed Account',
        status: account.account_status === 1 ? 'Active' : account.account_status === 2 ? 'Disabled' : account.account_status === 3 ? 'Unsettled' : account.account_status === 7 ? 'Pending Risk Review' : account.account_status === 9 ? 'In Grace Period' : account.account_status === 100 ? 'Pending Closure' : account.account_status === 101 ? 'Closed' : 'Unknown',
        currency: account.currency || 'USD',
        timezone: account.timezone_name || 'UTC',
      };
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Meta accounts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

