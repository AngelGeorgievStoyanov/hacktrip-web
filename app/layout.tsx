import type { Metadata, Viewport } from 'next';
import './globals.css';
import { config } from '@/config';
import { UI_COLORS } from '@/constants/ui/colors';
import { Providers } from './providers';
import { SiteStructuredData } from '@/seo/SiteStructuredData';

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: 'HackTrip',
    template: '%s | HackTrip',
  },
  description: 'Discover, plan and share trips with HackTrip.',
  applicationName: 'HackTrip',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HackTrip',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: UI_COLORS.brand.primary,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {/* Safari 26+ samples fixed edge elements for browser chrome tinting. */}
        <div aria-hidden="true" className="safari-edge-color safari-edge-color--top" />
        <div aria-hidden="true" className="safari-edge-color safari-edge-color--bottom" />
        <div className="app-shell">
          <SiteStructuredData />
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
