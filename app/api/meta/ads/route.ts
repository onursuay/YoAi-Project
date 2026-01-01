import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function getMetaCredentials() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('meta_access_token')?.value || process.env.META_SYSTEM_USER_TOKEN;
  const accountId = cookieStore.get('meta_account_id')?.value;
  
  if (!accountId) {
    throw new Error('Meta account ID not found');
  }
  
  const formattedAccountId = accountId.startsWith('act_') ? accountId : `act_${accountId}`;
  
  return { accessToken, accountId: formattedAccountId };
}

export async function GET(request: NextRequest) {
  try {
    const { accessToken, accountId } = await getMetaCredentials();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Meta access token not found' },
        { status: 401 }
      );
    }

    const adsUrl = new URL(`https://graph.facebook.com/v21.0/${accountId}/ads`);
    adsUrl.searchParams.set('access_token', accessToken);
    adsUrl.searchParams.set('fields', 'id,name,status,creative{thumbnail_url,title,body},adset{id,name}');
    adsUrl.searchParams.set('limit', '100');

    const response = await fetch(adsUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch ads' }));
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch Meta ads' },
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

    const ads = await Promise.all(
      (data.data || []).map(async (ad: any) => {
        try {
          const insightsUrl = new URL(`https://graph.facebook.com/v21.0/${ad.id}/insights`);
          insightsUrl.searchParams.set('access_token', accessToken);
          insightsUrl.searchParams.set('fields', 'spend,actions,revenue');
          insightsUrl.searchParams.set('time_range', JSON.stringify({ since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], until: new Date().toISOString().split('T')[0] }));

          const insightsResponse = await fetch(insightsUrl.toString());
          const insightsData = await insightsResponse.ok ? await insightsResponse.json() : null;
          const insights = insightsData?.data?.[0] || {};

          const spend = parseFloat(insights.spend || '0');
          const revenue = parseFloat(insights.revenue || '0');
          const roas = spend > 0 ? (revenue / spend).toFixed(1) : '0.0';

          return {
            id: ad.id,
            name: ad.name,
            thumbnail: ad.creative?.thumbnail_url || null,
            spend: `₺${spend.toFixed(2)}`,
            roas: `${roas}x`,
          };
        } catch (err) {
          return {
            id: ad.id,
            name: ad.name,
            thumbnail: ad.creative?.thumbnail_url || null,
            spend: '₺0.00',
            roas: '0.0x',
          };
        }
      })
    );

    return NextResponse.json({ ads });
  } catch (error: any) {
    if (error.message === 'Meta account ID not found') {
      return NextResponse.json(
        { error: 'Meta account ID not found. Please connect a Meta account first.' },
        { status: 400 }
      );
    }
    console.error('Meta ads API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

