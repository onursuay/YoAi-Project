
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Brand', spend: 12000, conv: 400 },
  { name: 'Generic', spend: 45000, conv: 1200 },
  { name: 'Retarget', spend: 8000, conv: 350 },
  { name: 'Display', spend: 1200, conv: 45 },
];

const GoogleReports: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Google Performance Reports</h1>
        <button className="px-4 py-2 bg-[#0070f3] rounded-lg text-sm font-bold">Download CSV</button>
      </div>

      <div className="bg-[#111] p-8 rounded-2xl border border-[#1a1a1a]">
        <h3 className="text-lg font-bold mb-8">Spend by Campaign Category (₺)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="name" stroke="#555" fontSize={12} />
              <YAxis stroke="#555" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid #222', borderRadius: '8px' }}
                cursor={{ fill: '#1a1a1a' }}
              />
              <Bar dataKey="spend" fill="#0070f3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GoogleReports;
