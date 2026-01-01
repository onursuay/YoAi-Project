
import React from 'react';

const GoogleAdGroups: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Ad Groups</h1>
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Ad Group Name</th>
              <th className="px-6 py-4">Default Max CPC</th>
              <th className="px-6 py-4">Clicks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {[
              { name: 'Main Keywords', cpc: '₺12,40', clicks: '2,842' },
              { name: 'Competitor Brand', cpc: '₺45,00', clicks: '421' },
              { name: 'Generic SaaS', cpc: '₺8,50', clicks: '1,102' }
            ].map((ag, i) => (
              <tr key={i} className="hover:bg-[#1a1a1a]/30">
                <td className="px-6 py-4 font-medium">{ag.name}</td>
                <td className="px-6 py-4 text-sm">{ag.cpc}</td>
                <td className="px-6 py-4 text-sm font-bold">{ag.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoogleAdGroups;
