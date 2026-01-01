'use client';

import React, { useEffect, useState } from 'react';
import { useConnectionStore } from '@/lib/connectionStore';

interface MetaAccountsProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

interface Account {
  id: string;
  name: string;
  status: string;
}

const MetaAccounts: React.FC<MetaAccountsProps> = ({ selectedId, onSelect }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setMetaAccount, hydrate } = useConnectionStore();

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch('/api/meta/accounts');
        if (!response.ok) {
          throw new Error('Failed to fetch accounts');
        }
        const data = await response.json();
        setAccounts(data.accounts || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load accounts');
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, []);

  const handleSelect = async (id: string) => {
    try {
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('YOAI_META_ACCOUNT_ID', id);
      }
      
      // Update store
      setMetaAccount(id);
      
      // Call API to save server-side
      const response = await fetch('/api/meta/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: id }),
      });
      
      if (response.ok) {
        // Refresh connection state
        await hydrate();
        onSelect(id);
      }
    } catch (err) {
      console.error('Failed to select account:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Meta Ad Accounts</h1>
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 text-center text-gray-400">
          Loading accounts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Meta Ad Accounts</h1>
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8 text-center text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Meta Ad Accounts</h1>
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Account Name</th>
              <th className="px-6 py-4">Account ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No ad accounts found
                </td>
              </tr>
            ) : (
              accounts.map(acc => (
                <tr key={acc.id} className="hover:bg-[#1a1a1a]/30">
                  <td className="px-6 py-4 font-medium">{acc.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{acc.id}</td>
                  <td className="px-6 py-4 text-xs">
                    <span className={`px-2 py-1 rounded-full ${acc.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {acc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {selectedId === acc.id ? (
                      <span className="px-4 py-1.5 bg-[#0070f3]/10 text-[#0070f3] border border-[#0070f3]/30 rounded-lg text-xs font-bold">Selected</span>
                    ) : (
                      <button 
                        onClick={() => handleSelect(acc.id)}
                        className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-lg text-xs font-bold"
                      >
                        Select
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetaAccounts;
