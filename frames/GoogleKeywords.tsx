
import React from 'react';

const GoogleKeywords: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Keywords</h1>
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Keyword</th>
              <th className="px-6 py-4">Match Type</th>
              <th className="px-6 py-4">Qual. Score</th>
              <th className="px-6 py-4">Avg. CPC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {[
              { kw: '"ai marketing"', match: 'Phrase', score: '9/10', cpc: '₺14,2' },
              { kw: '[google ads dashboard]', match: 'Exact', score: '10/10', cpc: '₺22,5' },
              { kw: 'marketing tools', match: 'Broad', score: '6/10', cpc: '₺4,2' }
            ].map((k, i) => (
              <tr key={i} className="hover:bg-[#1a1a1a]/30">
                <td className="px-6 py-4 font-mono text-sm">{k.kw}</td>
                <td className="px-6 py-4 text-xs">{k.match}</td>
                <td className="px-6 py-4 text-xs font-bold text-green-500">{k.score}</td>
                <td className="px-6 py-4 text-sm">{k.cpc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoogleKeywords;
