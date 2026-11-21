import type { Metadata } from 'next';
import DiscordWidget from '@/components/landing/DiscordWidget';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://poporroyo.github.io'),
  title: 'POPORROYO // Leonida Network',
  description:
    'Poporroyo — Haciendo historia con todos vosotros. Streamer y YouTuber. Directos, clips, horario y todas las redes en un solo sitio.',
  icons: { icon: '/img/poporroyo.webp' },
  openGraph: {
    type: 'website',
    title: 'POPORROYO // Leonida Network',
    description: 'Haciendo historia con todos vosotros. Streams, clips y comunidad.',
    images: ['/assets/og-cover.jpg'],
    url: 'https://poporroyo.github.io/',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport = {
  themeColor: '#0D0914',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <svg className="grain-overlay" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={3} stitchTiles="stitch" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>

        {children}

        <DiscordWidget />
      </body>
    </html>
  );
}
