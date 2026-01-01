
import React from 'react';

const MetaCampaigns: React.FC = () => {
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
            {[
              { name: 'Prospecting - Top Funnel', budget: '₺1.500 / day', spend: '₺42.500', results: '245' },
              { name: 'Retargeting - L7D', budget: '₺800 / day', spend: '₺12.100', results: '112' },
              { name: 'Black Friday Warmup', budget: '₺10.000 / day', spend: '₺78.000', results: '54' }
            ].map((c, i) => (
              <tr key={i} className="hover:bg-[#1a1a1a]/30">
                <td className="px-6 py-4">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                </td>
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4 text-sm font-medium">{c.budget}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{c.spend}</td>
                <td className="px-6 py-4 text-sm font-bold">{c.results}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetaCampaigns;
