'use client'

import { useState } from 'react'
import Topbar from '@/components/Topbar'
import { Image, Loader2, Sparkles } from 'lucide-react'

export default function TasarimGorselPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setPreviewUrl('https://via.placeholder.com/800x600/2BB673/FFFFFF?text=Oluşturulan+Görsel')
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <>
      <Topbar 
        title="Görsel Oluştur" 
        description="AI ile reklam görselleri oluşturun"
      />
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Görsel Oluştur
                </h2>
                <p className="text-gray-600">
                  AI destekli görsel oluşturucu ile reklam görsellerinizi hızlıca oluşturun.
                  Platform, boyut ve stil seçeneklerinizi belirleyin.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>Google Ads</option>
                    <option>TikTok</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Boyut
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>1080x1080 (Kare)</option>
                    <option>1080x1350 (Dikey)</option>
                    <option>1200x628 (Yatay)</option>
                    <option>1080x1920 (Hikaye)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dil
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>Türkçe</option>
                    <option>İngilizce</option>
                    <option>Almanca</option>
                    <option>Fransızca</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stil
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>Modern</option>
                    <option>Minimalist</option>
                    <option>Vintage</option>
                    <option>Canlı</option>
                    <option>Profesyonel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marka Tonu
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>Dostane</option>
                    <option>Profesyonel</option>
                    <option>Eğlenceli</option>
                    <option>Ciddi</option>
                    <option>Yaratıcı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama / Prompt
                  </label>
                  <textarea
                    placeholder="Görseliniz için açıklama yazın..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[100px] resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 mb-4 min-h-[500px]">
                  {isGenerating ? (
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Görsel oluşturuluyor...</p>
                    </div>
                  ) : previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Oluşturulan görsel"
                      className="max-w-full max-h-full rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Önizleme</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Görsel oluşturmak için formu doldurun
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Oluşturuluyor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Oluştur</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

