'use client';

/**
 * Client-side Meta API fetch utilities
 * All functions automatically include x-ad-account-id header from localStorage
 */

function getAdAccountId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('meta_ad_account_id');
}

async function fetchWithAccountId(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const adAccountId = getAdAccountId();
  
  if (!adAccountId) {
    throw new Error('No ad account selected');
  }

  const headers = new Headers(options.headers);
  headers.set('x-ad-account-id', adAccountId);

  return fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include', // Include cookies
  });
}

export async function fetchMetaCampaigns() {
  const adAccountId = localStorage.getItem('meta_ad_account_id');
  console.log('📤 Sending API request with Account ID:', adAccountId);
  
  const response = await fetchWithAccountId('/api/meta/campaigns');
  
  console.log('📥 API Response Status:', response.status);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch campaigns');
  }

  return response.json();
}

export async function fetchMetaAdSets() {
  const response = await fetchWithAccountId('/api/meta/adsets');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch ad sets');
  }

  return response.json();
}

export async function fetchMetaAds() {
  const response = await fetchWithAccountId('/api/meta/ads');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch ads');
  }

  return response.json();
}

export async function fetchMetaOverview() {
  const response = await fetchWithAccountId('/api/meta/overview');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch overview');
  }

  return response.json();
}

export async function fetchMetaReports(days: number = 30) {
  const response = await fetchWithAccountId(
    `/api/meta/reports?days=${days}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch reports');
  }

  return response.json();
}

