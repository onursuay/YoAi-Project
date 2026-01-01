import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Placeholder for Google connection status
  // TODO: Implement actual Google OAuth status check
  return NextResponse.json({
    connected: false,
    accountId: null,
  });
}

