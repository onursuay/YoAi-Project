import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YOAI - Marketing Dashboard',
  description: 'AI-powered marketing intelligence dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

