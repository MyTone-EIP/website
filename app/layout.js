'use client';

import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <title>MyTone - Turn voice into music</title>
        <meta name="description" content="Transformez votre voix en musique instantanément. Voice to MIDI, Stem Separation, et plus encore." />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
