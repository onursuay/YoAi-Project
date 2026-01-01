
import React from 'react';

const SeoContent: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Content Optimization</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { page: '/home', score: 92, status: 'Optimal' },
          { page: '/blog/marketing-ai', score: 45, status: 'Needs Improvement' },
          { page: '/features', score: 78, status: 'Good' },
          { page: '/pricing', score: 65, status: 'Fair' }
        ].map((item, idx) => (
          <div key={idx} className="bg-[#111] p-6 rounded-2xl border border-[#1a1a1a] flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-200">{item.page}</h4>
              <p className="text-xs text-gray-500 mt-1">Status: <span className={item.score > 80 ? 'text-green-500' : item.score > 60 ? 'text-yellow-500' : 'text-red-500'}>{item.status}</span></p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#0070f3]">{item.score}</span>
              <span className="text-[10px] text-gray-600 block">SCORE</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0070f3]/5 border border-[#0070f3]/20 p-8 rounded-2xl">
        <h3 className="text-lg font-bold text-[#0070f3] mb-4">AI Content Suggestions</h3>
        <p className="text-sm text-gray-400">Our AI has analyzed your blog post "/blog/marketing-ai". It recommends adding the keyword "ROI calculation" 3 more times to reach the ideal density of 1.2%.</p>
        <button className="mt-4 px-6 py-2 bg-[#0070f3] rounded-lg text-sm font-bold">Apply Suggestions</button>
      </div>
    </div>
  );
};

export default SeoContent;
