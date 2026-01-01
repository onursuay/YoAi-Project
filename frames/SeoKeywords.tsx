
import React from 'react';

const SeoKeywords: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Keyword Tracking</h1>
      <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Keyword</th>
              <th className="px-6 py-4">Position</th>
              <th className="px-6 py-4">Volume</th>
              <th className="px-6 py-4">URL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {[
              { kw: 'ai marketing dashboard', pos: '#2', vol: '12k', url: '/product/dashboard' },
              { kw: 'marketing automations saas', pos: '#5', vol: '4.5k', url: '/features' },
              { kw: 'best saas dashboard 2024', pos: '#1', vol: '840', url: '/blog/best-dashboards' }
            ].map((k, i) => (
              <tr key={i} className="hover:bg-[#1a1a1a]/30">
                <td className="px-6 py-4 font-medium">{k.kw}</td>
                <td className="px-6 py-4 text-sm font-bold text-green-500">{k.pos}</td>
                <td className="px-6 py-4 text-sm">{k.vol}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{k.url}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeoKeywords;
