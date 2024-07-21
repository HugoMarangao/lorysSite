// src/app/page.tsx

import BannerPrincipal from '@/componente/BannerPrincipal/BannerPrincipal';
import Header from '../componente/Header/Header';
import './globals.css';
import ProductCarousel from '@/componente/Produtos/ProdutosCarousel';
import BannerBody from '@/componente/BannerBody/BannerBody';
import Footer from '@/componente/Footer/Footer';

const Page: React.FC = () => {
  return (
    <div style={{background: "#f5f5f5", maxWidth:1780,alignItems:'center',justifyContent:'center'}}>
      <Header />
      <main>
        <BannerPrincipal/>
        <ProductCarousel/>
        <BannerBody/>
        <ProductCarousel/>
        <ProductCarousel/>
        <BannerBody/>
        <Footer/>
      </main>
    </div>
  );
};

export default Page;
