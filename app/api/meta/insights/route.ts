import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const datePreset = searchParams.get("datePreset") || "last_30d";

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("meta_access_token");
  const selectedAdAccountId = cookieStore.get("meta_selected_ad_account_id");

  if (!accessToken || !accessToken.value) {
    return NextResponse.json(
      { error: "missing_token" },
      { status: 401 }
    );
  }

  if (!selectedAdAccountId || !selectedAdAccountId.value) {
    return NextResponse.json(
      { error: "no_ad_account_selected" },
      { status: 400 }
    );
  }

  // Check token expiration if available
  const expiresAtCookie = cookieStore.get("meta_access_expires_at");
  if (expiresAtCookie) {
    const expiresAt = parseInt(expiresAtCookie.value, 10);
    if (Date.now() >= expiresAt) {
      return NextResponse.json(
        { error: "token_expired" },
        { status: 401 }
      );
    }
  }

  try {
    // Ensure ad_account_id starts with 'act_'
    const accountId = selectedAdAccountId.value.startsWith("act_")
      ? selectedAdAccountId.value
      : `act_${selectedAdAccountId.value.replace("act_", "")}`;

    // Fetch insights from Meta Graph API
    const url = new URL(`https://graph.facebook.com/v20.0/${accountId}/insights`);
    url.searchParams.set("fields", "spend,impressions,clicks,ctr,cpc,actions,action_values,purchase_roas");
    url.searchParams.set("date_preset", datePreset);
    url.searchParams.set("limit", "1");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: "Failed to fetch insights",
          details: errorData.error?.message || `HTTP ${response.status}`,
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const insights = data.data || [];
    
    // Aggregate insights data
    const aggregated = insights.reduce(
      (acc: any, item: any) => {
        // Parse actions for purchases
        const actions = item.actions || [];
        const purchaseAction = actions.find((a: any) => a.action_type === "purchase");
        const purchases = purchaseAction ? parseInt(purchaseAction.value || "0", 10) : 0;
        acc.purchases += purchases;

        // Parse action_values for purchase value
        const actionValues = item.action_values || [];
        const purchaseValueAction = actionValues.find((av: any) => av.action_type === "purchase");
        if (purchaseValueAction) {
          acc.purchaseValue += parseFloat(purchaseValueAction.value || "0");
        }

        // Use purchase_roas if available, otherwise calculate from purchase value
        if (item.purchase_roas) {
          acc.roas = parseFloat(item.purchase_roas);
        }

        acc.spend += parseFloat(item.spend || "0");
        acc.impressions += parseInt(item.impressions || "0", 10);
        acc.clicks += parseInt(item.clicks || "0", 10);
        acc.ctr += parseFloat(item.ctr || "0");
        acc.cpc += parseFloat(item.cpc || "0");

        return acc;
      },
      {
        spend: 0,
        purchases: 0,
        purchaseValue: 0,
        roas: 0,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        cpc: 0,
      }
    );

    // Calculate ROAS if not already set
    if (aggregated.roas === 0 && aggregated.spend > 0 && aggregated.purchaseValue > 0) {
      aggregated.roas = aggregated.purchaseValue / aggregated.spend;
    }

    // Calculate average CTR and CPC
    if (insights.length > 0) {
      aggregated.ctr = aggregated.ctr / insights.length;
      aggregated.cpc = aggregated.cpc / insights.length;
    }

    return NextResponse.json({
      spendTRY: aggregated.spend,
      purchases: aggregated.purchases,
      roas: aggregated.roas || 0,
      impressions: aggregated.impressions,
      clicks: aggregated.clicks,
      ctr: aggregated.ctr,
      cpcTRY: aggregated.cpc,
    });
  } catch (error) {
    console.error("Insights fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch insights",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
