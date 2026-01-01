
import React from 'react';

const MetaOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Meta Advertising Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Meta Total Spend', value: '₺124.500' },
          { label: 'Avg. CPC', value: '₺1,45' },
          { label: 'Meta Conversions', value: '1,240' },
          { label: 'Frequency', value: '2.4' }
        ].map((card, idx) => (
          <div key={idx} className="bg-[#111] p-6 rounded-2xl border border-[#1a1a1a]">
            <p className="text-xs text-gray-500 uppercase font-semibold">{card.label}</p>
            <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-[#111] rounded-2xl border border-[#1a1a1a] p-8">
        <h3 className="text-lg font-bold mb-6">Performance Trends (7 Days)</h3>
        <div className="h-64 w-full bg-[#0d0d0d] rounded-xl flex items-center justify-center border border-[#1a1a1a] text-gray-600">
          [ Meta Performance Chart Placeholder ]
        </div>
      </div>
    </div>
  );
};

export default MetaOverview;
