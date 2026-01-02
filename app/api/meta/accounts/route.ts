import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('meta_access_token')?.value || null;
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.error('🔍 Fetching businesses...');
    
    // Step 1: Get businesses
    const businessesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/businesses?fields=id,name&access_token=${accessToken}`
    );
    const businesses = await businessesRes.json();
    
    if (businesses.error) {
      console.error('Businesses fetch error:', businesses.error);
      return NextResponse.json(
        { error: businesses.error.message || 'Failed to fetch businesses' },
        { status: 500 }
      );
    }
    
    console.error('🔍 Found businesses:', businesses.data?.length || 0);
    
    let allAccounts: any[] = [];
    
    // Step 2: Get accounts from each business
    for (const business of businesses.data || []) {
      try {
        // Owned accounts
        const ownedRes = await fetch(
          `https://graph.facebook.com/v21.0/${business.id}/owned_ad_accounts?fields=id,name,account_id,account_status&limit=100&access_token=${accessToken}`
        );
        const ownedData = await ownedRes.json();
        if (ownedData.data) {
          allAccounts = [...allAccounts, ...ownedData.data];
        }
        
        // Client accounts
        const clientRes = await fetch(
          `https://graph.facebook.com/v21.0/${business.id}/client_ad_accounts?fields=id,name,account_id,account_status&limit=100&access_token=${accessToken}`
        );
        const clientData = await clientRes.json();
        if (clientData.data) {
          allAccounts = [...allAccounts, ...clientData.data];
        }
        
        console.error(`🔍 Business ${business.name}: ${ownedData.data?.length || 0} owned, ${clientData.data?.length || 0} client`);
      } catch (err) {
        console.error(`Failed to fetch accounts for business ${business.id}:`, err);
      }
    }
    
    // Step 3: Get direct ad accounts
    console.error('🔍 Fetching direct ad accounts...');
    const directRes = await fetch(
      `https://graph.facebook.com/v21.0/me/adaccounts?fields=id,name,account_id,account_status&limit=100&access_token=${accessToken}`
    );
    const directData = await directRes.json();
    if (directData.data) {
      allAccounts = [...allAccounts, ...directData.data];
      console.error('🔍 Direct accounts:', directData.data.length);
    }
    
    // Step 4: Remove duplicates
    const uniqueAccounts = Array.from(
      new Map(
        allAccounts.map(acc => {
          const id = acc.account_id || acc.id;
          const formattedId = id?.startsWith('act_') ? id : `act_${id}`;
          return [formattedId, {
            id: formattedId,
            name: acc.name || 'Unnamed Account',
            status: acc.account_status === 1 ? 'Active' : 'Inactive'
          }];
        })
      ).values()
    );
    
    console.error('🔍 Total unique ad accounts:', uniqueAccounts.length);
    
    return NextResponse.json({ accounts: uniqueAccounts });
  } catch (error: any) {
    console.error('Meta accounts API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
