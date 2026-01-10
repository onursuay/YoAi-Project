'use client'

import { useState } from 'react'
import Topbar from '@/components/Topbar'
import ChatComposer from '@/components/ChatComposer'
import { Sparkles, Lightbulb, Target, TrendingUp, BarChart3 } from 'lucide-react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function IyzaiPage() {
  const [messages, setMessages] = useState<Message[]>([])

  const suggestions = [
    {
      icon: Lightbulb,
      title: 'Kampanya Önerileri',
      description: 'Reklam kampanyalarınız için AI destekli öneriler alın',
    },
    {
      icon: Target,
      title: 'Hedef Kitle Analizi',
      description: 'Hedef kitlenizi daha iyi anlamak için analiz yapın',
    },
    {
      icon: TrendingUp,
      title: 'Performans Optimizasyonu',
      description: 'Kampanyalarınızın performansını optimize edin',
    },
    {
      icon: BarChart3,
      title: 'Rapor Analizi',
      description: 'Raporlarınızı analiz edin ve öngörüler alın',
    },
  ]

  const handleSend = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Mesajınızı aldım. Size nasıl yardımcı olabilirim?',
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <>
      <Topbar title="IyzAi" description="AI destekli pazarlama asistanınız" />
      <div className="flex-1 overflow-y-auto bg-gray-50 pb-24">
        <div className="max-w-4xl mx-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                IyzAi'ye Hoş Geldiniz
              </h2>
              <p className="text-gray-600 text-center mb-8 max-w-md">
                Pazarlama kampanyalarınız için AI destekli öneriler ve analizler alın.
                Aşağıdaki önerilerden birini seçebilir veya doğrudan soru sorabilirsiniz.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {suggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleSend(suggestion.title)}
                      className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-lg hover:border-primary/50 transition-all group"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {suggestion.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {suggestion.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.isUser
                        ? 'bg-primary text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.isUser ? 'text-primary-100' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ChatComposer onSend={handleSend} />
    </>
  )
}

