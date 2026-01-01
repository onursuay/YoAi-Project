
import React from 'react';

const GoogleCampaigns: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Google Campaigns</h1>
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Campaign Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Budget</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {[
              { name: 'Search - Brand Terms', type: 'Search', budget: '₺3.200 / day', status: 'Eligible' },
              { name: 'PMax - All Products', type: 'PMax', budget: '₺12.000 / day', status: 'Eligible' },
              { name: 'Display - Remarketing', type: 'Display', budget: '₺1.500 / day', status: 'Paused' }
            ].map((c, i) => (
              <tr key={i} className="hover:bg-[#1a1a1a]/30">
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{c.type}</td>
                <td className="px-6 py-4 text-sm font-bold">{c.budget}</td>
                <td className="px-6 py-4 text-xs font-medium">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoogleCampaigns;
