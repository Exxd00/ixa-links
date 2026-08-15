import './globals.css';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './site-config';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'IXA Agency | Sichtbar. Messbar. Wirksam.',
    template: '%s | IXA Agency',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: ['IXA Agency', 'IXA Leads', 'Lead-Generierung', 'Google Ads', 'Social Media Marketing'],
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'IXA Agency | Sichtbar. Messbar. Wirksam.',
    description: SITE_DESCRIPTION,
    images: [{
      url: '/renders/ixa-logo-3d.png',
      width: 1800,
      height: 1350,
      alt: 'IXA Agency Logo',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IXA Agency | Sichtbar. Messbar. Wirksam.',
    description: SITE_DESCRIPTION,
    images: ['/renders/ixa-logo-3d.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7faf9',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
