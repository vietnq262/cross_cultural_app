import { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/react';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import '@/app/globals.css';
import AppProvider from '@/components/app-providers';
import { GlobalDialogProvider } from '@/components/global-dialogs';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : undefined,
  title: {
    default: 'Smart Cross Cultural Learning',
    template: `%s - Smart Cross Cultural Learning`,
  },
  description: 'Smart Cross Cultural Learning',
  icons: {
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon-16x16.png',
    apple: '/icons/apple-touch-icon.png',
  },
  openGraph: {
    images: '/images/placeholder.jpg',
  },
  twitter: {
    images: '/images/placeholder.jpg',
  },
  manifest: '/site.webmanifest',
  robots: 'noindex',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Toaster position='top-center' />
        <GlobalDialogProvider>
          <Providers
            attribute='class'
            forcedTheme='light'
          >
            <AppProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
            </AppProvider>
          </Providers>
        </GlobalDialogProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
