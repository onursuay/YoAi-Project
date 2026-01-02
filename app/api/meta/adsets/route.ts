import { NextRequest, NextResponse } from 'next/server';
import { getMetaAdSets } from '@/lib/metaApi';
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

    const adsets = await getMetaAdSets(credentials.adAccountId as string);
    return NextResponse.json({ adsets });
  } catch (error: any) {
    console.error('Meta adsets API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

