'use client'

import { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

interface AdAccount {
  id: string
  name: string
  status: number
  currency: string
  timezone: string
}

interface StatusResponse {
  connected: boolean
  adAccountId?: string
  adAccountName?: string
}

export default function MetaConnectWizard() {
  const [step, setStep] = useState<'init' | 'checking' | 'connected' | 'selecting' | 'error' | 'config-error'>('init')
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentAdAccountId, setCurrentAdAccountId] = useState<string | null>(null)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      setStep('checking')
      setError(null)
      const response = await fetch('/api/meta/status')
      
      if (!response.ok) {
        // If status endpoint returns error, user is not connected
        setStep('init')
        return
      }

      const data: StatusResponse = await response.json()
      
      if (data.connected) {
        // If connected and has selected account, show connected state
        if (data.adAccountId) {
          setCurrentAdAccountId(data.adAccountId)
          // Try to load accounts to show account info
          try {
            await loadAdAccounts()
          } catch (err) {
            // If accounts can't be loaded, still show connected with account ID
            console.warn('Failed to load accounts:', err)
          }
          setStep('connected')
        } else {
          // Connected but no account selected, show selection
          await loadAdAccounts()
        }
      } else {
        // Not connected
        setStep('init')
      }
    } catch (err) {
      // Network or other errors - show error state
      setError('Durum kontrolü başarısız')
      setStep('error')
    }
  }

  const handleConnect = () => {
    window.location.href = '/api/meta/login'
  }

  const loadAdAccounts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/meta/adaccounts')
      
      if (!response.ok) {
        if (response.status === 401) {
          // Not authorized - go back to init
          setStep('init')
          return
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Hesaplar yüklenemedi')
      }

      const data = await response.json()
      const accounts = data.data || []
      setAdAccounts(accounts)
      
      if (accounts.length > 0) {
        setStep('selecting')
      } else {
        setError('Reklam hesabı bulunamadı')
        setStep('error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hesaplar yüklenirken hata oluştu')
      setStep('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectAccount = async () => {
    if (!selectedAccountId) {
      setError('Lütfen bir hesap seçin')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Find selected account to get name
      const selectedAccount = adAccounts.find(acc => acc.id === selectedAccountId)
      const adAccountName = selectedAccount?.name || ''

      const response = await fetch('/api/meta/select-adaccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          adAccountId: selectedAccountId,
          adAccountName: adAccountName,
        }),
      })

      if (!response.ok) {
        if (response.status === 400) {
          setStep('config-error')
          return
        }
        throw new Error('Hesap seçimi kaydedilemedi')
      }

      setCurrentAdAccountId(selectedAccountId)
      setStep('connected')
      
      // Reload page to show selected account in integration page
      window.location.reload()
    } catch (err) {
      setError('Hesap seçimi başarısız')
      setStep('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeAccount = () => {
    setStep('selecting')
    setSelectedAccountId('')
    loadAdAccounts()
  }

  if (step === 'config-error') {
    return (
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">Konfigürasyon eksik</p>
            <p className="text-xs text-yellow-700 mt-1">
              Meta entegrasyonu için gerekli ortam değişkenleri tanımlı değil.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'checking') {
    return (
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Durum kontrol ediliyor...</span>
      </div>
    )
  }

  if (step === 'connected' && currentAdAccountId) {
    const selectedAccount = adAccounts.find((acc) => acc.id === currentAdAccountId)
    return (
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-700">Bağlı</span>
        </div>
        {selectedAccount ? (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <span className="font-medium">Hesap: {selectedAccount.name}</span>
            {selectedAccount.currency && (
              <span className="ml-2">({selectedAccount.currency})</span>
            )}
          </div>
        ) : (
          <div className="text-xs text-gray-500">Hesap seçilmedi</div>
        )}
        <button
          onClick={handleChangeAccount}
          className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Hesabı Değiştir</span>
        </button>
      </div>
    )
  }

  if (step === 'selecting') {
    return (
      <div className="mt-4 space-y-3">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Reklam Hesabı Seçin
          </label>
          <select
            value={selectedAccountId}
            onChange={async (e) => {
              const newAccountId = e.target.value;
              setSelectedAccountId(newAccountId);
              
              // Save selection immediately on change
              if (newAccountId) {
                try {
                  setIsLoading(true);
                  await fetch("/api/meta/selected-adaccount", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ adAccountId: newAccountId }),
                  });
                  // Refresh page to update data
                  window.location.reload();
                } catch (err) {
                  console.error("Failed to save account selection:", err);
                  setError("Hesap kaydedilemedi");
                } finally {
                  setIsLoading(false);
                }
              }
            }}
            disabled={isLoading}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
          >
            <option value="">Hesap seçin...</option>
            {adAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} {account.currency && `(${account.currency})`}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="mt-4 space-y-3">
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-red-800">Hata</p>
              {error && <p className="text-xs text-red-700 mt-1">{error}</p>}
            </div>
          </div>
        </div>
        <button
          onClick={checkStatus}
          className="w-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleConnect}
        className="w-full flex items-center justify-center gap-2 text-primary text-sm font-medium hover:text-primary/80 transition-colors px-4 py-2 border border-primary rounded-lg hover:bg-primary/5"
      >
        Meta'ya Bağlan
      </button>
    </div>
  )
}

