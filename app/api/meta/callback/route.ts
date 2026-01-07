import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorReason = url.searchParams.get("error_reason");
  const errorDescription = url.searchParams.get("error_description");

  if (error) {
    const redirect = new URL("/dashboard/settings/integrations", url.origin);
    redirect.searchParams.set("meta", "error");
    redirect.searchParams.set("error", error);
    if (errorReason) redirect.searchParams.set("error_reason", errorReason);
    if (errorDescription) redirect.searchParams.set("error_description", errorDescription);
    return NextResponse.redirect(redirect);
  }

  if (!code) {
    const redirect = new URL("/dashboard/settings/integrations", url.origin);
    redirect.searchParams.set("meta", "error");
    redirect.searchParams.set("error", "missing_code");
    return NextResponse.redirect(redirect);
  }

  const redirect = new URL("/dashboard/settings/integrations", url.origin);
  redirect.searchParams.set("meta", "connected_pending");
  redirect.searchParams.set("code", code);
  if (state) redirect.searchParams.set("state", state);

  return NextResponse.redirect(redirect);
}

