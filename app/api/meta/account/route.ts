import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

    const cookieStore = await cookies();
    
    // Ensure account_id has 'act_' prefix
    const formattedAccountId = accountId.startsWith('act_') ? accountId : `act_${accountId}`;
    
    // Get token expiration from existing cookie or set default
    const existingToken = cookieStore.get('meta_access_token');
    const maxAge = existingToken ? undefined : 5184000; // 60 days default

    cookieStore.set('meta_account_id', formattedAccountId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      accountId: formattedAccountId,
    });
  } catch (error) {
    console.error('Meta account update error:', error);
    return NextResponse.json(
      { error: 'Failed to update account ID' },
      { status: 500 }
    );
  }
}

