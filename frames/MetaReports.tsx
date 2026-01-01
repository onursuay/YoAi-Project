
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', spend: 4000 },
  { name: 'Tue', spend: 3000 },
  { name: 'Wed', spend: 2000 },
  { name: 'Thu', spend: 2780 },
  { name: 'Fri', spend: 1890 },
  { name: 'Sat', spend: 2390 },
  { name: 'Sun', spend: 3490 },
];

const MetaReports: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex space-x-3">
          <select className="bg-[#111] border border-[#222] text-xs p-2 rounded-lg">
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>
          <button className="px-4 py-2 bg-[#0070f3] rounded-lg text-sm font-bold">Export PDF</button>
        </div>
      </div>

      <div className="bg-[#111] p-8 rounded-2xl border border-[#1a1a1a]">
        <h3 className="text-lg font-bold mb-8">Daily Spend Trend (₺)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0070f3" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0070f3" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="name" stroke="#555" fontSize={12} />
              <YAxis stroke="#555" fontSize={12} tickFormatter={(val) => `₺${val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid #222', borderRadius: '8px' }}
                itemStyle={{ color: '#0070f3' }}
              />
              <Area type="monotone" dataKey="spend" stroke="#0070f3" fillOpacity={1} fill="url(#colorSpend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MetaReports;
