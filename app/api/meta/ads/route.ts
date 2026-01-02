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

    // Fetch ads with detailed metrics
    const adsUrl = new URL(`https://graph.facebook.com/v21.0/${adAccountId}/ads`);
    adsUrl.searchParams.set('access_token', accessToken as string);
    adsUrl.searchParams.set('fields', 'id,name,status,adset_id,campaign_id,insights{spend,impressions,clicks,cpc,ctr,cpm,reach,frequency,actions,cost_per_action_type}');
    adsUrl.searchParams.set('limit', '100');

    const response = await fetch(adsUrl.toString());
    const data = await response.json();

    if (data.error) {
      console.error('Meta ads fetch error:', data.error);
      return NextResponse.json(
        { error: data.error.message || 'Failed to fetch ads' },
        { status: 500 }
      );
    }

    // Process ads with insights
    const ads = (data.data || []).map((ad: any) => {
      const insights = ad.insights?.data?.[0] || {};
      
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
        id: ad.id,
        name: ad.name || 'Unnamed Ad',
        status: ad.status || 'UNKNOWN',
        adsetId: ad.adset_id,
        campaignId: ad.campaign_id,
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

    return NextResponse.json({ ads });
  } catch (error: any) {
    console.error('Meta ads API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
