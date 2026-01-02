import { NextRequest } from 'next/server';
import { getSelectedAdAccountId } from '@/lib/metaSession';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`[META] Missing env var: ${name}`);
  return v;
}

async function getAccessTokenFromSession(): Promise<string | null> {
  // Get Meta access token from environment variable (system user token)
  // In the future, this could be extended to get from session/DB
  try {
    return requireEnv('META_SYSTEM_USER_TOKEN');
  } catch (error) {
    return null;
  }
}

export interface MetaCredentials {
  adAccountId: string;
  accessToken: string;
  error: null;
}

export interface MetaCredentialsError {
  adAccountId: null;
  accessToken: null;
  error: string;
  status: number;
}

export async function getMetaCredentials(
  request: NextRequest
): Promise<MetaCredentials | MetaCredentialsError> {
  // 1. Get ad account ID from header (sent by client) or cookie (fallback)
  let adAccountId = request.headers.get('x-ad-account-id');
  
  // If not in header, try to get from cookie
  if (!adAccountId) {
    adAccountId = await getSelectedAdAccountId();
  }
  
  if (!adAccountId) {
    return {
      adAccountId: null,
      accessToken: null,
      error: 'No ad account selected',
      status: 400,
    };
  }

  // Ensure account_id has 'act_' prefix
  const formattedAccountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;

  // 2. Get Meta access token (from environment variable)
  const accessToken = await getAccessTokenFromSession();
  
  if (!accessToken) {
    return {
      adAccountId: null,
      accessToken: null,
      error: 'Unauthorized',
      status: 401,
    };
  }

  return {
    adAccountId: formattedAccountId,
    accessToken,
    error: null,
  };
}

