// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { AuthProvider } from '@/Configuracao/Context/AuthContext';
import { CartProvider } from '@/Configuracao/Context/CartContext';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Lory's Modas",
  description: "Bem-vindo a Lory's Modas",
};

// AnalyticsTracker só roda no cliente, carregado dinamicamente
const AnalyticsTracker = dynamic(
  () => import('@/Configuracao/Firebase/AnalyticsTracker'),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          src="/scripts/fb-pixel.js"
          strategy="afterInteractive"
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=537943838759167&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {children}
            <AnalyticsTracker />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}