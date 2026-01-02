import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const accessToken = process.env.META_SYSTEM_USER_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Meta access token not configured' },
        { status: 500 }
      );
    }

    console.error('🔍 Fetching businesses...');
    
    const businessesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/businesses?fields=id,name&access_token=${accessToken}`
    );
    const businesses = await businessesRes.json();
    
    console.error('🔍 Found businesses:', businesses.data?.length);
    
    let allAccounts: any[] = [];
    
    for (const business of businesses.data || []) {
      try {
        const ownedRes = await fetch(
          `https://graph.facebook.com/v21.0/${business.id}/owned_ad_accounts?fields=id,name,account_id,account_status&limit=100&access_token=${accessToken}`
        );
        const ownedData = await ownedRes.json();
        allAccounts = [...allAccounts, ...(ownedData.data || [])];
        
        const clientRes = await fetch(
          `https://graph.facebook.com/v21.0/${business.id}/client_ad_accounts?fields=id,name,account_id,account_status&limit=100&access_token=${accessToken}`
        );
        const clientData = await clientRes.json();
        allAccounts = [...allAccounts, ...(clientData.data || [])];
      } catch (err) {
        console.error(`Failed to fetch accounts for business ${business.id}:`, err);
      }
    }
    
    const directRes = await fetch(
      `https://graph.facebook.com/v21.0/me/adaccounts?fields=id,name,account_id,account_status&limit=100&access_token=${accessToken}`
    );
    const directData = await directRes.json();
    allAccounts = [...allAccounts, ...(directData.data || [])];
    
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
