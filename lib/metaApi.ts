const META_API_BASE = 'https://graph.facebook.com/v19.0';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`[META] Missing env var: ${name}`);
  return v;
}

const ACCESS_TOKEN = requireEnv('META_SYSTEM_USER_TOKEN');

// Cache for rate limit protection: key = endpoint + accountId, value = { data, timestamp }
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

// Track in-flight requests to deduplicate concurrent calls
const inFlightRequests = new Map<string, Promise<any>>();

function getCacheKey(endpoint: string, accountId?: string): string {
  return accountId ? `${endpoint}:${accountId}` : endpoint;
}

function isRateLimitError(error: any): boolean {
  if (typeof error === 'string') {
    return error.includes('rate limit') || error.includes('too many requests') || error.includes('API rate limit');
  }
  if (error?.error?.code === 4 || error?.error?.type === 'OAuthException') {
    const message = error.error?.message?.toLowerCase() || '';
    return message.includes('rate limit') || message.includes('too many requests');
  }
  return false;
}

async function metaApiCall(endpoint: string, params?: Record<string, string>, accountId?: string): Promise<any> {
  const cacheKey = getCacheKey(endpoint, accountId);
  const now = Date.now();

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }

  // Check if request is already in-flight
  const inFlight = inFlightRequests.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  // Create new request
  const requestPromise = (async () => {
    try {
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

      const responseData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));

      if (!response.ok || responseData.error) {
        // Check if it's a rate limit error
        if (isRateLimitError(responseData)) {
          // Return cached data if available, even if expired
          if (cached) {
            return cached.data;
          }
          throw new Error(responseData.error?.message || 'Meta API rate limit exceeded');
        }
        throw new Error(responseData.error?.message || 'Meta API request failed');
      }

      // Store in cache
      cache.set(cacheKey, { data: responseData, timestamp: now });

      return responseData;
    } finally {
      // Remove from in-flight requests
      inFlightRequests.delete(cacheKey);
    }
  })();

  // Track in-flight request
  inFlightRequests.set(cacheKey, requestPromise);

  return requestPromise;
}

export async function getMetaAdAccounts() {
  const data = await metaApiCall('/me/adaccounts', {
    fields: 'id,name,account_id,account_status,currency,timezone_name',
  }, undefined);

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
  }, formattedAccountId);

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
        }, formattedAccountId);

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
  }, formattedAccountId);

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
  }, formattedAccountId);

  const ads = await Promise.all(
    (data.data || []).map(async (ad: any) => {
      try {
        const insightsData = await metaApiCall(`/${ad.id}/insights`, {
          fields: 'spend,revenue',
          time_range: JSON.stringify({
            since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            until: new Date().toISOString().split('T')[0],
          }),
        }, formattedAccountId);

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

