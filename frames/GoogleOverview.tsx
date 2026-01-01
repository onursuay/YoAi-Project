
import React from 'react';

const GoogleOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Google Ads Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Spend', value: '₺84.200' },
          { label: 'Impressions', value: '450k' },
          { label: 'Avg. CPA', value: '₺32,40' },
          { label: 'Click-Through Rate', value: '4.8%' }
        ].map((card, idx) => (
          <div key={idx} className="bg-[#111] p-6 rounded-2xl border border-[#1a1a1a]">
            <p className="text-xs text-gray-500 uppercase font-semibold">{card.label}</p>
            <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
          </div>
        ))}
      </div>
      
      <div className="bg-[#111] rounded-2xl border border-[#1a1a1a] p-8">
        <h3 className="text-lg font-bold mb-6">Top Search Keywords</h3>
        <div className="space-y-4">
          {[
            { kw: 'ai dashboard', vol: '12k', cost: '₺12,5' },
            { kw: 'marketing automation', vol: '8k', cost: '₺45,2' },
            { kw: 'saas dashboard free', vol: '24k', cost: '₺2,4' }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-[#0d0d0d] rounded-xl border border-[#1a1a1a]">
              <span className="font-medium">{item.kw}</span>
              <div className="flex space-x-6 text-xs text-gray-500 uppercase">
                <span>Vol: {item.vol}</span>
                <span className="text-[#0070f3] font-bold">Avg Cost: {item.cost}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleOverview;
