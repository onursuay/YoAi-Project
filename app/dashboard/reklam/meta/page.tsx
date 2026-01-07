'use client'

import { useState } from 'react'
import Topbar from '@/components/Topbar'
import StatCard from '@/components/StatCard'
import Tabs from '@/components/Tabs'
import Toolbar from '@/components/Toolbar'
import DataTable from '@/components/DataTable'

export default function MetaPage() {
  const [activeTab, setActiveTab] = useState('kampanyalar')

  const tabs = [
    { id: 'kampanyalar', label: 'Kampanyalar' },
    { id: 'reklam-setleri', label: 'Reklam Setleri' },
    { id: 'reklamlar', label: 'Reklamlar' },
  ]

  const columns = [
    { key: 'status', label: 'Durum' },
    { key: 'name', label: 'Kampanya Adı' },
    { key: 'budget', label: 'Bütçe' },
    { key: 'spent', label: 'Harcanan' },
    { key: 'impressions', label: 'Gösterimler' },
    { key: 'clicks', label: 'Tıklamalar' },
    { key: 'ctr', label: 'CTR' },
    { key: 'cpc', label: 'CPC' },
    { key: 'roas', label: 'ROAS' },
  ]

  const data = [
    {
      status: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ),
      name: 'Yaz Koleksiyonu 2024',
      budget: '₺15,000',
      spent: '₺12,450',
      impressions: '245,890',
      clicks: '3,245',
      ctr: '1.32%',
      cpc: '₺3.84',
      roas: '4.2x',
    },
    {
      status: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ),
      name: 'Yeni Ürün Lansmanı',
      budget: '₺25,000',
      spent: '₺18,920',
      impressions: '389,120',
      clicks: '5,678',
      ctr: '1.46%',
      cpc: '₺3.33',
      roas: '5.8x',
    },
    {
      status: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ),
      name: 'Marka Bilinirliği Q4',
      budget: '₺10,000',
      spent: '₺8,234',
      impressions: '156,789',
      clicks: '2,123',
      ctr: '1.35%',
      cpc: '₺3.88',
      roas: '3.1x',
    },
    {
      status: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ),
      name: 'Retargeting Kampanyası',
      budget: '₺20,000',
      spent: '₺15,678',
      impressions: '298,456',
      clicks: '4,567',
      ctr: '1.53%',
      cpc: '₺3.43',
      roas: '6.2x',
    },
    {
      status: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ),
      name: 'Stok Tükeniyor',
      budget: '₺12,000',
      spent: '₺9,876',
      impressions: '198,234',
      clicks: '3,456',
      ctr: '1.74%',
      cpc: '₺2.86',
      roas: '4.9x',
    },
    {
      status: (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ),
      name: 'Yılbaşı Özel',
      budget: '₺30,000',
      spent: '₺22,345',
      impressions: '456,789',
      clicks: '6,789',
      ctr: '1.49%',
      cpc: '₺3.29',
      roas: '5.5x',
    },
  ]

  return (
    <>
      <Topbar
        title="Reklam Yöneticisi"
        description="Meta reklam kampanyalarınızı yönetin"
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
              value="₺87,503"
              change={12.5}
              trend="up"
            />
            <StatCard
              title="Alışveriş Dönüşümü"
              value="1,234"
              change={8.3}
              trend="up"
            />
            <StatCard
              title="ROAS"
              value="4.8x"
              change={15.2}
              trend="up"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <Toolbar />
            <div className="p-6">
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

