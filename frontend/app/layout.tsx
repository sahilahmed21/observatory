// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Toaster } from "@/components/ui/sonner";
import { SiteNavbar } from '@/components/layout/SiteNavbar'; // Import the new navbar

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Axon',
  description: 'Real-Time API Performance Monitoring',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={inter.className}>
        <QueryProvider>
          <SiteNavbar />
          {/* Add a main tag to handle the content spacing */}
          <main className="pt-16"> {/* pt-16 gives space for the fixed navbar */}
            {children}
          </main>
          <Toaster richColors />
        </QueryProvider>
      </body>
    </html>
  );
}