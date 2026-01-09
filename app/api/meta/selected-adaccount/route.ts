import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const adAccountId = cookieStore.get("meta_selected_ad_account_id")?.value || null;

  return NextResponse.json({ adAccountId });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { adAccountId } = body;

    if (!adAccountId || typeof adAccountId !== "string") {
      return NextResponse.json(
        { error: "adAccountId is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const response = NextResponse.json({ ok: true });

    response.cookies.set("meta_selected_ad_account_id", adAccountId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Select ad account error:", error);
    return NextResponse.json(
      { error: "Failed to save ad account" },
      { status: 500 }
    );
  }
}
