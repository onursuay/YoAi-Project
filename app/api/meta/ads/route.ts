import { NextRequest, NextResponse } from 'next/server';
import { getMetaAds } from '@/lib/metaApi';
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

    const ads = await getMetaAds(credentials.adAccountId as string);
    return NextResponse.json({ ads });
  } catch (error: any) {
    console.error('Meta ads API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

