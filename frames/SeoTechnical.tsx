
import React from 'react';

const SeoTechnical: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Technical SEO Issues</h1>
      <div className="space-y-4">
        {[
          { type: 'Critical', issue: 'Broken Internal Links (404)', count: 12 },
          { type: 'Warning', issue: 'Missing H1 Tags', count: 24 },
          { type: 'Notice', issue: 'Slow Server Response Time', count: 1 },
          { type: 'Warning', issue: 'Image Missing Alt Text', count: 156 }
        ].map((item, idx) => (
          <div key={idx} className="bg-[#111] border border-[#1a1a1a] p-6 rounded-2xl flex justify-between items-center group hover:border-[#0070f3]/50 transition-all">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${item.type === 'Critical' ? 'bg-red-500' : item.type === 'Warning' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
              <div>
                <h4 className="font-semibold">{item.issue}</h4>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">{item.type} Priority</p>
              </div>
            </div>
            <div className="text-2xl font-bold">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeoTechnical;
