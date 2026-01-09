'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AdAccount {
  id: string
  name: string
  account_id: string
}

export default function MetaConnectWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isConnected, setIsConnected] = useState(false)
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/meta/status')
      if (response.ok) {
        const data = await response.json()
        if (data.connected) {
          setIsConnected(true)
          setStep(3)
          await fetchAdAccounts()
        }
      }
    } catch (error) {
      console.error('Connection check failed:', error)
    }
  }

  const fetchAdAccounts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/meta/adaccounts')
      if (response.ok) {
        const data = await response.json()
        setAdAccounts(data.accounts || [])
      }
    } catch (error) {
      console.error('Failed to fetch ad accounts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = () => {
    window.location.href = '/api/meta/login'
  }

  const handleSelectAccount = async () => {
    if (!selectedAccount) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/meta/select-adaccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adAccountId: selectedAccount }),
      })

      if (response.ok) {
        setStep(4)
        setTimeout(() => {
          router.push('/dashboard/reklam/meta')
        }, 2000)
      }
    } catch (error) {
      console.error('Account selection failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= num
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`w-16 h-1 ${
                      step > num ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Hoş Geldiniz</span>
            <span>Bağlan</span>
            <span>Hesap Seç</span>
            <span>Tamamlandı</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Meta Reklam Hesabınızı Bağlayın
              </h2>
              <p className="text-gray-600 mb-8">
                YoAI Dashboard üzerinden Meta reklamlarınızı yönetmek için hesabınızı bağlayın.
              </p>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                Başlayın
              </button>
            </div>
          )}

          {/* Step 2: Connect */}
          {step === 2 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Meta ile Bağlantı Kurun
              </h2>
              <p className="text-gray-600 mb-8">
                Meta hesabınıza giriş yapın ve gerekli izinleri verin.
              </p>
              <ul className="text-left text-sm text-gray-600 mb-8 space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Reklam kampanyalarınızı görüntüleyin
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Kampanya oluşturun ve yönetin
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Performans verilerini analiz edin
                </li>
              </ul>
              <button
                onClick={handleConnect}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Meta ile Bağlan
              </button>
            </div>
          )}

          {/* Step 3: Select Ad Account */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Reklam Hesabı Seçin
                </h2>
                <p className="text-gray-600">
                  Kullanmak istediğiniz reklam hesabını seçin
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Hesaplar yükleniyor...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {adAccounts.map((account) => (
                      <label
                        key={account.id}
                        className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        style={{
                          borderColor: selectedAccount === account.id ? '#10B981' : '#E5E7EB'
                        }}
                      >
                        <input
                          type="radio"
                          name="adaccount"
                          value={account.id}
                          checked={selectedAccount === account.id}
                          onChange={(e) => setSelectedAccount(e.target.value)}
                          className="w-4 h-4 text-green-600"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{account.name}</div>
                          <div className="text-sm text-gray-500">ID: {account.account_id}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={handleSelectAccount}
                    disabled={!selectedAccount || isLoading}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Devam Et
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bağlantı Başarılı!
              </h2>
              <p className="text-gray-600 mb-8">
                Meta hesabınız başarıyla bağlandı. Reklam panelinize yönlendiriliyorsunuz...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
