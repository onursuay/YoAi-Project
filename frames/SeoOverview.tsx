
import React from 'react';

const SeoOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">SEO Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111] p-10 rounded-2xl border border-[#1a1a1a] flex flex-col items-center justify-center space-y-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="#1a1a1a" strokeWidth="12" fill="transparent" />
              <circle cx="64" cy="64" r="58" stroke="#0070f3" strokeWidth="12" fill="transparent" strokeDasharray="364" strokeDashoffset="58" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">84</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Health Score</p>
        </div>

        <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Indexed Pages', value: '1,420' },
            { label: 'Backlinks', value: '42.5k' },
            { label: 'Domain Authority', value: '48' },
            { label: 'Organic Keywords', value: '12.4k' }
          ].map((item, i) => (
            <div key={i} className="bg-[#111] p-6 rounded-2xl border border-[#1a1a1a]">
              <p className="text-xs text-gray-500 uppercase font-semibold">{item.label}</p>
              <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111] p-8 rounded-2xl border border-[#1a1a1a]">
        <h3 className="text-lg font-bold mb-6">Issue Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <h4 className="text-red-500 font-bold">12 Critical Errors</h4>
            <p className="text-xs text-red-500/70 mt-1">404 errors, Broken links</p>
          </div>
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <h4 className="text-orange-500 font-bold">45 Warnings</h4>
            <p className="text-xs text-orange-500/70 mt-1">Missing alt text, meta desc</p>
          </div>
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <h4 className="text-green-500 font-bold">OK</h4>
            <p className="text-xs text-green-500/70 mt-1">Everything else is fine</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoOverview;
