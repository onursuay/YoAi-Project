'use client';

import React, { useState, createContext, useContext } from 'react';

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
  const [isMetaConnected, setIsMetaConnected] = useState(true);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [selectedMetaAccount, setSelectedMetaAccount] = useState('act_382104922');
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState('customer_901-223-1123');

  return (
    <AppContext.Provider
      value={{
        isMetaConnected,
        isGoogleConnected,
        selectedMetaAccount,
        selectedGoogleAccount,
        setMetaConnected: setIsMetaConnected,
        setGoogleConnected: setIsGoogleConnected,
        setSelectedMetaAccount,
        setSelectedGoogleAccount,
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

