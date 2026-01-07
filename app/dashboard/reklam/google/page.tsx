'use client'

import { useState } from 'react'
import Topbar from '@/components/Topbar'
import StatCard from '@/components/StatCard'
import Tabs from '@/components/Tabs'
import Toolbar from '@/components/Toolbar'
import DataTable from '@/components/DataTable'

export default function GooglePage() {
  const [activeTab, setActiveTab] = useState('kampanyalar')

  const tabs = [
    { id: 'kampanyalar', label: 'Kampanyalar' },
    { id: 'reklam-gruplari', label: 'Reklam Grupları' },
    { id: 'reklamlar', label: 'Reklamlar' },
  ]

  const columns = [
    { key: 'status', label: 'Durum' },
    { key: 'name', label: 'Kampanya Adı' },
    { key: 'clicks', label: 'Tıklamalar' },
    { key: 'impressions', label: 'Gösterimler' },
    { key: 'ctr', label: 'CTR' },
    { key: 'cpc', label: 'CPC' },
    { key: 'cost', label: 'Maliyet' },
    { key: 'conversions', label: 'Dönüşümler' },
    { key: 'conversionRate', label: 'Dönüşüm Oranı' },
  ]

  const data = [
    {
      status: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ),
      name: 'Arama Kampanyası - Genel',
      clicks: '12,456',
      impressions: '234,567',
      ctr: '5.31%',
      cpc: '₺2.45',
      cost: '₺30,517',
      conversions: '456',
      conversionRate: '3.66%',
    },
    {
      status: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ),
      name: 'Display Ağı - Retargeting',
      clicks: '8,234',
      impressions: '567,890',
      ctr: '1.45%',
      cpc: '₺1.89',
      cost: '₺15,562',
      conversions: '234',
      conversionRate: '2.85%',
    },
    {
      status: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ),
      name: 'Shopping Kampanyası',
      clicks: '15,678',
      impressions: '189,234',
      ctr: '8.29%',
      cpc: '₺3.12',
      cost: '₺48,916',
      conversions: '678',
      conversionRate: '4.33%',
    },
    {
      status: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ),
      name: 'Video Kampanyası - YouTube',
      clicks: '5,432',
      impressions: '123,456',
      ctr: '4.40%',
      cpc: '₺4.56',
      cost: '₺24,770',
      conversions: '189',
      conversionRate: '3.48%',
    },
    {
      status: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ),
      name: 'Performans Max',
      clicks: '9,876',
      impressions: '345,678',
      ctr: '2.86%',
      cpc: '₺2.78',
      cost: '₺27,455',
      conversions: '345',
      conversionRate: '3.49%',
    },
    {
      status: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ),
      name: 'Akıllı Kampanya',
      clicks: '6,543',
      impressions: '198,765',
      ctr: '3.29%',
      cpc: '₺3.45',
      cost: '₺22,573',
      conversions: '267',
      conversionRate: '4.08%',
    },
  ]

  return (
    <>
      <Topbar
        title="Reklam Yöneticisi"
        description="Google reklam kampanyalarınızı yönetin"
        actionButton={{
          label: 'Kampanya Oluştur',
          onClick: () => {},
        }}
      />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Harcanan Tutar"
              value="₺169,793"
              change={18.7}
              trend="up"
            />
            <StatCard
              title="Etkileşim"
              value="57,219"
              change={22.1}
              trend="up"
            />
            <StatCard
              title="Ortalama TBM"
              value="₺2.89"
              change={-5.3}
              trend="down"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <Toolbar showGraphFilter={true} />
            <div className="p-6">
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

