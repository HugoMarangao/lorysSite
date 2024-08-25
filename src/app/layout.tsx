import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/Configuracao/Context/AuthContext";
import { CartProvider } from "@/Configuracao/Context/CartContext";
import AnalyticsTracker from "../Configuracao/Firebase/AnalyticsTracker"; // Importa o componente de rastreamento

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
    <html lang="en">
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
