'use client';

import React, { createContext, useContext } from 'react';
import { useConnectionStore } from '@/lib/connectionStore';

interface AppContextType {
  isMetaConnected: boolean;
  isGoogleConnected: boolean;
  selectedMetaAccount: string;
  selectedGoogleAccount: string;
  setMetaConnected: (value: boolean) => void;
  setGoogleConnected: (value: boolean) => void;
  setSelectedMetaAccount: (id: string) => void;
  setSelectedGoogleAccount: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const {
    metaConnected,
    googleConnected,
    metaAccountId,
    googleAccountId,
    setMetaAccount,
    setGoogleAccount,
    disconnectMeta,
    disconnectGoogle,
  } = useConnectionStore();

  return (
    <AppContext.Provider
      value={{
        isMetaConnected: metaConnected,
        isGoogleConnected: googleConnected,
        selectedMetaAccount: metaAccountId || '',
        selectedGoogleAccount: googleAccountId || '',
        setMetaConnected: (value: boolean) => {
          if (!value) {
            disconnectMeta();
          }
        },
        setGoogleConnected: (value: boolean) => {
          if (!value) {
            disconnectGoogle();
          }
        },
        setSelectedMetaAccount: setMetaAccount,
        setSelectedGoogleAccount: setGoogleAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

