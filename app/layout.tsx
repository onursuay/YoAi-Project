import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';
import { AdAccountProvider } from '@/lib/contexts/AdAccountContext';

export const metadata: Metadata = {
  title: 'YOAI - Marketing Dashboard',
  description: 'AI-powered marketing intelligence dashboard',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AdAccountProvider>
          {children}
        </AdAccountProvider>
      </body>
    </html>
  );
}

