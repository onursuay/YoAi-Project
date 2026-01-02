"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdAccountContextType {
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string | null) => void;
}

const AdAccountContext = createContext<AdAccountContextType | undefined>(undefined);

export function AdAccountProvider({ children }: { children: ReactNode }) {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('meta_ad_account_id');
    if (stored) {
      setSelectedAccountId(stored);
    }
  }, []);

  // Save to localStorage on change
  const handleSetAccount = (id: string | null) => {
    if (id) {
      localStorage.setItem('meta_ad_account_id', id);
    } else {
      localStorage.removeItem('meta_ad_account_id');
    }
    setSelectedAccountId(id);
  };

  return (
    <AdAccountContext.Provider value={{ 
      selectedAccountId, 
      setSelectedAccountId: handleSetAccount 
    }}>
      {children}
    </AdAccountContext.Provider>
  );
}

export function useAdAccount() {
  const context = useContext(AdAccountContext);
  if (!context) {
    throw new Error('useAdAccount must be used within AdAccountProvider');
  }
  return context;
}

