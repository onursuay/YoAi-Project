'use client';

import React, { useEffect, useState } from 'react';

interface Ad {
  id: string;
  name: string;
  thumbnail: string | null;
  spend: string;
  roas: string;
}

const MetaAds: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAds() {
      try {
        const response = await fetch('/api/meta/ads');
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch ads');
        }
        const data = await response.json();
        setAds(data.ads || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load ads');
        setAds([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Ads</h1>
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Creative Preview</th>
              <th className="px-6 py-4">Ad Name</th>
              <th className="px-6 py-4">Spend</th>
              <th className="px-6 py-4">ROAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  Loading ads...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-red-400">
                  {error}
                </td>
              </tr>
            ) : ads.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No ads found
                </td>
              </tr>
            ) : (
              ads.map((a) => (
                <tr key={a.id} className="hover:bg-[#1a1a1a]/30">
                  <td className="px-6 py-4">
                    {a.thumbnail ? (
                      <img src={a.thumbnail} alt={a.name} className="w-12 h-12 object-cover rounded-lg" />
                    ) : (
                      <div className="w-12 h-12 bg-[#222] rounded-lg"></div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{a.name}</td>
                  <td className="px-6 py-4 text-sm text-[#0070f3] font-bold">{a.spend}</td>
                  <td className="px-6 py-4 text-sm font-bold text-green-500">{a.roas}</td>
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
