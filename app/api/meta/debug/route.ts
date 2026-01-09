import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("meta_access_token");
    const tokenPresent = !!tokenCookie?.value;

    const result = {
      ok: true,
      now: new Date().toISOString(),
      env: {
        META_APP_ID: !!process.env.META_APP_ID,
        META_APP_SECRET: !!process.env.META_APP_SECRET,
        META_REDIRECT_URI: !!process.env.META_REDIRECT_URI,
        NEXT_PUBLIC_BASE_URL: !!process.env.NEXT_PUBLIC_BASE_URL,
      },
      tokenPresent,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e?.message || 'debug route failed',
      },
      { status: 200 }
    );
  }
}
