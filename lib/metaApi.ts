const META_API_BASE = 'https://graph.facebook.com/v19.0';
const ACCESS_TOKEN = process.env.META_SYSTEM_USER_TOKEN;

if (!ACCESS_TOKEN) {
  throw new Error('META_SYSTEM_USER_TOKEN environment variable is not set');
}

async function metaApiCall(endpoint: string, params?: Record<string, string>): Promise<any> {
  const url = new URL(`${META_API_BASE}${endpoint}`);
  
  url.searchParams.set('access_token', ACCESS_TOKEN);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(errorData.error?.message || 'Meta API request failed');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'Meta API error');
  }

  return data;
}

export async function getMetaAdAccounts() {
  const data = await metaApiCall('/me/adaccounts', {
    fields: 'id,name,account_id,account_status,currency,timezone_name',
  });

  return (data.data || []).map((account: any) => {
    let accountId = account.account_id || account.id;
    if (accountId && !accountId.startsWith('act_')) {
      accountId = `act_${accountId}`;
    }
    
    return {
      id: accountId,
      name: account.name || 'Unnamed Account',
      status: account.account_status === 1 ? 'Active' : 
              account.account_status === 2 ? 'Disabled' : 
              account.account_status === 3 ? 'Unsettled' : 
              account.account_status === 7 ? 'Pending Risk Review' : 
              account.account_status === 9 ? 'In Grace Period' : 
              account.account_status === 100 ? 'Pending Closure' : 
              account.account_status === 101 ? 'Closed' : 'Unknown',
      currency: account.currency || 'TRY',
      timezone: account.timezone_name || 'UTC',
    };
  });
}

export async function getMetaCampaigns(adAccountId: string) {
  const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
  
  const data = await metaApiCall(`/${formattedAccountId}/campaigns`, {
    fields: 'id,name,status,daily_budget,lifetime_budget',
    limit: '100',
  });

  // Fetch insights for each campaign
  const campaigns = await Promise.all(
    (data.data || []).map(async (campaign: any) => {
      try {
        const insightsData = await metaApiCall(`/${campaign.id}/insights`, {
          fields: 'spend,actions',
          time_range: JSON.stringify({
            since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            until: new Date().toISOString().split('T')[0],
          }),
        });

        const insights = insightsData.data?.[0] || {};
        const spend = parseFloat(insights.spend || '0');
        const actions = insights.actions || [];
        const conversions = actions.find((a: any) => 
          a.action_type === 'purchase' || a.action_type === 'offsite_conversion'
        )?.value || '0';

        const budget = campaign.daily_budget 
          ? `₺${(parseFloat(campaign.daily_budget) / 100).toFixed(2)} / day`
          : campaign.lifetime_budget 
          ? `₺${(parseFloat(campaign.lifetime_budget) / 100).toFixed(2)}`
          : 'N/A';

        return {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status === 'ACTIVE' ? 'Active' : 
                  campaign.status === 'PAUSED' ? 'Paused' : 
                  campaign.status === 'ARCHIVED' ? 'Archived' : campaign.status,
          budget: budget,
          spend: `₺${spend.toFixed(2)}`,
          results: conversions,
        };
      } catch (err) {
        const budget = campaign.daily_budget 
          ? `₺${(parseFloat(campaign.daily_budget) / 100).toFixed(2)} / day`
          : 'N/A';
        
        return {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status === 'ACTIVE' ? 'Active' : 
                  campaign.status === 'PAUSED' ? 'Paused' : 
                  campaign.status === 'ARCHIVED' ? 'Archived' : campaign.status,
          budget: budget,
          spend: '₺0.00',
          results: '0',
        };
      }
    })
  );

  return campaigns;
}

export async function getMetaAdSets(adAccountId: string) {
  const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
  
  const data = await metaApiCall(`/${formattedAccountId}/adsets`, {
    fields: 'id,name,status,daily_budget,lifetime_budget,targeting,start_time,end_time',
    limit: '100',
  });

  return (data.data || []).map((adset: any) => {
    const budget = adset.daily_budget 
      ? `₺${(parseFloat(adset.daily_budget) / 100).toFixed(2)} / day`
      : adset.lifetime_budget 
      ? `₺${(parseFloat(adset.lifetime_budget) / 100).toFixed(2)}`
      : 'N/A';
    
    let targeting = 'N/A';
    if (adset.targeting) {
      const targets = [];
      if (adset.targeting.geo_locations?.countries) {
        targets.push(adset.targeting.geo_locations.countries.join(', '));
      }
      if (adset.targeting.age_min && adset.targeting.age_max) {
        targets.push(`${adset.targeting.age_min}-${adset.targeting.age_max}`);
      }
      if (adset.targeting.interests && adset.targeting.interests.length > 0) {
        targets.push(adset.targeting.interests[0].name);
      }
      targeting = targets.length > 0 ? targets.join(', ') : 'Broad';
    }

    const schedule = adset.end_time 
      ? `${new Date(adset.start_time).toLocaleDateString()} - ${new Date(adset.end_time).toLocaleDateString()}`
      : 'Ongoing';

    return {
      id: adset.id,
      name: adset.name,
      targeting: targeting,
      budget: budget,
      schedule: schedule,
    };
  });
}

export async function getMetaAds(adAccountId: string) {
  const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
  
  const data = await metaApiCall(`/${formattedAccountId}/ads`, {
    fields: 'id,name,status,creative{thumbnail_url,title,body}',
    limit: '100',
  });

  const ads = await Promise.all(
    (data.data || []).map(async (ad: any) => {
      try {
        const insightsData = await metaApiCall(`/${ad.id}/insights`, {
          fields: 'spend,revenue',
          time_range: JSON.stringify({
            since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            until: new Date().toISOString().split('T')[0],
          }),
        });

        const insights = insightsData.data?.[0] || {};
        const spend = parseFloat(insights.spend || '0');
        const revenue = parseFloat(insights.revenue || '0');
        const roas = spend > 0 ? (revenue / spend).toFixed(1) : '0.0';

        return {
          id: ad.id,
          name: ad.name,
          thumbnail: ad.creative?.thumbnail_url || null,
          spend: `₺${spend.toFixed(2)}`,
          roas: `${roas}x`,
        };
      } catch (err) {
        return {
          id: ad.id,
          name: ad.name,
          thumbnail: ad.creative?.thumbnail_url || null,
          spend: '₺0.00',
          roas: '0.0x',
        };
      }
    })
  );

  return ads;
}

