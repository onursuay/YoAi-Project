'use client';

import React from 'react';
import { useConnectionStore } from '@/lib/connectionStore';

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

const GoogleAccounts: React.FC<Props> = ({ selectedId, onSelect }) => {
  const { setGoogleAccount, hydrate } = useConnectionStore();

  const handleSelect = async (id: string) => {
    try {
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('YOAI_GOOGLE_ACCOUNT_ID', id);
      }
      
      // Update store
      setGoogleAccount(id);
      
      // Refresh connection state
      await hydrate();
      onSelect(id);
    } catch (err) {
      console.error('Failed to select account:', err);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Google Ads Accounts</h1>
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Account Name</th>
              <th className="px-6 py-4">Customer ID</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {[
              { id: 'customer_901-223-1123', name: 'YOAI Global Admin' },
              { id: 'customer_112-555-4422', name: 'Marketing Agency Lead' }
            ].map(acc => (
              <tr key={acc.id} className="hover:bg-[#1a1a1a]/30">
                <td className="px-6 py-4 font-medium">{acc.name}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{acc.id}</td>
                <td className="px-6 py-4 text-right">
                  {selectedId === acc.id ? (
                    <span className="px-4 py-1.5 bg-[#0070f3]/10 text-[#0070f3] border border-[#0070f3]/30 rounded-lg text-xs font-bold">Active</span>
                  ) : (
                    <button 
                      onClick={() => handleSelect(acc.id)}
                      className="px-4 py-1.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-xs font-bold"
                    >
                      Select
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoogleAccounts;
