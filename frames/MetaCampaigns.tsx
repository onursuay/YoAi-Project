'use client';

import React, { useEffect, useState } from 'react';

interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: string;
  spend: string;
  results: string;
}

const MetaCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const response = await fetch('/api/meta/campaigns');
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch campaigns');
        }
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load campaigns');
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg text-sm">Filters</button>
          <button className="px-4 py-2 bg-[#0070f3] rounded-lg text-sm font-bold">Create Campaign</button>
        </div>
      </div>
      
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Campaign Name</th>
              <th className="px-6 py-4">Budget</th>
              <th className="px-6 py-4">Spend</th>
              <th className="px-6 py-4">Results</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  Loading campaigns...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-red-400">
                  {error}
                </td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  No campaigns found
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-[#1a1a1a]/30">
                  <td className="px-6 py-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${c.status === 'Active' ? 'bg-green-500' : c.status === 'Paused' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                  </td>
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4 text-sm font-medium">{c.budget}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{c.spend}</td>
                  <td className="px-6 py-4 text-sm font-bold">{c.results}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetaCampaigns;
