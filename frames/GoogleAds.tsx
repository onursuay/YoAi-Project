
import React from 'react';

const GoogleAds: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Ads & Extensions</h1>
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Ad Copy Preview</th>
              <th className="px-6 py-4">CTR</th>
              <th className="px-6 py-4">Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {[
              { copy: 'YOAI - The #1 AI Marketing Dashboard', ctr: '12.4%', spend: '₺42.500' },
              { copy: 'Scale your Marketing with AI Insights', ctr: '8.2%', spend: '₺12.100' },
              { copy: 'Free AI SEO Auditor Tool 2024', ctr: '15.1%', spend: '₺2.400' }
            ].map((a, i) => (
              <tr key={i} className="hover:bg-[#1a1a1a]/30">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-[#0070f3]">{a.copy}</p>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase">Responsive Search Ad</p>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-green-500">{a.ctr}</td>
                <td className="px-6 py-4 text-sm font-bold">{a.spend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoogleAds;
