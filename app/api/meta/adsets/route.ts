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

    // Fetch ad sets with detailed metrics
    const adsetsUrl = new URL(`https://graph.facebook.com/v21.0/${adAccountId}/adsets`);
    adsetsUrl.searchParams.set('access_token', accessToken as string);
    adsetsUrl.searchParams.set('fields', 'id,name,status,daily_budget,lifetime_budget,campaign_id,insights{spend,impressions,clicks,cpc,ctr,cpm,reach,frequency,actions,cost_per_action_type}');
    adsetsUrl.searchParams.set('limit', '100');

    const response = await fetch(adsetsUrl.toString());
    const data = await response.json();

    if (data.error) {
      console.error('Meta adsets fetch error:', data.error);
      return NextResponse.json(
        { error: data.error.message || 'Failed to fetch ad sets' },
        { status: 500 }
      );
    }

    // Process ad sets with insights
    const adsets = (data.data || []).map((adset: any) => {
      const insights = adset.insights?.data?.[0] || {};
      
      const conversions = insights.actions?.find((action: any) => 
        action.action_type === 'offsite_conversion.fb_pixel_purchase' ||
        action.action_type === 'purchase' ||
        action.action_type === 'offsite_conversion'
      )?.value || 0;

      const costPerConversion = insights.cost_per_action_type?.find((action: any) =>
        action.action_type === 'offsite_conversion.fb_pixel_purchase' ||
        action.action_type === 'purchase' ||
        action.action_type === 'offsite_conversion'
      )?.value || 0;

      return {
        id: adset.id,
        name: adset.name || 'Unnamed Ad Set',
        status: adset.status || 'UNKNOWN',
        campaignId: adset.campaign_id,
        dailyBudget: adset.daily_budget ? parseFloat(adset.daily_budget) / 100 : 0,
        lifetimeBudget: adset.lifetime_budget ? parseFloat(adset.lifetime_budget) / 100 : 0,
        spend: parseFloat(insights.spend || '0'),
        impressions: parseInt(insights.impressions || '0'),
        clicks: parseInt(insights.clicks || '0'),
        cpc: parseFloat(insights.cpc || '0'),
        ctr: parseFloat(insights.ctr || '0'),
        cpm: parseFloat(insights.cpm || '0'),
        reach: parseInt(insights.reach || '0'),
        frequency: parseFloat(insights.frequency || '0'),
        conversions: parseInt(conversions),
        costPerConversion: parseFloat(costPerConversion),
      };
    });

    return NextResponse.json({ adsets });
  } catch (error: any) {
    console.error('Meta adsets API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
