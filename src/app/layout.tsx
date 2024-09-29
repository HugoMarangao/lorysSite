import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/Configuracao/Context/AuthContext";
import { CartProvider } from "@/Configuracao/Context/CartContext";
import AnalyticsTracker from "../Configuracao/Firebase/AnalyticsTracker"; // Importa o componente de rastreamento
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lory's Modas",
  description: "Bem-vindo a Lory's Modas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          id="fb-pixel-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '537943838759167');
              fbq('track', 'PageView');
            `,
          }}
        />
        {/* Código noscript para navegadores sem suporte a JavaScript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
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
