import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import { AuthProvider } from '@/context/AuthContext';
import { RealsProvider } from '@/context/RealsContext';
import { HypePollsProvider } from '@/context/HypePollsContext';
import { BeastWeekCycleProvider } from '@/context/BeastWeekCycleContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0A0A0B',
  colorScheme: 'dark',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Yollr Beast™ — Yo\'ll r Beast',
    template: '%s | Yollr Beast™',
  },
  description: 'Every week, your campus becomes the arena. Compete in weekly challenges, vote for winners, and become Beast of the Week. Win prizes, earn tokens, and star in your campus story.',
  keywords: [
    'campus',
    'social',
    'competition',
    'challenges',
    'college',
    'university',
    'Gen Z',
    'Beast',
    'weekly challenge',
    'campus culture',
    'student life',
  ],
  authors: [{ name: 'Yollr Team' }],
  creator: 'Yollr',
  publisher: 'Yollr',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yollr.app',
    siteName: 'Yollr Beast™',
    title: 'Yollr Beast™ — Yo\'ll r Beast',
    description: 'Every week, your campus becomes the arena. Compete, vote, win.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yollr Beast™',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yollr Beast™ — Yo\'ll r Beast',
    description: 'Every week, your campus becomes the arena. Compete, vote, win.',
    images: ['/og-image.png'],
    creator: '@yollrapp',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Yollr Beast™',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-nightfall text-ash min-h-screen">
        <AuthProvider>
          <RealsProvider>
            <HypePollsProvider>
              <BeastWeekCycleProvider>
                <ClientLayout>{children}</ClientLayout>
              </BeastWeekCycleProvider>
            </HypePollsProvider>
          </RealsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
