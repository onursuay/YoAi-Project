import { NextRequest, NextResponse } from 'next/server';
import { getMetaCredentials } from '@/lib/utils/metaApiHelper';

export async function GET(request: NextRequest) {
  try {
    const credentials = await getMetaCredentials(request);

    if (credentials.error) {
      return NextResponse.json(
        { error: credentials.error },
        { status: credentials.status }
      );
    }

    const { adAccountId, accessToken } = credentials;

    // Get insights for last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const dateStart = sevenDaysAgo.toISOString().split('T')[0];
    const dateEnd = today.toISOString().split('T')[0];

    const insightsUrl = new URL(`https://graph.facebook.com/v21.0/${adAccountId}/insights`);
    insightsUrl.searchParams.set('access_token', accessToken as string);
    insightsUrl.searchParams.set('time_range', JSON.stringify({ since: dateStart, until: dateEnd }));
    insightsUrl.searchParams.set('fields', 'spend,cpc,actions,frequency');
    insightsUrl.searchParams.set('level', 'account');

    const response = await fetch(insightsUrl.toString());
    const data = await response.json();

    if (data.error) {
      console.error('Meta insights error:', data.error);
      return NextResponse.json(
        { error: data.error.message || 'Failed to fetch insights' },
        { status: 500 }
      );
    }

    const insights = data.data?.[0] || {};
    
    // Extract conversions from actions array
    const conversions = insights.actions?.find((action: any) => 
      action.action_type === 'offsite_conversion.fb_pixel_purchase' ||
      action.action_type === 'offsite_conversion'
    )?.value || 0;

    return NextResponse.json({
      totalSpend: parseFloat(insights.spend || '0'),
      avgCpc: parseFloat(insights.cpc || '0'),
      conversions: parseInt(conversions),
      frequency: parseFloat(insights.frequency || '0'),
    });
  } catch (error: any) {
    console.error('Meta overview API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
