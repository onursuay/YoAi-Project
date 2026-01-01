'use client';

import GoogleAccounts from '@/frames/GoogleAccounts';
import { useApp } from '@/app/providers';

export default function GoogleAccountsPage() {
  const { selectedGoogleAccount, setSelectedGoogleAccount } = useApp();

  return (
    <GoogleAccounts 
      selectedId={selectedGoogleAccount} 
      onSelect={setSelectedGoogleAccount} 
    />
  );
}

