import { NextRequest, NextResponse } from 'next/server';
import { getMetaAdAccounts } from '@/lib/metaApi';

export async function GET(request: NextRequest) {
  try {
    const accounts = await getMetaAdAccounts();
    return NextResponse.json({ accounts });
  } catch (error: any) {
    console.error('Meta accounts API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

