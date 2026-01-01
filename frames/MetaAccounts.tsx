
import React from 'react';

interface MetaAccountsProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

const MetaAccounts: React.FC<MetaAccountsProps> = ({ selectedId, onSelect }) => {
  const accounts = [
    { id: 'act_382104922', name: 'Global Brand Main', status: 'Active' },
    { id: 'act_112233445', name: 'EU Secondary Market', status: 'Active' },
    { id: 'act_998877665', name: 'Test Sandbox', status: 'Paused' }
  ];

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
            {accounts.map(acc => (
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
                      onClick={() => onSelect(acc.id)}
                      className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-lg text-xs font-bold"
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

export default MetaAccounts;
