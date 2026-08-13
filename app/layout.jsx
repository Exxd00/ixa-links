import './globals.css';

export const metadata = {
  title: 'IXA — Links Hub',
  description: 'IXA Agency — Social Media, Websites und Lead Generation.',
  metadataBase: new URL('https://ixa-agency.com'),
  openGraph: {
    title: 'IXA — Links Hub',
    description: 'Alle IXA Angebote an einem Ort.',
    images: ['/renders/ixa-logo-3d.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050606',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
