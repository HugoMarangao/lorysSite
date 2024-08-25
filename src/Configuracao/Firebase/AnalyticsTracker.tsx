// src/components/AnalyticsTracker.tsx
"use client"; // Este componente é um Client Component

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/Configuracao/Firebase/firebaseConf";
import { logEvent } from "firebase/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Logar evento de visualização de página no Firebase Analytics
    const logPageView = (url: string) => {
      if (analytics) {
        logEvent(analytics, 'page_view', { page_path: url });
      }
    };

    logPageView(pathname); // Log the initial page view

  }, [pathname]);

  return null; // Não renderiza nada na UI
}
