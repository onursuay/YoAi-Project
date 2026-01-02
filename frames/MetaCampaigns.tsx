'use client';
import React, { useEffect, useState } from 'react';

interface Campaign {
  id: string;
  name: string;
  status: string;
  dailyBudget: number;
  lifetimeBudget: number;
  spend: number;
  impressions: number;
  clicks: number;
  cpc: number;
  ctr: number;
  cpm: number;
  reach: number;
  frequency: number;
  conversions: number;
  costPerConversion: number;
}

const MetaCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const { fetchMetaCampaigns } = await import('@/lib/api/metaApi');
        const data = await fetchMetaCampaigns();
        console.error('📊 Campaigns data received:', data.campaigns);
        setCampaigns(data.campaigns || []);
      } catch (err: any) {
        console.error('❌ Campaigns fetch error:', err);
        setError(err.message || 'Failed to load campaigns');
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('tr-TR').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg text-sm">Filters</button>
          <button className="px-4 py-2 bg-[#0070f3] rounded-lg text-sm font-bold">Create Campaign</button>
        </div>
      </div>
      
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 sticky left-0 bg-[#1a1a1a]/50">Status</th>
              <th className="px-4 py-3 sticky left-12 bg-[#1a1a1a]/50">Campaign Name</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Spend</th>
              <th className="px-4 py-3">Impressions</th>
              <th className="px-4 py-3">Clicks</th>
              <th className="px-4 py-3">CTR</th>
              <th className="px-4 py-3">CPC</th>
              <th className="px-4 py-3">CPM</th>
              <th className="px-4 py-3">Reach</th>
              <th className="px-4 py-3">Frequency</th>
              <th className="px-4 py-3">Conversions</th>
              <th className="px-4 py-3">Cost/Conv</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {loading ? (
              <tr>
                <td colSpan={13} className="px-6 py-8 text-center text-gray-400">
                  Loading campaigns...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={13} className="px-6 py-8 text-center text-red-400">
                  {error}
                </td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-6 py-8 text-center text-gray-400">
                  No campaigns found
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-[#1a1a1a]/30">
                  <td className="px-4 py-4 sticky left-0 bg-[#111]">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      c.status === 'ACTIVE' ? 'bg-green-500' : 
                      c.status === 'PAUSED' ? 'bg-yellow-500' : 
                      'bg-gray-500'
                    }`}></div>
                  </td>
                  <td className="px-4 py-4 font-medium sticky left-12 bg-[#111]">{c.name}</td>
                  <td className="px-4 py-4 text-gray-300">
                    {c.dailyBudget > 0 ? formatCurrency(c.dailyBudget) + ' / gün' : 
                     c.lifetimeBudget > 0 ? formatCurrency(c.lifetimeBudget) : '-'}
                  </td>
                  <td className="px-4 py-4 font-semibold text-blue-400">{formatCurrency(c.spend)}</td>
                  <td className="px-4 py-4 text-gray-300">{formatNumber(c.impressions)}</td>
                  <td className="px-4 py-4 text-gray-300">{formatNumber(c.clicks)}</td>
                  <td className="px-4 py-4 text-gray-300">{formatPercentage(c.ctr)}</td>
                  <td className="px-4 py-4 text-gray-300">{formatCurrency(c.cpc)}</td>
                  <td className="px-4 py-4 text-gray-300">{formatCurrency(c.cpm)}</td>
                  <td className="px-4 py-4 text-gray-300">{formatNumber(c.reach)}</td>
                  <td className="px-4 py-4 text-gray-300">{c.frequency.toFixed(2)}</td>
                  <td className="px-4 py-4 font-bold text-green-400">{formatNumber(c.conversions)}</td>
                  <td className="px-4 py-4 text-gray-300">
                    {c.costPerConversion > 0 ? formatCurrency(c.costPerConversion) : '-'}
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

export default MetaCampaigns;
