import { NextRequest, NextResponse } from 'next/server';
import { getSelectedAdAccountId } from '@/lib/metaSession';
import { getMetaReports } from '@/lib/metaApi';

export async function GET(request: NextRequest) {
  try {
    const accountId = await getSelectedAdAccountId();

    if (!accountId) {
      return NextResponse.json(
        { error: 'No ad account selected. Please select an ad account first.' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');

    const reports = await getMetaReports(accountId, days);
    return NextResponse.json(reports);
  } catch (error: any) {
    console.error('Meta reports API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

