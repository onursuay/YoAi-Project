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

    // Fetch campaigns with detailed metrics
    const campaignsUrl = new URL(`https://graph.facebook.com/v21.0/${adAccountId}/campaigns`);
    campaignsUrl.searchParams.set('access_token', accessToken);
    campaignsUrl.searchParams.set('fields', 'id,name,status,daily_budget,lifetime_budget,insights{spend,impressions,clicks,cpc,ctr,cpm,reach,frequency,actions,cost_per_action_type}');
    campaignsUrl.searchParams.set('limit', '100');

    const response = await fetch(campaignsUrl.toString());
    const data = await response.json();

    if (data.error) {
      console.error('Meta campaigns fetch error:', data.error);
      return NextResponse.json(
        { error: data.error.message || 'Failed to fetch campaigns' },
        { status: 500 }
      );
    }

    // Process campaigns with insights
    const campaigns = (data.data || []).map((campaign: any) => {
      const insights = campaign.insights?.data?.[0] || {};
      
      // Extract conversions from actions array
      const conversions = insights.actions?.find((action: any) => 
        action.action_type === 'offsite_conversion.fb_pixel_purchase' ||
        action.action_type === 'purchase' ||
        action.action_type === 'offsite_conversion'
      )?.value || 0;

      // Extract cost per conversion
      const costPerConversion = insights.cost_per_action_type?.find((action: any) =>
        action.action_type === 'offsite_conversion.fb_pixel_purchase' ||
        action.action_type === 'purchase' ||
        action.action_type === 'offsite_conversion'
      )?.value || 0;

      return {
        id: campaign.id,
        name: campaign.name || 'Unnamed Campaign',
        status: campaign.status || 'UNKNOWN',
        dailyBudget: campaign.daily_budget ? parseFloat(campaign.daily_budget) / 100 : 0,
        lifetimeBudget: campaign.lifetime_budget ? parseFloat(campaign.lifetime_budget) / 100 : 0,
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

    return NextResponse.json({ campaigns });
  } catch (error: any) {
    console.error('Meta campaigns API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
