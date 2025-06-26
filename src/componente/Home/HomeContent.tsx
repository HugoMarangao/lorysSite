// src/componente/HomeContent/HomeContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/Configuracao/Firebase/firebaseConf';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { useAuth } from '../../Configuracao/Context/AuthContext';
import { getUserId } from '../../Configuracao/utils/getUserId';
import { getUserSegment } from '../../Configuracao/utils/segmentUsers';
import ProductCarousel from '@/componente/Produtos/ProdutosCarousel';
import BannerBody from '@/componente/BannerBody/BannerBody';
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import ProductSkeleton from '../Produtos/ProdutosSkeletom/ProductSkeleton';

interface Product {
  id: string;
  name: string;
  price: string;
  promotion?: string;
  images: string[];
  colors: string[];
}
interface Banner {
  id: string;
  image: string;
  alt: string;
  link?: string;
}

async function fetchProducts(): Promise<Product[]> {
  const productSnapshot = await getDocs(collection(db, 'products'));
  return productSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || '',
      price: data.price || '',
      promotion: data.promotion || '',
      images: data.images || [],
      colors: data.colors || [],
    };
  }) as Product[];
}

async function fetchProductsByCategories(categories: string[]): Promise<Product[]> {
  const productsRef = collection(db, 'products');
  const productsQuery = query(
    productsRef,
    where('selectedCategories', 'array-contains-any', categories),
    limit(10)
  );
  const productsSnapshot = await getDocs(productsQuery);

  return productsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || '',
      price: data.price || '',
      promotion: data.promotion || '',
      images: data.images || [],
      colors: data.colors || [],
    };
  }) as Product[];
}

async function fetchRecentViewedProducts(userId: string): Promise<Product[]> {
  const userViewsRef = doc(db, 'user_views', userId);
  const userViewsSnap = await getDoc(userViewsRef);

  if (userViewsSnap.exists()) {
    const recentViews: string[] = userViewsSnap.data().recentViews || [];
    if (recentViews.length > 0) {
      const productsRef = collection(db, 'products');
      const productsQuery = query(productsRef, where('__name__', 'in', recentViews));
      const productsSnapshot = await getDocs(productsQuery);
      const products = productsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          price: data.price || '',
          promotion: data.promotion || '',
          images: data.images || [],
          colors: data.colors || [],
        };
      });
      // manter a ordem original
      const ordered = recentViews
        .map(id => products.find(p => p.id === id))
        .filter(Boolean) as Product[];
      return ordered;
    }
  }
  return [];
}

async function fetchPopularProducts(): Promise<Product[]> {
  const productStatsRef = collection(db, 'product_stats');
  const statsSnapshot = await getDocs(query(productStatsRef, orderBy('views', 'desc'), limit(10)));
  const popularIds = statsSnapshot.docs.map(d => d.id);
  if (!popularIds.length) return [];

  const productsRef = collection(db, 'products');
  const productsSnapshot = await getDocs(query(productsRef, where('__name__', 'in', popularIds)));
  const products = productsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || '',
      price: data.price || '',
      promotion: data.promotion || '',
      images: data.images || [],
      colors: data.colors || [],
    };
  });
  const ordered = popularIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[];
  return ordered;
}

async function fetchSpecialOffers(): Promise<Product[]> {
  const productsRef = collection(db, 'products');
  const offersSnapshot = await getDocs(query(productsRef, where('isSpecialOffer', '==', true), limit(10)));
  return offersSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || '',
      price: data.price || '',
      promotion: data.promotion || '',
      images: data.images || [],
      colors: data.colors || [],
    };
  }) as Product[];
}

// utilitário para agrupar banners de 2 em 2
const groupBannersInPairs = (banners: Banner[]): Banner[][] => {
  const pairs: Banner[][] = [];
  for (let i = 0; i < banners.length; i += 2) {
    pairs.push(banners.slice(i, i + 2));
  }
  return pairs;
};

const HomeContent: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [segmentedProducts, setSegmentedProducts] = useState<Product[]>([]);
  const [showSpecialOffers, setShowSpecialOffers] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);

  // agrupando em pares dinamicamente
  const bannerPairs = groupBannersInPairs(banners);

  useEffect(() => {
    const fetchBanners = async () => {
      const snapshot = await getDocs(collection(db, 'banners_body'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Banner[];
      setBanners(data);
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const userId = user ? user.uid : getUserId();
    const load = async () => {
      try {
        const [recent, popular, all] = await Promise.all([
          fetchRecentViewedProducts(userId),
          fetchPopularProducts(),
          fetchProducts(),
        ]);
        setRecentProducts(recent);
        setPopularProducts(popular);
        setProducts(all);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  useEffect(() => {
    const loadConfig = async () => {
      const rc = getRemoteConfig();
      rc.settings.minimumFetchIntervalMillis = 3600000;
      try {
        await fetchAndActivate(rc);
        setShowSpecialOffers(getValue(rc, 'show_special_offers').asBoolean());
      } catch (e) {
        console.error(e);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    const userId = user ? user.uid : getUserId();
    const loadSegmented = async () => {
      const segments = await getUserSegment(userId);
      let arr: Product[] = [];
      if (showSpecialOffers) {
        arr = arr.concat(await fetchSpecialOffers());
      }
      const interest = segments
        .filter(s => s.startsWith('interesse_'))
        .map(s => s.replace('interesse_', ''));
      if (interest.length) {
        arr = arr.concat(await fetchProductsByCategories(interest));
      }
      setSegmentedProducts(arr);
    };
    loadSegmented();
  }, [user, showSpecialOffers]);

  if (loading) {
    return (
      <div className="p-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <>
      {recentProducts.length > 0 && (
        <>
          <h2 className="text-xl font-bold px-5">Seus Produtos Visualizados Recentemente</h2>
          <ProductCarousel products={recentProducts} />
        </>
      )}

      {segmentedProducts.length > 0 && (
        <>
          <h2 className="text-xl font-bold px-5">Recomendações Personalizadas</h2>
          <ProductCarousel products={segmentedProducts} />
        </>
      )}

      {/* === Banner Body Top: primeiro par, se existir === */}
      {bannerPairs[0] && (
        <BannerBody key="banner-top" banners={bannerPairs[0]} />
      )}

      <h2 className="text-xl font-bold px-5">Produtos Populares</h2>
      <ProductCarousel products={popularProducts} />

      {products.length > 0 && (
        <>
          <h2 className="text-xl font-bold px-5">Todos os Produtos</h2>
          <ProductCarousel products={products} />
        </>
      )}

      {/* === Banner Body Bottom: pares subsequentes === */}
      {bannerPairs.slice(1).map((pair, idx) => (
        <BannerBody key={`banner-bottom-${idx}`} banners={pair} />
      ))}
    </>
  );
};

export default HomeContent;