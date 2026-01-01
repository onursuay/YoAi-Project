
import React from 'react';

const MetaAds: React.FC = () => {
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
            {[
              { name: 'Video - Product Demo A', spend: '₺8.400', roas: '3.4x' },
              { name: 'Static - Holiday Offer', spend: '₺12.100', roas: '2.1x' },
              { name: 'Carousel - Collections', spend: '₺3.800', roas: '4.8x' }
            ].map((a, i) => (
              <tr key={i} className="hover:bg-[#1a1a1a]/30">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 bg-[#222] rounded-lg"></div>
                </td>
                <td className="px-6 py-4 font-medium">{a.name}</td>
                <td className="px-6 py-4 text-sm text-[#0070f3] font-bold">{a.spend}</td>
                <td className="px-6 py-4 text-sm font-bold text-green-500">{a.roas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetaAds;
