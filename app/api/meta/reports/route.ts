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

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');

    const insightsUrl = new URL(`https://graph.facebook.com/v19.0/${accountId}/insights`);
    insightsUrl.searchParams.set('access_token', accessToken);
    insightsUrl.searchParams.set('fields', 'date_start,date_stop,spend');
    insightsUrl.searchParams.set('time_range', JSON.stringify({ 
      since: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      until: new Date().toISOString().split('T')[0] 
    }));
    insightsUrl.searchParams.set('time_increment', '1');

    const response = await fetch(insightsUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to fetch reports' }));
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch Meta reports' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Log actual Meta API response for debugging
    console.log('Meta reports API response:', JSON.stringify(data, null, 2));

    if (data.error) {
      console.error('Meta reports API error:', data.error);
      return NextResponse.json(
        { error: data.error.message || 'Meta API error', metaError: data.error },
        { status: 400 }
      );
    }

    const dailyData = (data.data || []).map((item: any) => {
      const date = new Date(item.date_start);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return {
        name: dayNames[date.getDay()],
        spend: parseFloat(item.spend || '0'),
      };
    });

    return NextResponse.json({ dailyData });
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
    console.error('Meta reports API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

