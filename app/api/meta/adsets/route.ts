import { NextRequest, NextResponse } from 'next/server';
import { getMetaAdSets } from '@/lib/metaApi';
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

    const adsets = await getMetaAdSets(accountId);
    return NextResponse.json({ adsets });
  } catch (error: any) {
    console.error('Meta adsets API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

