import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function getMetaCredentials() {
  const cookieStore = await cookies();
  // ONLY use USER ACCESS TOKEN from cookie (never system token)
  const accessToken = cookieStore.get('meta_access_token')?.value;
  const accountId = cookieStore.get('meta_account_id')?.value;
  
  if (!accessToken) {
    throw new Error('Meta access token not found. Please connect Meta account first.');
  }
  
  if (!accountId) {
    throw new Error('Meta account ID not found. Please select an ad account first.');
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

    const insightsUrl = new URL(`https://graph.facebook.com/v19.0/${accountId}/insights`);
    insightsUrl.searchParams.set('access_token', accessToken);
    insightsUrl.searchParams.set('fields', 'spend,impressions,clicks,ctr,cpc,actions,frequency');
    insightsUrl.searchParams.set('time_range', JSON.stringify({ 
      since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      until: new Date().toISOString().split('T')[0] 
    }));

    const response = await fetch(insightsUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch insights' }));
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch Meta overview data' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Log actual Meta API response for debugging
    console.log('Meta overview API response:', JSON.stringify(data, null, 2));

    if (data.error) {
      console.error('Meta overview API error:', data.error);
      return NextResponse.json(
        { error: data.error.message || 'Meta API error', metaError: data.error },
        { status: 400 }
      );
    }

    const insights = data.data?.[0] || {};
    const spend = parseFloat(insights.spend || '0');
    const impressions = parseFloat(insights.impressions || '0');
    const clicks = parseFloat(insights.clicks || '0');
    const cpc = parseFloat(insights.cpc || '0');
    const frequency = parseFloat(insights.frequency || '0');
    
    const actions = insights.actions || [];
    const conversions = actions.find((a: any) => a.action_type === 'purchase' || a.action_type === 'offsite_conversion')?.value || '0';

    return NextResponse.json({
      totalSpend: `₺${spend.toFixed(2)}`,
      avgCPC: `₺${cpc.toFixed(2)}`,
      conversions: parseInt(conversions).toLocaleString(),
      frequency: frequency.toFixed(1),
    });
  } catch (error: any) {
    if (error.message === 'Meta account ID not found. Please select an ad account first.') {
      return NextResponse.json(
        { error: 'Meta account ID not found. Please select an ad account first.' },
        { status: 400 }
      );
    }
    if (error.message === 'Meta access token not found. Please connect Meta account first.') {
      return NextResponse.json(
        { error: 'Meta access token not found. Please connect Meta account first.' },
        { status: 401 }
      );
    }
    console.error('Meta overview API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

