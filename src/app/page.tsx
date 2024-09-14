// src/app/page.tsx
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Configuracao/Firebase/firebaseConf';
import BannerPrincipal from '@/componente/BannerPrincipal/BannerPrincipal';
import Header from '../componente/Header/Header';
import HomeContent from '@/componente/Home/HomeContent'; // Importe o novo componente
import Footer from '@/componente/Footer/Footer';

// Definição da interface Banner
interface Banner {
  id: string;
  link: string;
  image: string;
}

// Função para buscar banners
async function fetchBanners() {
  const bannerSnapshot = await getDocs(collection(db, 'banners'));
  return bannerSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      link: data.link || '', // Certifique-se de que 'link' exista
      image: data.image || '', // Certifique-se de que 'image' exista
    };
  }) as Banner[];
}

const Page = async () => {
  const banners = await fetchBanners();

  return (
    <div
      style={{
        background: '#f5f5f5',
        maxWidth: 1780,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Header />
      <main>
        <BannerPrincipal banners={banners} />
        <HomeContent /> {/* Renderize o componente do cliente */}
        <Footer />
      </main>
    </div>
  );
};

export default Page;
