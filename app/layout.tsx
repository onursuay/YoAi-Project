import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from './providers/query-provider'

export const metadata: Metadata = {
  title: 'YoAI Dashboard',
  description: 'Reklam ve pazarlama yönetim platformu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
