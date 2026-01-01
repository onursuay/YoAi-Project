
import React from 'react';

const MetaAdSets: React.FC = () => {
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
            {[
              { name: 'Lookalike 1% Purchase', target: 'LAL (Purchase)', budget: '₺450 / day' },
              { name: 'Interests: Marketing', target: 'Digital Marketing', budget: '₺300 / day' },
              { name: 'Broad - TR - 25-45', target: 'Turkey, 25-45', budget: '₺1.200 / day' }
            ].map((s, i) => (
              <tr key={i} className="hover:bg-[#1a1a1a]/30">
                <td className="px-6 py-4 font-medium">{s.name}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{s.target}</td>
                <td className="px-6 py-4 text-sm font-bold">{s.budget}</td>
                <td className="px-6 py-4 text-xs text-gray-500">Ongoing</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetaAdSets;
