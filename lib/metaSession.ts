import { cookies } from 'next/headers';

const COOKIE_NAME = 'meta_ad_account_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function getSelectedAdAccountId(): Promise<string | null> {
  const cookieStore = await cookies();
  const accountId = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!accountId) {
    return null;
  }
  
  // Ensure account_id has 'act_' prefix
  return accountId.startsWith('act_') ? accountId : `act_${accountId}`;
}

export async function setSelectedAdAccountId(accountId: string): Promise<void> {
  const cookieStore = await cookies();
  
  // Ensure account_id has 'act_' prefix
  const formattedAccountId = accountId.startsWith('act_') ? accountId : `act_${accountId}`;
  
  cookieStore.set(COOKIE_NAME, formattedAccountId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function clearSelectedAdAccountId(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

