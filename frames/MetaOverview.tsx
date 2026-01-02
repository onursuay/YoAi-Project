'use client';

import React, { useEffect, useState } from 'react';

interface OverviewData {
  totalSpend: number;
  avgCpc: number;
  conversions: number;
  frequency: number;
}

const MetaOverview: React.FC = () => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const adAccountId = localStorage.getItem('meta_ad_account_id');
        
        const response = await fetch('/api/meta/overview', {
          headers: adAccountId ? { 'x-ad-account-id': adAccountId } : {},
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch overview');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load overview data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchOverview();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('tr-TR').format(value);
  };

  const cards = [
    { 
      label: 'Meta Total Spend', 
      value: loading ? '...' : error ? '—' : formatCurrency(data?.totalSpend || 0)
    },
    { 
      label: 'Avg. CPC', 
      value: loading ? '...' : error ? '—' : formatCurrency(data?.avgCpc || 0)
    },
    { 
      label: 'Meta Conversions', 
      value: loading ? '...' : error ? '—' : formatNumber(data?.conversions || 0)
    },
    { 
      label: 'Frequency', 
      value: loading ? '...' : error ? '—' : (data?.frequency || 0).toFixed(1)
    }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Meta Advertising Overview</h1>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-[#111] p-6 rounded-2xl border border-[#1a1a1a]">
            <p className="text-xs text-gray-500 uppercase font-semibold">{card.label}</p>
            <h3 className={`text-2xl font-bold mt-2 ${loading ? 'animate-pulse text-gray-600' : ''}`}>
              {card.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="bg-[#111] rounded-2xl border border-[#1a1a1a] p-8">
        <h3 className="text-lg font-bold mb-6">Performance Trends (7 Days)</h3>
        <div className="h-64 w-full bg-[#0d0d0d] rounded-xl flex items-center justify-center border border-[#1a1a1a] text-gray-600">
          {loading ? (
            <span className="animate-pulse">Loading chart data...</span>
          ) : error ? (
            <span className="text-red-400">Failed to load chart</span>
          ) : (
            <span>[ Meta Performance Chart Placeholder ]</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetaOverview;
