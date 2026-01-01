'use client';

import MetaAccounts from '@/frames/MetaAccounts';
import { useApp } from '@/app/providers';

export default function MetaAccountsPage() {
  const { selectedMetaAccount, setSelectedMetaAccount } = useApp();

  return (
    <MetaAccounts 
      selectedId={selectedMetaAccount} 
      onSelect={setSelectedMetaAccount} 
    />
  );
}

