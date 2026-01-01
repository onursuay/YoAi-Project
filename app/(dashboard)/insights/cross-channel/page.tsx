export default function CrossChannelInsightsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Cross-Channel Insights</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Combined Spend', value: '₺207.550', change: '+8%' },
          { label: 'Cross-Channel Conversions', value: '4,542', change: '+15%' },
          { label: 'Attribution Efficiency', value: '87%', change: '+3%' }
        ].map((card, idx) => (
          <div key={idx} className="bg-[#111] p-6 rounded-2xl border border-[#1a1a1a]">
            <p className="text-xs text-gray-500 uppercase font-semibold">{card.label}</p>
            <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
            <p className="text-xs mt-2 text-green-500">{card.change} from last month</p>
          </div>
        ))}
      </div>

      <div className="bg-[#111] p-8 rounded-2xl border border-[#1a1a1a]">
        <h3 className="text-lg font-bold mb-6">Channel Performance Comparison</h3>
        <div className="space-y-4">
          {[
            { channel: 'Meta Ads', spend: '₺124.500', conv: '1,240', roas: '3.2x' },
            { channel: 'Google Ads', spend: '₺84.200', conv: '2,600', roas: '4.1x' },
            { channel: 'SEO', spend: '₺0', conv: '702', roas: '∞' }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-[#0d0d0d] rounded-xl border border-[#1a1a1a]">
              <div>
                <h4 className="font-semibold">{item.channel}</h4>
                <p className="text-xs text-gray-500 mt-1">Spend: {item.spend} • Conversions: {item.conv}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[#0070f3]">ROAS: {item.roas}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

