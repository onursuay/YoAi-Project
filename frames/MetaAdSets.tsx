'use client';

import React, { useEffect, useState } from 'react';

interface AdSet {
  id: string;
  name: string;
  targeting: string;
  budget: string;
  schedule: string;
}

const MetaAdSets: React.FC = () => {
  const [adsets, setAdsets] = useState<AdSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdSets() {
      try {
        const { fetchMetaAdSets } = await import('@/lib/api/metaApi');
        const data = await fetchMetaAdSets();
        setAdsets(data.adsets || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load ad sets');
        setAdsets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAdSets();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Ad Sets</h1>
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Ad Set Name</th>
              <th className="px-6 py-4">Targeting</th>
              <th className="px-6 py-4">Budget</th>
              <th className="px-6 py-4">Schedule</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  Loading ad sets...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-red-400">
                  {error}
                </td>
              </tr>
            ) : adsets.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No ad sets found
                </td>
              </tr>
            ) : (
              adsets.map((s) => (
                <tr key={s.id} className="hover:bg-[#1a1a1a]/30">
                  <td className="px-6 py-4 font-medium">{s.name}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{s.targeting}</td>
                  <td className="px-6 py-4 text-sm font-bold">{s.budget}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{s.schedule}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetaAdSets;
