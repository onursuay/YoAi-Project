'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 dakika boyunca data fresh
            gcTime: 10 * 60 * 1000, // 10 dakika cache'te tut (eski adı: cacheTime)
            refetchOnWindowFocus: false, // Pencere focus'ta yenileme yapma
            retry: 1, // Hata olursa 1 kere tekrar dene
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
