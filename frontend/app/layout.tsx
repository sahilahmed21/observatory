// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider'; // 1. Import

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Observatory',
  description: 'Real-Time API Performance Monitoring',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider> {/* 2. Wrap */}
      </body>
    </html>
  );
}