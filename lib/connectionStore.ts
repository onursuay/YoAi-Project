'use client';

import React, { useState, useCallback } from 'react';

const META_ACCOUNT_KEY = 'YOAI_META_ACCOUNT_ID';
const GOOGLE_ACCOUNT_KEY = 'YOAI_GOOGLE_ACCOUNT_ID';

interface ConnectionState {
  metaConnected: boolean;
  googleConnected: boolean;
  metaAccountId: string | null;
  googleAccountId: string | null;
  loadingMeta: boolean;
  loadingGoogle: boolean;
}

class ConnectionStore {
  private state: ConnectionState = {
    metaConnected: false,
    googleConnected: false,
    metaAccountId: null,
    googleAccountId: null,
    loadingMeta: false,
    loadingGoogle: false,
  };

  private listeners: Set<() => void> = new Set();

  constructor() {
    // Load persisted account IDs from localStorage
    if (typeof window !== 'undefined') {
      const metaAccountId = localStorage.getItem(META_ACCOUNT_KEY);
      const googleAccountId = localStorage.getItem(GOOGLE_ACCOUNT_KEY);
      
      this.state.metaAccountId = metaAccountId;
      this.state.googleAccountId = googleAccountId;
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  getState(): ConnectionState {
    return { ...this.state };
  }

  async hydrate() {
    // Fetch Meta connection status
    this.state.loadingMeta = true;
    this.notify();

    try {
      const metaResponse = await fetch('/api/meta/status');
      const metaData = await metaResponse.json();
      
      // Get account ID from localStorage first, then from API response
      const storedAccountId = typeof window !== 'undefined' ? localStorage.getItem(META_ACCOUNT_KEY) : null;
      const metaAccountId = storedAccountId || metaData.accountId || null;
      
      // Connected only if API says connected AND account ID exists
      this.state.metaConnected = metaData.connected === true && !!metaAccountId;
      this.state.metaAccountId = metaAccountId;
      
      if (metaAccountId && typeof window !== 'undefined') {
        localStorage.setItem(META_ACCOUNT_KEY, metaAccountId);
      } else if (!metaAccountId && typeof window !== 'undefined') {
        localStorage.removeItem(META_ACCOUNT_KEY);
      }
    } catch (error) {
      console.error('Failed to fetch Meta connection status:', error);
      this.state.metaConnected = false;
    } finally {
      this.state.loadingMeta = false;
      this.notify();
    }

    // Fetch Google connection status (placeholder - implement when Google API exists)
    this.state.loadingGoogle = true;
    this.notify();

    try {
      // TODO: Replace with actual Google status endpoint when available
      const googleResponse = await fetch('/api/google/status').catch(() => null);
      
      if (googleResponse && googleResponse.ok) {
        const googleData = await googleResponse.json();
        const storedAccountId = typeof window !== 'undefined' ? localStorage.getItem(GOOGLE_ACCOUNT_KEY) : null;
        const googleAccountId = storedAccountId || googleData.accountId || null;
        
        this.state.googleConnected = googleData.connected === true && !!googleAccountId;
        this.state.googleAccountId = googleAccountId;
        
        if (googleAccountId && typeof window !== 'undefined') {
          localStorage.setItem(GOOGLE_ACCOUNT_KEY, googleAccountId);
        } else if (!googleAccountId && typeof window !== 'undefined') {
          localStorage.removeItem(GOOGLE_ACCOUNT_KEY);
        }
      } else {
        this.state.googleConnected = false;
      }
    } catch (error) {
      console.error('Failed to fetch Google connection status:', error);
      this.state.googleConnected = false;
    } finally {
      this.state.loadingGoogle = false;
      this.notify();
    }
  }

  setMetaAccount(accountId: string) {
    this.state.metaAccountId = accountId;
    this.state.metaConnected = true;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(META_ACCOUNT_KEY, accountId);
    }
    
    this.notify();
  }

  setGoogleAccount(accountId: string) {
    this.state.googleAccountId = accountId;
    this.state.googleConnected = true;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(GOOGLE_ACCOUNT_KEY, accountId);
    }
    
    this.notify();
  }

  async disconnectMeta() {
    try {
      await fetch('/api/meta/disconnect', { method: 'POST' });
    } catch (error) {
      console.error('Failed to disconnect Meta:', error);
    }
    
    this.state.metaConnected = false;
    this.state.metaAccountId = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(META_ACCOUNT_KEY);
    }
    
    this.notify();
  }

  async disconnectGoogle() {
    try {
      await fetch('/api/google/disconnect', { method: 'POST' }).catch(() => null);
    } catch (error) {
      console.error('Failed to disconnect Google:', error);
    }
    
    this.state.googleConnected = false;
    this.state.googleAccountId = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GOOGLE_ACCOUNT_KEY);
    }
    
    this.notify();
  }
}

// Singleton instance
const connectionStore = new ConnectionStore();

// React hook to use the store
export function useConnectionStore() {
  const [state, setState] = useState(connectionStore.getState());

  React.useEffect(() => {
    const unsubscribe = connectionStore.subscribe(() => {
      setState(connectionStore.getState());
    });
    return unsubscribe;
  }, []);

  return {
    ...state,
    hydrate: useCallback(() => connectionStore.hydrate(), []),
    setMetaAccount: useCallback((id: string) => connectionStore.setMetaAccount(id), []),
    setGoogleAccount: useCallback((id: string) => connectionStore.setGoogleAccount(id), []),
    disconnectMeta: useCallback(() => connectionStore.disconnectMeta(), []),
    disconnectGoogle: useCallback(() => connectionStore.disconnectGoogle(), []),
  };
}

export default connectionStore;

