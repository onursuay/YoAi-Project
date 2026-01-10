'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Topbar from '@/components/Topbar'
import { Puzzle, AlertCircle } from 'lucide-react'

interface PlatformStatus {
  connected: boolean
  accountName?: string
  accountId?: string
}

function EntegrasyonContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [metaStatus, setMetaStatus] = useState<PlatformStatus>({ connected: false })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const metaParam = searchParams.get('meta')
    if (metaParam === 'connected' || metaParam === 'error') {
      window.history.replaceState({}, '', '/dashboard/entegrasyon')
    }
    checkMetaConnection()
  }, [searchParams])

  const checkMetaConnection = async () => {
    try {
      const response = await fetch('/api/meta/status')
      if (response.ok) {
        const data = await response.json()
        setMetaStatus({
          connected: data.connected,
          accountName: data.adAccountName,
          accountId: data.adAccountId,
        })
      }
    } catch (error) {
      console.error('Failed to check Meta connection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMetaToggle = async (enable: boolean) => {
    if (enable) {
      router.push('/connect/meta')
    } else {
      if (confirm('Meta bağlantısını kesmek istediğinize emin misiniz?')) {
        await fetch('/api/meta/disconnect', { method: 'POST' })
        setMetaStatus({ connected: false })
      }
    }
  }

  const handleChangeAccount = () => {
    router.push('/connect/meta')
  }

  return (
    <>
      <Topbar 
        title="Entegrasyon" 
        description="Reklam ve raporlama platformlarınızı bağlayın"
      />
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Puzzle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Entegrasyon
                </h2>
                <p className="text-gray-600">
                  Reklam ve raporlama platformlarınızı bağlayarak kampanyalarınızı tek bir yerden yönetin.
                </p>
              </div>
            </div>
          </div>

          {/* Reklam Platformları */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reklam Platformları
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Meta Ads */}
              <div className={`bg-white rounded-xl border-2 p-6 transition-all ${
                metaStatus.connected ? 'border-primary' : 'border-gray-200'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-transparent flex items-center justify-center">
                      <img src="/integration-icons/meta.svg" alt="" className="h-6 w-6 object-contain" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Meta Ads</h4>
                      <p className={`text-sm font-medium ${
                        metaStatus.connected ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {metaStatus.connected ? 'Bağlı' : 'Bağlanmadı'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMetaToggle(!metaStatus.connected)}
                    disabled={isLoading}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${metaStatus.connected ? 'bg-green-500' : 'bg-gray-300'}
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${metaStatus.connected ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {metaStatus.connected && metaStatus.accountName && (
                  <div className="mb-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-900 font-medium mb-1">Hesap:</p>
                    <p className="text-sm text-green-800">{metaStatus.accountName}</p>
                  </div>
                )}

                <button
                  onClick={() => metaStatus.connected ? handleChangeAccount() : handleMetaToggle(true)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    metaStatus.connected 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {metaStatus.connected ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    )}
                  </svg>
                  {metaStatus.connected ? 'Hesabı Değiştir' : 'Hesap bağla'}
                </button>
              </div>

              {/* Google Ads */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 opacity-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-transparent flex items-center justify-center">
                      <img src="/integration-icons/google-ads.svg" alt="" className="h-6 w-6 object-contain" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Google Ads</h4>
                      <p className="text-sm text-gray-500">Bağlanmadı</p>
                    </div>
                  </div>
                  <button disabled className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 cursor-not-allowed">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>
                <button disabled className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium text-sm cursor-not-allowed">
                  Yakında
                </button>
              </div>

              {/* TikTok Ads */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 opacity-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-transparent flex items-center justify-center">
                      <img src="/integration-icons/tiktok.svg" alt="" className="h-6 w-6 object-contain" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">TikTok Ads</h4>
                      <p className="text-sm text-gray-500">Yakında</p>
                    </div>
                  </div>
                  <button disabled className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 cursor-not-allowed">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>
                <div className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-400 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>Yakında</span>
                </div>
              </div>
            </div>
          </div>

          {/* Raporlama Platformları */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Raporlama Platformları
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Google Analytics */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 opacity-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-transparent flex items-center justify-center">
                      <img src="/integration-icons/google-analytics.svg" alt="" className="h-6 w-6 object-contain" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Google Analytics</h4>
                      <p className="text-sm text-gray-500">Bağlanmadı</p>
                    </div>
                  </div>
                  <button disabled className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 cursor-not-allowed">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>
                <button disabled className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium text-sm cursor-not-allowed">
                  Yakında
                </button>
              </div>

              {/* Google Search Console */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6 opacity-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-transparent flex items-center justify-center">
                      <img src="/integration-icons/google-search-console.svg" alt="" className="h-6 w-6 object-contain" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Google Search Console</h4>
                      <p className="text-sm text-gray-500">Yakında</p>
                    </div>
                  </div>
                  <button disabled className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 cursor-not-allowed">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>
                <div className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-400 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>Yakında</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function EntegrasyonPage() {
  return (
    <Suspense fallback={
      <>
        <Topbar 
          title="Entegrasyon" 
          description="Reklam ve raporlama platformlarınızı bağlayın"
        />
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-600">Yükleniyor...</p>
            </div>
          </div>
        </div>
      </>
    }>
      <EntegrasyonContent />
    </Suspense>
  )
}
