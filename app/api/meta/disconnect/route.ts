import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Clear all Meta-related cookies
    cookieStore.delete('meta_access_token');
    cookieStore.delete('meta_account_id');
    cookieStore.delete('meta_oauth_state');

    return NextResponse.json({
      success: true,
      message: 'Meta account disconnected successfully',
    });
  } catch (error) {
    console.error('Meta disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Meta account' },
      { status: 500 }
    );
  }
}

