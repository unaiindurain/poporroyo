'use client';

import Script from 'next/script';
import { DISCORD_SERVER_ID } from '@/lib/site-config';

declare global {
  interface Window {
    Crate?: new (config: { server: string; defaultVisibility: string; indicator: boolean }) => unknown;
  }
}

export default function DiscordWidget() {
  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3"
      strategy="afterInteractive"
      onLoad={() => {
        if (window.Crate) {
          new window.Crate({
            server: DISCORD_SERVER_ID,
            defaultVisibility: 'minimized',
            indicator: true,
          });
        }
      }}
    />
  );
}
