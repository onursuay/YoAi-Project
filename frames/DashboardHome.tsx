'use client';

import React, { useEffect, useState } from 'react';

interface DashboardData {
  metaSpend: number;
  totalResults: number;
  impressions: number;
  clicks: number;
}

const DashboardHome: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const adAccountId = localStorage.getItem('meta_ad_account_id');
        const response = await fetch('/api/meta/dashboard', {
          headers: adAccountId ? { 'x-ad-account-id': adAccountId } : {},
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('tr-TR').format(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Good morning, John</h1>
          <p className="text-gray-400 mt-1">Here's what's happening across your channels today.</p>
        </div>
        <div className="bg-[#111] border border-[#222] px-4 py-2 rounded-lg text-sm flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-gray-300">AI Engine active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Meta Spend', 
            value: loading ? '...' : dashboardData ? formatCurrency(dashboardData.metaSpend) : '₺0', 
            sub: '+12% from last week', 
            trend: 'up' 
          },
          { 
            label: 'Google Spend', 
            value: '₺12.450', 
            sub: '-3% from last week', 
            trend: 'down' 
          },
          { 
            label: 'Total Results', 
            value: loading ? '...' : dashboardData ? formatNumber(dashboardData.totalResults) : '0', 
            sub: '+18% from last week', 
            trend: 'up' 
          },
          { 
            label: 'SEO Health Score', 
            value: '84/100', 
            sub: 'Excellent', 
            trend: 'up' 
          }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#111] border border-[#1a1a1a] p-6 rounded-2xl group hover:border-[#0070f3]/50 transition-all">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{kpi.label}</p>
            <h3 className={`text-2xl font-bold mt-2 ${loading ? 'animate-pulse' : ''}`}>{kpi.value}</h3>
            <p className={`text-xs mt-2 ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">AI Performance Insights</h2>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-xl flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#0070f3]/20 text-[#0070f3] rounded-lg flex items-center justify-center shrink-0">
                  <span className="font-bold">AI</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Campaign Optimization Recommended</h4>
                  <p className="text-xs text-gray-500 mt-1">Meta campaign 'Spring Sale 2024' is showing a decreasing ROAS. AI suggests increasing bid caps by 15%.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {[
              { title: 'Campaign Started', time: '2h ago', meta: 'Meta Ads' },
              { title: 'Budget Updated', time: '5h ago', meta: 'Google Ads' },
              { title: 'New Keyword Ranked', time: '1d ago', meta: 'SEO' }
            ].map((activity, idx) => (
              <div key={idx} className="flex space-x-3 items-start">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-[#0070f3]"></div>
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-[10px] text-gray-500 uppercase">{activity.meta} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
