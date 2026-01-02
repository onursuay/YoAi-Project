'use client';
import React, { useEffect, useState } from 'react';

interface Ad {
  id: string;
  name: string;
  status: string;
  adsetId: string;
  campaignId: string;
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

const MetaAds: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAds() {
      try {
        const { fetchMetaAds } = await import('@/lib/api/metaApi');
        const data = await fetchMetaAds();
        console.error('📊 Ads data received:', data.ads);
        setAds(data.ads || []);
      } catch (err: any) {
        console.error('❌ Ads fetch error:', err);
        setError(err.message || 'Failed to load ads');
        setAds([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
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
        <h1 className="text-2xl font-bold">Ads</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg text-sm">Filters</button>
          <button className="px-4 py-2 bg-[#0070f3] rounded-lg text-sm font-bold">Create Ad</button>
        </div>
      </div>
      
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 sticky left-0 bg-[#1a1a1a]/50">Status</th>
              <th className="px-4 py-3 sticky left-12 bg-[#1a1a1a]/50">Ad Name</th>
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
                <td colSpan={12} className="px-6 py-8 text-center text-gray-400">
                  Loading ads...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={12} className="px-6 py-8 text-center text-red-400">
                  {error}
                </td>
              </tr>
            ) : ads.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-6 py-8 text-center text-gray-400">
                  No ads found
                </td>
              </tr>
            ) : (
              ads.map((a) => (
                <tr key={a.id} className="hover:bg-[#1a1a1a]/30">
                  <td className="px-4 py-4 sticky left-0 bg-[#111]">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      a.status === 'ACTIVE' ? 'bg-green-500' : 
                      a.status === 'PAUSED' ? 'bg-yellow-500' : 
                      'bg-gray-500'
                    }`}></div>
                  </td>
                  <td className="px-4 py-4 font-medium sticky left-12 bg-[#111]">{a.name}</td>
                  <td className="px-4 py-4 font-semibold text-blue-400">{formatCurrency(a.spend)}</td>
                  <td className="px-4 py-4 text-gray-300">{formatNumber(a.impressions)}</td>
                  <td className="px-4 py-4 text-gray-300">{formatNumber(a.clicks)}</td>
                  <td className="px-4 py-4 text-gray-300">{formatPercentage(a.ctr)}</td>
                  <td className="px-4 py-4 text-gray-300">{formatCurrency(a.cpc)}</td>
                  <td className="px-4 py-4 text-gray-300">{formatCurrency(a.cpm)}</td>
                  <td className="px-4 py-4 text-gray-300">{formatNumber(a.reach)}</td>
                  <td className="px-4 py-4 text-gray-300">{a.frequency.toFixed(2)}</td>
                  <td className="px-4 py-4 font-bold text-green-400">{formatNumber(a.conversions)}</td>
                  <td className="px-4 py-4 text-gray-300">
                    {a.costPerConversion > 0 ? formatCurrency(a.costPerConversion) : '-'}
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

export default MetaAds;
