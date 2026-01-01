import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Placeholder for Google disconnect
  // TODO: Implement actual Google disconnect logic
  return NextResponse.json({
    success: true,
    message: 'Google account disconnected successfully',
  });
}

