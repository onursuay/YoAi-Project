import { NextRequest, NextResponse } from 'next/server';
import { getMetaAds } from '@/lib/metaApi';
import { getSelectedAdAccountId } from '@/lib/metaSession';

export async function GET(request: NextRequest) {
  try {
    const accountId = await getSelectedAdAccountId();

    if (!accountId) {
      return NextResponse.json(
        { error: 'No ad account selected. Please select an ad account first.' },
        { status: 400 }
      );
    }

    const ads = await getMetaAds(accountId);
    return NextResponse.json({ ads });
  } catch (error: any) {
    console.error('Meta ads API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

