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
  
  // Ensure account_id has 'act_' prefix
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

    const campaignsUrl = new URL(`https://graph.facebook.com/v19.0/${accountId}/campaigns`);
    campaignsUrl.searchParams.set('access_token', accessToken);
    campaignsUrl.searchParams.set('fields', 'id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time,created_time,updated_time');
    campaignsUrl.searchParams.set('limit', '100');

    const response = await fetch(campaignsUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch campaigns' }));
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch Meta campaigns' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Log actual Meta API response for debugging
    console.log('Meta campaigns API response:', JSON.stringify(data, null, 2));

    if (data.error) {
      console.error('Meta campaigns API error:', data.error);
      return NextResponse.json(
        { error: data.error.message || 'Meta API error', metaError: data.error },
        { status: 400 }
      );
    }

    if (!data.data || data.data.length === 0) {
      console.log('No campaigns found for account:', accountId);
    }

    // Fetch insights for each campaign to get spend and results
    const campaigns = await Promise.all(
      (data.data || []).map(async (campaign: any) => {
        try {
          const insightsUrl = new URL(`https://graph.facebook.com/v19.0/${campaign.id}/insights`);
          insightsUrl.searchParams.set('access_token', accessToken);
          insightsUrl.searchParams.set('fields', 'spend,impressions,clicks,actions');
          insightsUrl.searchParams.set('time_range', JSON.stringify({ since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], until: new Date().toISOString().split('T')[0] }));

          const insightsResponse = await fetch(insightsUrl.toString());
          const insightsData = await insightsResponse.ok ? await insightsResponse.json() : null;
          const insights = insightsData?.data?.[0] || {};

          const spend = parseFloat(insights.spend || '0');
          const actions = insights.actions || [];
          const conversions = actions.find((a: any) => a.action_type === 'purchase' || a.action_type === 'offsite_conversion')?.value || '0';

          const budget = campaign.daily_budget ? `${parseFloat(campaign.daily_budget) / 100} / day` : campaign.lifetime_budget ? `₺${parseFloat(campaign.lifetime_budget) / 100}` : 'N/A';

          return {
            id: campaign.id,
            name: campaign.name,
            status: campaign.status === 'ACTIVE' ? 'Active' : campaign.status === 'PAUSED' ? 'Paused' : campaign.status === 'ARCHIVED' ? 'Archived' : campaign.status,
            budget: budget,
            spend: `₺${spend.toFixed(2)}`,
            results: conversions,
          };
        } catch (err) {
          return {
            id: campaign.id,
            name: campaign.name,
            status: campaign.status === 'ACTIVE' ? 'Active' : campaign.status === 'PAUSED' ? 'Paused' : campaign.status === 'ARCHIVED' ? 'Archived' : campaign.status,
            budget: campaign.daily_budget ? `${parseFloat(campaign.daily_budget) / 100} / day` : 'N/A',
            spend: '₺0.00',
            results: '0',
          };
        }
      })
    );

    return NextResponse.json({ campaigns });
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
    console.error('Meta campaigns API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

