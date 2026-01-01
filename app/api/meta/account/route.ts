import { NextRequest, NextResponse } from 'next/server';
import { setSelectedAdAccountId } from '@/lib/metaSession';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    await setSelectedAdAccountId(accountId);

    return NextResponse.json({
      success: true,
      accountId: accountId.startsWith('act_') ? accountId : `act_${accountId}`,
    });
  } catch (error: any) {
    console.error('Meta account selection error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to select account' },
      { status: 500 }
    );
  }
}
