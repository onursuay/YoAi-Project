import { NextRequest, NextResponse } from 'next/server';
import { getMetaCampaigns } from '@/lib/metaApi';
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

    const campaigns = await getMetaCampaigns(credentials.adAccountId as string);
    return NextResponse.json({ campaigns });
  } catch (error: any) {
    console.error('Meta campaigns API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

