// src/app/page.tsx
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Configuracao/Firebase/firebaseConf';
import BannerPrincipal from '@/componente/BannerPrincipal/BannerPrincipal';
import Header from '../componente/Header/Header';
import ProductCarousel from '@/componente/Produtos/ProdutosCarousel';
import BannerBody from '@/componente/BannerBody/BannerBody';
import Footer from '@/componente/Footer/Footer';
// Definição da interface Banner
interface Banner {
  id: string;
  link: string;
  image: string;
}

// Definição da interface Product
interface Product {
  id: string;
  name: string;
  price: string;
  promotion?: string; // Campo opcional
  images: string[];
  colors: string[];
}

// Função para buscar banners
async function fetchBanners() {
  const bannerSnapshot = await getDocs(collection(db, 'banners'));
  return bannerSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      link: data.link || '', // Certifique-se de que 'link' exista
      image: data.image || '' // Certifique-se de que 'image' exista
    };
  }) as Banner[];
}

// Função para buscar produtos
async function fetchProducts() {
  const productSnapshot = await getDocs(collection(db, 'products'));
  return productSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || '', // Certifique-se de que 'name' exista
      price: data.price || '', // Certifique-se de que 'price' exista
      promotion: data.promotion || '', // Pode ser opcional
      images: data.images || [], // Certifique-se de que 'images' exista e seja um array
      colors: data.colors || [] // Certifique-se de que 'colors' exista e seja um array
    };
  }) as Product[];
}


const Page = async () => {
  const banners = await fetchBanners();
  const products = await fetchProducts();

  return (
    <div style={{ background: "#f5f5f5", maxWidth: 1780, alignItems: 'center', justifyContent: 'center' }}>
      <Header />
      <main>
        <BannerPrincipal banners={banners} />
        <ProductCarousel products={products} />
        <BannerBody />
        <ProductCarousel products={products} />
        <ProductCarousel products={products} />
        <BannerBody />
        <Footer />
      </main>
    </div>
  );
};

export default Page;
