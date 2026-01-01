import { NextRequest, NextResponse } from 'next/server';
import { getSelectedAdAccountId } from '@/lib/metaSession';
import { getMetaOverview } from '@/lib/metaApi';

export async function GET(request: NextRequest) {
  try {
    const accountId = await getSelectedAdAccountId();

    if (!accountId) {
      return NextResponse.json(
        { error: 'No ad account selected. Please select an ad account first.' },
        { status: 400 }
      );
    }

    const overview = await getMetaOverview(accountId);
    return NextResponse.json(overview);
  } catch (error: any) {
    console.error('Meta overview API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

