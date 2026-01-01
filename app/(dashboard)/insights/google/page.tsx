export default function GoogleInsightsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Google Ads Insights</h1>
      
      <div className="bg-[#111] p-8 rounded-2xl border border-[#1a1a1a]">
        <h3 className="text-lg font-bold mb-6">AI-Generated Recommendations</h3>
        <div className="space-y-4">
          {[
            {
              title: 'Increase Budget for High-Performing Keywords',
              description: 'Keywords "ai marketing dashboard" and "[google ads dashboard]" have Quality Scores of 9-10 and high conversion rates. Consider increasing daily budget by 30% for these ad groups.',
              impact: 'High',
              priority: 'High'
            },
            {
              title: 'Negative Keyword Optimization',
              description: 'Add negative keywords: "free", "cheap", "download" to Ad Group "Main Keywords" to reduce irrelevant clicks and improve CPA.',
              impact: 'Medium',
              priority: 'High'
            },
            {
              title: 'Expand PMax Asset Groups',
              description: 'Performance Max campaign "PMax - All Products" is limited by asset quality. Add 5 more high-quality images and 3 new headlines to improve reach.',
              impact: 'Medium',
              priority: 'Medium'
            }
          ].map((insight, i) => (
            <div key={i} className="p-6 bg-[#0d0d0d] rounded-xl border border-[#1a1a1a]">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">{insight.title}</h4>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs rounded ${insight.impact === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    {insight.impact} Impact
                  </span>
                  <span className="px-2 py-1 text-xs rounded bg-[#0070f3]/10 text-[#0070f3]">
                    {insight.priority} Priority
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">{insight.description}</p>
              <button className="mt-4 px-4 py-2 bg-[#0070f3] rounded-lg text-xs font-bold">Apply Recommendation</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

