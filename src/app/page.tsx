// src/app/page.tsx
import { cache } from 'react';
import dynamic from 'next/dynamic';
import BannerPrincipal from '@/componente/BannerPrincipal/BannerPrincipal';
import Header from '@/componente/Header/Header';
import Footer from '@/componente/Footer/Footer';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Configuracao/Firebase/firebaseConf';

// Revalida este page every 60 segundos (ISR)
export const revalidate = 60;

// Tipagem dos banners
interface Banner {
  id: string;
  link: string;
  image: string;
}

// Cache interno de React para não refazer fetch na mesma instância
const fetchBanners = cache(async (): Promise<Banner[]> => {
  const snapshot = await getDocs(collection(db, 'banners'));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      link: data.link ?? '',
      image: data.image ?? '',
    };
  });
});

// Carrega o HomeContent de forma dinâmica (SSR=false) para reduzir bundle inicial
const HomeContent = dynamic(
  () => import('@/componente/Home/HomeContent'),
  {
    ssr: false,
    loading: () => <p style={{ textAlign: 'center', padding: '1rem' }}>Carregando conteúdo...</p>,
  }
);

const Page = async () => {
  const banners = await fetchBanners();

  return (
    <div
      style={{
         background: '#f5f5f5',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Header />

      <main >
        <BannerPrincipal banners={banners} />
        <HomeContent />
      </main>

      <Footer />
    </div>
  );
};

export default Page;