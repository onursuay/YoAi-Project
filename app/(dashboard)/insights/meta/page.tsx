export default function MetaInsightsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Meta Advertising Insights</h1>
      
      <div className="bg-[#111] p-8 rounded-2xl border border-[#1a1a1a]">
        <h3 className="text-lg font-bold mb-6">AI-Generated Recommendations</h3>
        <div className="space-y-4">
          {[
            {
              title: 'Optimize Ad Set Budget Distribution',
              description: 'Ad Set "Lookalike 1% Purchase" is showing 2.4x better ROAS than "Interests: Marketing". Consider reallocating ₺200/day from Interests to Lookalike.',
              impact: 'High',
              priority: 'High'
            },
            {
              title: 'Increase Frequency Cap',
              description: 'Campaign "Prospecting - Top Funnel" has frequency of 1.2. Industry benchmarks suggest 2.5-3.0 for optimal reach. Increase cap to improve awareness.',
              impact: 'Medium',
              priority: 'Medium'
            },
            {
              title: 'Pause Underperforming Creative',
              description: 'Static ad "Holiday Offer" has CTR 40% below average. Pause and test new creative variants.',
              impact: 'High',
              priority: 'High'
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

