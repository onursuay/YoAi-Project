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

    const adsetsUrl = new URL(`https://graph.facebook.com/v21.0/${accountId}/adsets`);
    adsetsUrl.searchParams.set('access_token', accessToken);
    adsetsUrl.searchParams.set('fields', 'id,name,status,daily_budget,lifetime_budget,targeting,start_time,end_time,billing_event,optimization_goal');
    adsetsUrl.searchParams.set('limit', '100');

    const response = await fetch(adsetsUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch adsets' }));
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch Meta ad sets' },
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

    const adsets = (data.data || []).map((adset: any) => {
      const budget = adset.daily_budget ? `${parseFloat(adset.daily_budget) / 100} / day` : adset.lifetime_budget ? `₺${parseFloat(adset.lifetime_budget) / 100}` : 'N/A';
      
      let targeting = 'N/A';
      if (adset.targeting) {
        const targets = [];
        if (adset.targeting.geo_locations?.countries) {
          targets.push(adset.targeting.geo_locations.countries.join(', '));
        }
        if (adset.targeting.age_min && adset.targeting.age_max) {
          targets.push(`${adset.targeting.age_min}-${adset.targeting.age_max}`);
        }
        if (adset.targeting.interests && adset.targeting.interests.length > 0) {
          targets.push(adset.targeting.interests[0].name);
        }
        targeting = targets.length > 0 ? targets.join(', ') : 'Broad';
      }

      const schedule = adset.end_time ? `${new Date(adset.start_time).toLocaleDateString()} - ${new Date(adset.end_time).toLocaleDateString()}` : 'Ongoing';

      return {
        id: adset.id,
        name: adset.name,
        targeting: targeting,
        budget: budget,
        schedule: schedule,
      };
    });

    return NextResponse.json({ adsets });
  } catch (error: any) {
    if (error.message === 'Meta account ID not found') {
      return NextResponse.json(
        { error: 'Meta account ID not found. Please connect a Meta account first.' },
        { status: 400 }
      );
    }
    console.error('Meta adsets API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

