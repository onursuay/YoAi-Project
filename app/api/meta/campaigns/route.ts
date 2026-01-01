import { NextRequest, NextResponse } from 'next/server';
import { getMetaCampaigns } from '@/lib/metaApi';
import { getSelectedAdAccountId } from '@/lib/metaSession';

export async function GET(request: NextRequest) {
  try {
    const accountId = await getSelectedAdAccountId();

    if (!accountId) {
      return NextResponse.json(
        { error: 'No ad account selected' },
        { status: 401 }
      );
    }

    const campaigns = await getMetaCampaigns(accountId);
    return NextResponse.json({ campaigns });
  } catch (error: any) {
    console.error('Meta campaigns API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

